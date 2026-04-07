import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Search, Home, MessageSquare, Shield } from 'lucide-react';
import { Navbar } from '@/components/shared/navbar';
import { Footer } from '@/components/shared/footer';
import { FilterBar } from '@/components/shared/filter-bar';
import { InseratGrid } from '@/components/inserate/inserat-grid';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { mockInserate } from '@/lib/mock-data';

const Index = () => {
  const [filterOpen, setFilterOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar onSearchClick={() => setFilterOpen(!filterOpen)} />
      {filterOpen && <FilterBar expanded onToggle={() => setFilterOpen(false)} />}

      {/* Hero */}
      <section className="container mx-auto px-6 py-20 text-center md:py-28">
        <h1 className="text-4xl font-bold tracking-tight md:text-5xl lg:text-6xl">
          Deine neue Wohnung wartet.
        </h1>
        <p className="mx-auto mt-4 max-w-xl text-lg text-muted-foreground">
          Mieten, kaufen oder WG-Zimmer finden — direkt vom Anbieter, ohne Provision.
        </p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
          <Button asChild className="rounded-full gap-2 h-12 px-6 text-base">
            <Link to="/inserate">Inserate entdecken <ArrowRight className="h-4 w-4" /></Link>
          </Button>
          <Button asChild variant="outline" className="rounded-full gap-2 h-12 px-6 text-base">
            <Link to="/inserate/neu">Inserat aufgeben</Link>
          </Button>
        </div>
      </section>

      {/* Kategorie Cards */}
      <section className="container mx-auto px-6 pb-16">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          {[
            { label: 'Mieten', href: '/inserate?kategorie=mieten', desc: 'Wohnungen & Häuser zur Miete' },
            { label: 'WG-Zimmer', href: '/inserate?kategorie=wg_zimmer', desc: 'Zimmer in Wohngemeinschaften' },
            { label: 'Kaufen', href: '/inserate?kategorie=kaufen', desc: 'Immobilien zum Kauf' },
          ].map(cat => (
            <Link
              key={cat.label}
              to={cat.href}
              className="group rounded-xl border border-border bg-card p-6 transition-colors hover:bg-secondary"
            >
              <h3 className="text-lg font-semibold">{cat.label}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{cat.desc}</p>
            </Link>
          ))}
        </div>
      </section>

      {/* Neueste Inserate */}
      <section className="container mx-auto px-6 pb-16">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-2xl font-semibold">Neu auf HeySpaces</h2>
          <Button asChild variant="ghost" className="gap-1 text-muted-foreground">
            <Link to="/inserate">Alle ansehen <ArrowRight className="h-4 w-4" /></Link>
          </Button>
        </div>
        <InseratGrid inserate={mockInserate.slice(0, 6)} />
      </section>

      {/* So funktioniert's */}
      <section className="border-t border-border bg-card">
        <div className="container mx-auto px-6 py-16">
          <h2 className="mb-10 text-center text-2xl font-semibold">So funktioniert's</h2>
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-3">
            {[
              { icon: Search, title: 'Inserat finden oder aufgeben', desc: 'Durchsuche tausende Angebote oder erstelle dein eigenes Inserat in wenigen Minuten.' },
              { icon: MessageSquare, title: 'Direkt Anfrage senden', desc: 'Kontaktiere Anbieter direkt — ohne Umwege oder versteckte Kosten.' },
              { icon: Shield, title: 'Ohne Provision einziehen', desc: 'Keine Maklergebühren, keine Provisionen. Du sparst bares Geld.' },
            ].map((step, i) => (
              <div key={i} className="text-center">
                <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-secondary">
                  <step.icon className="h-5 w-5 text-foreground" />
                </div>
                <h3 className="font-semibold">{step.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="container mx-auto px-6 py-16 text-center">
        <h2 className="text-2xl font-semibold">Bleib auf dem Laufenden</h2>
        <p className="mt-2 text-muted-foreground">Erhalte neue Inserate und Tipps direkt in dein Postfach.</p>
        <div className="mx-auto mt-6 flex max-w-sm gap-3">
          <Input placeholder="E-Mail-Adresse" type="email" className="rounded-full" />
          <Button className="rounded-full">Anmelden</Button>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Index;
