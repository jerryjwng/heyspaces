import { Link } from 'react-router-dom';

export function Footer() {
  return (
    <footer className="border-t border-[#1F1F1F] bg-dark">
      <div className="mx-auto max-w-[1200px] px-6 pb-12 pt-20 md:px-12">
        <div className="grid grid-cols-2 gap-10 md:grid-cols-4">
          <div className="col-span-2 md:col-span-1">
            <p className="text-[18px] font-bold tracking-[-0.025em] text-white">HeySpaces</p>
            <p className="mt-3 text-sm text-white/40">Wohnen, ohne Provision.</p>
          </div>

          <FooterCol title="Plattform" links={[
            { label: 'Inserate', href: '/inserate' },
            { label: 'Inserat erstellen', href: '/inserate/neu' },
            { label: 'Dashboard', href: '/dashboard' },
          ]} />

          <FooterCol title="Unternehmen" links={[
            { label: 'Über uns', href: '#' },
            { label: 'Karriere', href: '#' },
            { label: 'Kontakt', href: '#' },
          ]} />

          <FooterCol title="Rechtliches" links={[
            { label: 'Datenschutz', href: '#' },
            { label: 'Impressum', href: '#' },
            { label: 'AGB', href: '#' },
          ]} />
        </div>

        <div className="my-8 h-px bg-[#1F1F1F]" />

        <p className="text-sm text-white/30">© 2025 HeySpaces</p>
      </div>
    </footer>
  );
}

function FooterCol({ title, links }: { title: string; links: { label: string; href: string }[] }) {
  return (
    <div>
      <p className="mb-5 text-xs font-semibold uppercase tracking-[0.1em] text-white">{title}</p>
      <ul className="space-y-2">
        {links.map(l => (
          <li key={l.label}>
            <Link to={l.href} className="text-sm leading-[2.2] text-white/50 transition-colors hover:text-white/90">
              {l.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
