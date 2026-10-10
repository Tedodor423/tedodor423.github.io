import { stringToSlug } from "../utils";
import { Wordmark } from "./Wordmark";
import "./Footer.css";

/* Where to find the team outside the wiki. Each row names the channel; the
 * address itself, printed as it is in the body mono, slides out beside the
 * name when the row is pointed at, so a reader can see where a link goes
 * before following it. A row with an empty value is not rendered. */
const INSTAGRAM_HANDLE: string = "oxfordigem";
const LINKEDIN_URL: string = "https://www.linkedin.com/company/uoo-igem/";
const EMAIL = "igem.oxforduniversity@gmail.com";

/* Drawn here as line glyphs on a 24-unit grid, in the footer's own stroke,
 * rather than taken from an icon set or the companies' logo files. */
const ICONS = {
  instagram: (
    <>
      <rect x={3.5} y={3.5} width={17} height={17} rx={5} />
      <circle cx={12} cy={12} r={4} />
      <circle className="is-filled" cx={17} cy={7} r={1.1} />
    </>
  ),
  linkedin: (
    <>
      <rect x={3.5} y={3.5} width={17} height={17} rx={2} />
      <circle className="is-filled" cx={8.25} cy={8} r={1.1} />
      <path d="M8.25 10.75V16.5M11.75 16.5V10.75M11.75 13.25c0-1.6 1-2.6 2.3-2.6s2.2.9 2.2 2.6v3.25" />
    </>
  ),
  email: (
    <>
      <rect x={3} y={5.5} width={18} height={13} rx={1} />
      <path d="M3.5 6.5 12 13l8.5-6.5" />
    </>
  ),
};

type Contact = {
  label: string;
  icon: keyof typeof ICONS;
  href: string;
  text: string;
};

function contacts(): Contact[] {
  const rows: Contact[] = [];
  if (INSTAGRAM_HANDLE) {
    rows.push({
      label: "Instagram",
      icon: "instagram",
      href: `https://www.instagram.com/${INSTAGRAM_HANDLE}/`,
      text: `@${INSTAGRAM_HANDLE}`,
    });
  }
  if (LINKEDIN_URL) {
    rows.push({
      label: "LinkedIn",
      icon: "linkedin",
      href: LINKEDIN_URL,
      text: LINKEDIN_URL.replace(/^https?:\/\/(www\.)?/, "").replace(/\/$/, ""),
    });
  }
  rows.push({
    label: "Email",
    icon: "email",
    href: `mailto:${EMAIL}`,
    text: EMAIL,
  });
  return rows;
}

export function Footer() {
  const teamYear = import.meta.env.VITE_TEAM_YEAR;
  const teamName = import.meta.env.VITE_TEAM_NAME;
  const teamSlug = stringToSlug(teamName);

  return (
    <footer className="site-footer bg-dark text-white">
      <div className="container">
        <div className="site-footer-top">
          <div className="site-footer-brand">
            <p className="site-footer-wordmark">
              <Wordmark />
            </p>
            <p className="site-footer-team">
              {teamName} iGEM {teamYear}
            </p>
          </div>

          <address className="site-footer-contact">
            <h2 className="site-footer-heading">Contact us</h2>
            <ul>
              {contacts().map((c) => (
                <li key={c.label}>
                  <a className="site-footer-contact-row" href={c.href}>
                    <svg
                      className="site-footer-icon"
                      viewBox="0 0 24 24"
                      aria-hidden="true"
                      focusable="false"
                    >
                      {ICONS[c.icon]}
                    </svg>
                    <span className="site-footer-contact-text">
                      <span className="site-footer-contact-name">
                        {c.label}
                      </span>
                      <span className="site-footer-contact-address">
                        <span>{c.text}</span>
                      </span>
                    </span>
                  </a>
                </li>
              ))}
            </ul>
          </address>
        </div>

        {/* The following MUST be on every page: license information and link to the repository on gitlab.igem.org */}
        <div className="site-footer-legal">
          <p className="mb-0">
            <small>
              © {teamYear} - Content on this site is licensed under a{" "}
              <a
                className="subfoot"
                href="https://creativecommons.org/licenses/by/4.0/"
                rel="license"
              >
                Creative Commons Attribution 4.0 International license
              </a>
              .
            </small>
          </p>
          <p>
            <small>
              The repository used to create this website is available at{" "}
              <a href={`https://gitlab.igem.org/${teamYear}/${teamSlug}`}>
                gitlab.igem.org/{teamYear}/{teamSlug}
              </a>
              .
            </small>
          </p>
        </div>
      </div>
    </footer>
  );
}
