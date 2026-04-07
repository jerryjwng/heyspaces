import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Search, Plus, Menu, X, LayoutDashboard, UserCog, LogOut, User } from 'lucide-react';
import { useAuthContext } from '@/contexts/auth-context';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Sheet, SheetContent, SheetTrigger, SheetClose } from '@/components/ui/sheet';

interface NavbarProps {
  onSearchClick?: () => void;
}

export function Navbar({ onSearchClick }: NavbarProps) {
  const { user, signOut } = useAuthContext();
  const navigate = useNavigate();
  const location = useLocation();

  const navLinks = [
    { label: 'Inserate', href: '/inserate' },
    { label: 'Mein Dashboard', href: '/dashboard' },
    { label: 'Favoriten', href: '/anfragen' },
  ];

  const handleCreateClick = () => {
    if (!user) {
      navigate('/login');
    } else {
      navigate('/inserate/neu');
    }
  };

  const initials = user ? `${user.vorname[0]}${user.nachname[0]}` : '';

  return (
    <header className="sticky top-0 z-50 h-16 border-b border-border bg-card">
      <div className="container mx-auto flex h-full items-center justify-between px-6">
        {/* Left: Logo */}
        <Link to="/" className="text-lg font-semibold text-foreground">
          HeySpaces
        </Link>

        {/* Center: Nav links (desktop) */}
        <nav className="hidden items-center gap-8 md:flex">
          {navLinks.map(link => (
            <Link
              key={link.href}
              to={link.href}
              className={`text-sm transition-colors hover:text-foreground ${
                location.pathname === link.href ? 'font-medium text-foreground' : 'text-muted-foreground'
              }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Right: Actions */}
        <div className="hidden items-center gap-3 md:flex">
          <Button
            variant="secondary"
            className="rounded-full gap-2"
            onClick={onSearchClick}
          >
            <Search className="h-4 w-4" />
            Suchen
          </Button>

          <Button
            className="rounded-full gap-2"
            onClick={handleCreateClick}
          >
            <Plus className="h-4 w-4" />
            Inserat erstellen
          </Button>

          {/* Profile */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="flex h-9 w-9 items-center justify-center rounded-full bg-primary text-primary-foreground text-xs font-medium">
                {user ? initials : <User className="h-4 w-4" />}
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              {user ? (
                <>
                  <div className="px-3 py-2">
                    <p className="text-sm font-medium">{user.vorname} {user.nachname}</p>
                    <p className="text-xs text-muted-foreground">{user.email}</p>
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => navigate('/dashboard')}>
                    <LayoutDashboard className="mr-2 h-4 w-4" /> Mein Dashboard
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => navigate('/profil')}>
                    <UserCog className="mr-2 h-4 w-4" /> Profil bearbeiten
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={signOut} className="text-destructive focus:text-destructive">
                    <LogOut className="mr-2 h-4 w-4" /> Abmelden
                  </DropdownMenuItem>
                </>
              ) : (
                <>
                  <DropdownMenuItem onClick={() => navigate('/login')}>Anmelden</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => navigate('/registrieren')}>Registrieren</DropdownMenuItem>
                </>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Mobile: Hamburger */}
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="md:hidden">
              <Menu className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-72">
            <div className="flex flex-col gap-6 pt-8">
              <Link to="/" className="text-lg font-semibold">HeySpaces</Link>
              <nav className="flex flex-col gap-4">
                {navLinks.map(link => (
                  <SheetClose asChild key={link.href}>
                    <Link to={link.href} className="text-sm text-muted-foreground hover:text-foreground">
                      {link.label}
                    </Link>
                  </SheetClose>
                ))}
              </nav>
              <div className="flex flex-col gap-3">
                <SheetClose asChild>
                  <Button variant="secondary" className="rounded-full gap-2 justify-start" onClick={onSearchClick}>
                    <Search className="h-4 w-4" /> Suchen
                  </Button>
                </SheetClose>
                <SheetClose asChild>
                  <Button className="rounded-full gap-2 justify-start" onClick={handleCreateClick}>
                    <Plus className="h-4 w-4" /> Inserat erstellen
                  </Button>
                </SheetClose>
              </div>
              <div className="border-t border-border pt-4">
                {user ? (
                  <div className="flex flex-col gap-3">
                    <p className="text-sm font-medium">{user.vorname} {user.nachname}</p>
                    <SheetClose asChild>
                      <Link to="/dashboard" className="text-sm text-muted-foreground hover:text-foreground">Mein Dashboard</Link>
                    </SheetClose>
                    <button onClick={signOut} className="text-sm text-destructive text-left">Abmelden</button>
                  </div>
                ) : (
                  <div className="flex flex-col gap-3">
                    <SheetClose asChild>
                      <Link to="/login" className="text-sm text-muted-foreground hover:text-foreground">Anmelden</Link>
                    </SheetClose>
                    <SheetClose asChild>
                      <Link to="/registrieren" className="text-sm text-muted-foreground hover:text-foreground">Registrieren</Link>
                    </SheetClose>
                  </div>
                )}
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
}
