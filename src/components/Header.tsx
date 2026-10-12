import { Breadcrumbs } from "./Breadcrumbs";
import { Ink } from "./CombBackdrop";

interface HeaderProps {
  title: string;
  lead?: string;
  /** Centre the title and lead (Page.centredTitle in src/pages.ts). */
  centred?: boolean;
}

export function Header({ title, lead, centred }: HeaderProps) {
  return (
    <header className={`page-header${centred ? " is-centred" : ""}`}>
      <div className="container">
        <Breadcrumbs />
        {/* <Ink> is the comb backdrop's type trial; it changes nothing
            unless that trial draws a ground behind every line. */}
        <h1>
          <Ink>{title}</Ink>
        </h1>
        {lead && (
          <p className="lead">
            <Ink>{lead}</Ink>
          </p>
        )}
      </div>
    </header>
  );
}
