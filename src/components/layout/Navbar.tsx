import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Menu, Scissors, User, Calendar, LayoutDashboard, LogOut, MapPin } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuth } from '@/hooks/useAuth';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, signOut, loading } = useAuth();

  const publicLinks = [
    { href: '/', label: 'Home' },
    { href: '/explore', label: 'Explorar', icon: MapPin },
    { href: '/services', label: 'Serviços' },
    { href: '/barbers', label: 'Barbeiros' },
  ];

  const handleLogout = async () => {
    await signOut();
    navigate('/');
    setIsOpen(false);
  };

  const NavLinks = ({ mobile = false }: { mobile?: boolean }) => (
    <>
      {publicLinks.map((link) => (
        <Link
          key={link.href}
          to={link.href}
          onClick={() => mobile && setIsOpen(false)}
          className={cn(
            'text-sm font-medium transition-colors hover:text-primary flex items-center gap-1.5',
            location.pathname === link.href ? 'text-primary' : 'text-muted-foreground',
            mobile && 'py-2'
          )}
        >
          {link.icon && <link.icon className="h-4 w-4" />}
          {link.label}
        </Link>
      ))}
    </>
  );

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/50 bg-background/80 backdrop-blur-xl">
      <nav className="container-custom flex h-16 items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gold-gradient">
            <Scissors className="h-5 w-5 text-primary-foreground" />
          </div>
          <span className="font-display text-xl font-bold">Barber Master</span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-8">
          <NavLinks />
        </div>

        <div className="hidden md:flex items-center gap-4">
          {loading ? (
            <div className="h-9 w-20 bg-muted animate-pulse rounded-md" />
          ) : user ? (
            <>
              <Link to="/my-bookings">
                <Button variant="ghost" size="sm">
                  <Calendar className="h-4 w-4 mr-2" />
                  Agendamentos
                </Button>
              </Link>
              <Button variant="ghost" size="sm" onClick={handleLogout}>
                <LogOut className="h-4 w-4 mr-2" />
                Sair
              </Button>
            </>
          ) : (
            <>
              <Link to="/auth">
                <Button variant="ghost" size="sm">Entrar</Button>
              </Link>
              <Link to="/explore">
                <Button variant="gold" size="sm">
                  <MapPin className="h-4 w-4 mr-2" />
                  Encontrar Barbeiro
                </Button>
              </Link>
            </>
          )}
        </div>

        {/* Mobile Navigation */}
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild className="md:hidden">
            <Button variant="ghost" size="icon">
              <Menu className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-[280px] bg-card">
            <div className="flex flex-col gap-6 mt-8">
              <NavLinks mobile />
              <div className="border-t border-border pt-4 space-y-2">
                {user ? (
                  <>
                    <Link to="/my-bookings" onClick={() => setIsOpen(false)}>
                      <Button variant="outline" className="w-full justify-start">
                        <Calendar className="h-4 w-4 mr-2" />
                        Meus Agendamentos
                      </Button>
                    </Link>
                    <Button variant="outline" className="w-full justify-start" onClick={handleLogout}>
                      <LogOut className="h-4 w-4 mr-2" />
                      Sair
                    </Button>
                  </>
                ) : (
                  <>
                    <Link to="/auth" onClick={() => setIsOpen(false)}>
                      <Button variant="outline" className="w-full">Entrar</Button>
                    </Link>
                    <Link to="/explore" onClick={() => setIsOpen(false)}>
                      <Button variant="gold" className="w-full">
                        <MapPin className="h-4 w-4 mr-2" />
                        Encontrar Barbeiro
                      </Button>
                    </Link>
                  </>
                )}
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </nav>
    </header>
  );
};

export default Navbar;
