import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Search, Plus, Menu, LayoutDashboard, UserCog, LogOut } from 'lucide-react';
import { useAuthContext } from '@/contexts/auth-context';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Sheet, SheetContent, SheetTrigger, SheetClose } from '@/components/ui/sheet';
import { cn } from '@/lib/utils';

interface NavbarProps {
  onSearchClick?: () => void;
  /** Hide the navbar search pill (e.g. on /inserate where the FilterBar is the search) */
  hideSearch?: boolean;
}

export function Navbar({ onSearchClick, hideSearch = false }: NavbarProps) {
  const { user, signOut } = useAuthContext();
  const navigate = useNavigate();
  const location = useLocation();

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  const baseLinks = user
    ? [
        { label: 'Inserate', href: '/inserate' },
        { label: 'Mein Dashboard', href: '/dashboard' },
        { label: 'Anfragen', href: '/anfragen' },
      ]
    : [{ label: 'Inserate', href: '/inserate' }];
  // On /inserate the search pill IS the entry point — drop the redundant "Inserate" link
  const navLinks = hideSearch ? baseLinks.filter(l => l.href !== '/inserate') : baseLinks;

  const handleCreateClick = () => {
    if (!user) navigate('/login');
    else navigate('/inserate/neu');
  };

  const handleSearchClick = () => {
    if (onSearchClick) {
      onSearchClick();
    } else {
      navigate('/inserate');
    }
  };

  const initials = user ? `${user.vorname[0]}${user.nachname[0]}` : '';

  return (
    <header className="sticky top-0 z-[100] h-[68px] border-b border-border bg-white/95 backdrop-blur-md">
      <div className="mx-auto flex h-full max-w-[1200px] items-center justify-between px-6 md:px-12">
        {/* Logo */}
        <Link to="/" className="text-[18px] font-bold tracking-[-0.025em] text-foreground">
          HeySpaces
        </Link>

        {/* Center nav (desktop) */}
        <nav className="hidden items-center gap-9 md:flex">
          {navLinks.map(link => {
            const active = location.pathname === link.href;
            return (
              <Link
                key={link.href}
                to={link.href}
                className={cn(
                  'text-sm transition-colors duration-150',
                  active ? 'font-semibold text-foreground' : 'font-medium text-foreground-secondary hover:text-foreground'
                )}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        {/* Right actions */}
        <div className="hidden items-center gap-3 md:flex">
          {!hideSearch && (
            <button
              onClick={handleSearchClick}
              className="inline-flex items-center gap-2 rounded-pill border border-border bg-neutral px-[18px] py-[9px] text-sm font-medium text-foreground-secondary transition-colors hover:border-border-strong"
            >
              <Search className="h-4 w-4" />
              Suchen
            </button>
          )}

          {user ? (
            <>
              <button
                onClick={handleCreateClick}
                className="inline-flex items-center gap-2 rounded-pill bg-primary px-[22px] py-[10px] text-sm font-semibold text-primary-foreground transition-all duration-150 hover:bg-primary-hover hover:-translate-y-px active:scale-[0.98]"
              >
                <Plus className="h-4 w-4" />
                Inserat erstellen
              </button>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="flex h-10 w-10 items-center justify-center rounded-full border-[1.5px] border-border bg-neutral text-[13px] font-semibold text-foreground-secondary transition-colors hover:border-border-strong">
                    {initials}
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  align="end"
                  sideOffset={12}
                  className="min-w-[220px] rounded-2xl border border-border bg-white p-2 shadow-dropdown"
                >
                  <div className="px-3 py-2.5">
                    <p className="text-sm font-bold text-foreground">{user.vorname} {user.nachname}</p>
                    <p className="mt-0.5 text-xs text-foreground-tertiary">{user.email}</p>
                  </div>
                  <DropdownMenuSeparator className="my-1 bg-border" />
                  <DropdownMenuItem onClick={() => navigate('/dashboard')} className="rounded-lg px-3 py-2.5 text-sm focus:bg-neutral">
                    <LayoutDashboard className="mr-2 h-4 w-4" /> Mein Dashboard
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => navigate('/profil')} className="rounded-lg px-3 py-2.5 text-sm focus:bg-neutral">
                    <UserCog className="mr-2 h-4 w-4" /> Profil bearbeiten
                  </DropdownMenuItem>
                  <DropdownMenuSeparator className="my-1 bg-border" />
                  <DropdownMenuItem onClick={handleSignOut} className="rounded-lg px-3 py-2.5 text-sm text-status-red-fg focus:bg-neutral focus:text-status-red-fg">
                    <LogOut className="mr-2 h-4 w-4" /> Abmelden
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : (
            <>
              <button
                onClick={() => navigate('/login')}
                className="inline-flex items-center rounded-pill border-[1.5px] border-foreground bg-transparent px-5 py-[8px] text-sm font-semibold text-foreground transition-colors hover:bg-neutral"
              >
                Anmelden
              </button>
              <button
                onClick={handleCreateClick}
                className="inline-flex items-center gap-2 rounded-pill bg-primary px-[22px] py-[10px] text-sm font-semibold text-primary-foreground transition-all duration-150 hover:bg-primary-hover hover:-translate-y-px active:scale-[0.98]"
              >
                <Plus className="h-4 w-4" />
                Inserat erstellen
              </button>
            </>
          )}
        </div>

        {/* Mobile */}
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="md:hidden">
              <Menu className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-72 bg-white">
            <div className="flex flex-col gap-6 pt-8">
              <Link to="/" className="text-[18px] font-bold tracking-[-0.025em]">HeySpaces</Link>
              <nav className="flex flex-col gap-4">
                {navLinks.map(link => (
                  <SheetClose asChild key={link.href}>
                    <Link to={link.href} className="text-sm font-medium text-foreground-secondary hover:text-foreground">
                      {link.label}
                    </Link>
                  </SheetClose>
                ))}
              </nav>
              <div className="flex flex-col gap-3">
                {!hideSearch && (
                  <SheetClose asChild>
                    <Button variant="secondary" className="justify-start gap-2" onClick={handleSearchClick}>
                      <Search className="h-4 w-4" /> Suchen
                    </Button>
                  </SheetClose>
                )}
                <SheetClose asChild>
                  <Button className="justify-start gap-2" onClick={handleCreateClick}>
                    <Plus className="h-4 w-4" /> Inserat erstellen
                  </Button>
                </SheetClose>
              </div>
              <div className="border-t border-border pt-4">
                {user ? (
                  <div className="flex flex-col gap-3">
                    <p className="text-sm font-bold">{user.vorname} {user.nachname}</p>
                    <SheetClose asChild>
                      <Link to="/dashboard" className="text-sm text-foreground-secondary hover:text-foreground">Mein Dashboard</Link>
                    </SheetClose>
                    <button onClick={handleSignOut} className="text-left text-sm text-status-red-fg">Abmelden</button>
                  </div>
                ) : (
                  <div className="flex flex-col gap-3">
                    <SheetClose asChild>
                      <Link to="/login" className="text-sm text-foreground-secondary hover:text-foreground">Anmelden</Link>
                    </SheetClose>
                    <SheetClose asChild>
                      <Link to="/registrieren" className="text-sm text-foreground-secondary hover:text-foreground">Registrieren</Link>
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
