import { useEffect, useRef, type RefObject } from "react";
import "./AlphaClip.css";

/* A video with a transparent background that plays in every browser.
 *
 * VP9 in WebM carries an alpha channel that Chrome and Firefox draw, but
 * Safari, and so every browser on iOS, plays the same file and paints the
 * transparent part black. HEVC with alpha would suit Safari alone and can
 * only be encoded on a Mac. So the clip is "stacked": an ordinary H.264 MP4
 * twice the frame's height, the colour premultiplied onto black in the top
 * half and the alpha as grey in the bottom half, and a WebGL canvas puts
 * the two back together, frame by frame. Made from a VP9-alpha source with
 *
 *   ffmpeg -c:v libvpx-vp9 -i in.webm -filter_complex "[0:v]scale=1600:900,
 *     format=rgba,split[c][a];[c]premultiply=inplace=1,format=yuv420p[co];
 *     [a]format=rgba,alphaextract,format=gray,format=yuv420p[al];
 *     [co][al]vstack,format=yuv420p" -c:v libx264 -preset slow -crf 21
 *     -movflags +faststart -an out.mp4
 *
 * (libvpx-vp9 as the decoder: FFmpeg's own VP9 decoder drops the alpha).
 *
 * The video element is the clock: the caller plays, pauses and paces it
 * through `video`, and the canvas follows whatever frame it shows. It stays
 * laid out under the canvas at full size, only see-through, because WebKit
 * may pause a muted video it judges hidden. A file on another origin needs
 * CORS for WebGL to read it; static.igem.wiki sends
 * Access-Control-Allow-Origin: *. Without WebGL the clip counts as failed,
 * as a missing file does. */

const VERTEX = `
attribute vec2 corner;
varying vec2 uv;
void main() {
  uv = vec2(corner.x + 1.0, 1.0 - corner.y) * 0.5;
  gl_Position = vec4(corner, 0.0, 1.0);
}`;

const FRAGMENT = `
precision mediump float;
uniform sampler2D frame;
varying vec2 uv;
void main() {
  vec3 colour = texture2D(frame, vec2(uv.x, uv.y * 0.5)).rgb;
  float alpha = texture2D(frame, vec2(uv.x, 0.5 + uv.y * 0.5)).r;
  // Compression can lift the colour above its alpha at the edges, which in
  // premultiplied terms is a glow; hold it to the alpha.
  gl_FragColor = vec4(min(colour, vec3(alpha)), alpha);
}`;

function compile(gl: WebGLRenderingContext, type: number, source: string) {
  const shader = gl.createShader(type);
  if (!shader) return null;
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  return gl.getShaderParameter(shader, gl.COMPILE_STATUS) ? shader : null;
}

/** Sets up the quad and the texture; returns a function that draws the
 *  video's current frame, or null where WebGL is not to be had. */
function painter(canvas: HTMLCanvasElement, video: HTMLVideoElement) {
  const gl = canvas.getContext("webgl", {
    premultipliedAlpha: true,
    antialias: false,
  });
  if (!gl) return null;
  const vertex = compile(gl, gl.VERTEX_SHADER, VERTEX);
  const fragment = compile(gl, gl.FRAGMENT_SHADER, FRAGMENT);
  const program = gl.createProgram();
  if (!vertex || !fragment || !program) return null;
  gl.attachShader(program, vertex);
  gl.attachShader(program, fragment);
  gl.linkProgram(program);
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) return null;
  gl.useProgram(program);

  gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer());
  gl.bufferData(
    gl.ARRAY_BUFFER,
    new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]),
    gl.STATIC_DRAW,
  );
  const corner = gl.getAttribLocation(program, "corner");
  gl.enableVertexAttribArray(corner);
  gl.vertexAttribPointer(corner, 2, gl.FLOAT, false, 0, 0);

  gl.bindTexture(gl.TEXTURE_2D, gl.createTexture());
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);

  return () => {
    const width = video.videoWidth;
    const height = video.videoHeight / 2;
    if (!width || !height) return;
    if (canvas.width !== width || canvas.height !== height) {
      canvas.width = width;
      canvas.height = height;
      gl.viewport(0, 0, width, height);
    }
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, video);
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
  };
}

export function AlphaClip({
  src,
  className,
  video,
  onError,
}: {
  /** The stacked MP4. */
  src: string;
  /** Placed on the frame that holds the canvas; it sets size and place. */
  className?: string;
  video: RefObject<HTMLVideoElement | null>;
  onError: () => void;
}) {
  const canvas = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const surface = canvas.current;
    const clip = video.current;
    if (!surface || !clip) return;
    const paint = painter(surface, clip);
    if (!paint) {
      onError();
      return;
    }

    let stopped = false;
    let pending = 0;
    // A browser with requestVideoFrameCallback draws once per new frame;
    // the rest draw on every animation frame while the clip plays.
    const perFrame = typeof clip.requestVideoFrameCallback === "function";
    const loop = () => {
      if (stopped) return;
      paint();
      if (perFrame) pending = clip.requestVideoFrameCallback(loop);
      else if (!clip.paused) pending = requestAnimationFrame(loop);
    };
    const start = () => {
      if (!perFrame) loop();
    };
    // The first frame, and any frame a seek lands on, while paused.
    const still = () => paint();
    clip.addEventListener("loadeddata", still);
    clip.addEventListener("seeked", still);
    clip.addEventListener("play", start);
    if (clip.readyState >= 2) paint();
    if (perFrame) pending = clip.requestVideoFrameCallback(loop);
    else start();

    return () => {
      stopped = true;
      if (perFrame) clip.cancelVideoFrameCallback(pending);
      else cancelAnimationFrame(pending);
      clip.removeEventListener("loadeddata", still);
      clip.removeEventListener("seeked", still);
      clip.removeEventListener("play", start);
    };
  }, [video, onError]);

  return (
    <div className={`alpha-clip ${className ?? ""}`} aria-hidden="true">
      <video
        ref={video}
        src={src}
        crossOrigin="anonymous"
        loop
        muted
        playsInline
        preload="auto"
        onError={onError}
      />
      <canvas ref={canvas} />
    </div>
  );
}
