import { Breadcrumbs } from "./Breadcrumbs";

interface HeaderProps {
  title: string;
  lead?: string;
}

export function Header({ title, lead }: HeaderProps) {
  return (
    <header className="page-header">
      <div className="container">
        <Breadcrumbs />
        <h1>{title}</h1>
        {lead && <p className="lead">{lead}</p>}
      </div>
    </header>
  );
}
