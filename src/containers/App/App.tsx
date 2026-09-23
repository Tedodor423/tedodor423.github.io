import "bootstrap/dist/css/bootstrap.min.css";
import "../../styles/brand.css";
import "./App.css";
import { useMemo } from "react";
import { Route, Routes, useSearchParams } from "react-router-dom";
import { getPathMapping, formsOf } from "../../utils";
import { Navbar } from "../../components/Navbar";
import { Header } from "../../components/Header";
import { MarkdownPage } from "../../components/MarkdownPage";
import { SectionLinks } from "../../components/SectionLinks";
import { NotFound } from "../../components/NotFound";
import { SearchPage } from "../../components/SearchPage";
import { ScrollToHash } from "../../components/ScrollToHash";
import { Footer } from "../../components/Footer";
import { BeeScene } from "../../components/BeeScene";
import { CombBands } from "../../components/CombBands";

const App = () => {
  const pathMapping = getPathMapping();
  const [params] = useSearchParams();

  // A page opened from a search result carries the query that found it, and
  // marks those words in its text. Any other way in, and `?q=` is absent and
  // nothing is marked.
  const query = params.get("q");
  // Memoised on the query itself: a fresh array each render would make every
  // page rebuild its highlighting for nothing.
  const marks = useMemo(() => (query ? formsOf(query) : undefined), [query]);

  // The browser tab reads OXFORD:NECTAR on every page, so the title is static
  // and lives in index.html. To tell open tabs apart again, set it per route
  // here instead: document.title = `${title} | OXFORD:NECTAR`.

  return (
    <>
      <ScrollToHash />

      {/* Temporary: the comb treatment on the page bands, and the switch
          that turns it off. See CombBands.tsx. */}
      <CombBands />

      {/* Decorative, every page. Kept outside <Routes> so that navigating does
          not reset the swarm. */}
      <BeeScene />

      <Navbar />

      <main id="content">
        <Routes>
          {/* Not in pages.ts: that table is the Markdown pages, and this one
              is a component. It is reached from the menu, never listed in it. */}
          <Route
            path="/search"
            element={
              <>
                <Header title="Search results" />
                <div className="container">
                  <SearchPage />
                </div>
              </>
            }
          />
          {Object.entries(pathMapping).map(
            ([path, { title, lead, content }]) => (
              <Route
                key={path}
                path={path}
                element={
                  <>
                    <Header title={title} lead={lead} />
                    <div className="container">
                      <SectionLinks />
                    </div>
                    {/* Outside the container: a page body is a run of bands,
                        and a band runs the full width of the window with a
                        container of its own inside it. */}
                    <MarkdownPage content={content} marks={marks} />
                  </>
                }
              />
            ),
          )}
          <Route
            path="*"
            element={
              <>
                <Header
                  title="Not Found"
                  lead="The requested URL was not found on this server."
                />
                <div className="container">
                  <NotFound />
                </div>
              </>
            }
          />
        </Routes>
      </main>

      {/* MUST mention license AND have a link to team wiki's repository on gitlab.igem.org */}
      <Footer />
    </>
  );
};

export default App;
