import { Breadcrumbs } from "./Breadcrumbs";

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
        <h1>{title}</h1>
        {lead && <p className="lead">{lead}</p>}
      </div>
    </header>
  );
}
