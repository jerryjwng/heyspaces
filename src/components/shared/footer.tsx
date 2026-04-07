import { Link } from 'react-router-dom';

export function Footer() {
  return (
    <footer className="border-t border-border bg-card">
      <div className="container mx-auto flex flex-col items-center justify-between gap-4 px-6 py-8 sm:flex-row">
        <div className="flex items-center gap-6 text-sm text-muted-foreground">
          <Link to="/inserate" className="hover:text-foreground transition-colors">Inserate</Link>
          <span className="hover:text-foreground transition-colors cursor-pointer">Über uns</span>
          <span className="hover:text-foreground transition-colors cursor-pointer">Datenschutz</span>
          <span className="hover:text-foreground transition-colors cursor-pointer">Impressum</span>
        </div>
        <p className="text-sm text-muted-foreground">© 2025 HeySpaces</p>
      </div>
    </footer>
  );
}
