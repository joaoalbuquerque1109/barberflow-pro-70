import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Menu, Scissors, User, Calendar, LayoutDashboard, LogOut } from 'lucide-react';
import { cn } from '@/lib/utils';

interface NavbarProps {
  userRole?: 'CLIENT' | 'BARBER' | 'MANAGER' | null;
  onLogout?: () => void;
}

const Navbar = ({ userRole, onLogout }: NavbarProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const publicLinks = [
    { href: '/', label: 'Home' },
    { href: '/services', label: 'Serviços' },
    { href: '/barbers', label: 'Barbeiros' },
  ];

  const clientLinks = [
    { href: '/booking', label: 'Agendar', icon: Calendar },
    { href: '/my-bookings', label: 'Meus Agendamentos', icon: Calendar },
    { href: '/profile', label: 'Perfil', icon: User },
  ];

  const barberLinks = [
    { href: '/barber/schedule', label: 'Agenda', icon: Calendar },
    { href: '/barber/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  ];

  const managerLinks = [
    { href: '/manager/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/manager/team', label: 'Equipe', icon: User },
    { href: '/manager/reports', label: 'Relatórios', icon: LayoutDashboard },
  ];

  const getRoleLinks = () => {
    switch (userRole) {
      case 'CLIENT':
        return clientLinks;
      case 'BARBER':
        return barberLinks;
      case 'MANAGER':
        return managerLinks;
      default:
        return [];
    }
  };

  const NavLinks = ({ mobile = false }: { mobile?: boolean }) => (
    <>
      {publicLinks.map((link) => (
        <Link
          key={link.href}
          to={link.href}
          onClick={() => mobile && setIsOpen(false)}
          className={cn(
            'text-sm font-medium transition-colors hover:text-primary',
            location.pathname === link.href ? 'text-primary' : 'text-muted-foreground',
            mobile && 'block py-2'
          )}
        >
          {link.label}
        </Link>
      ))}
      {userRole && getRoleLinks().map((link) => (
        <Link
          key={link.href}
          to={link.href}
          onClick={() => mobile && setIsOpen(false)}
          className={cn(
            'text-sm font-medium transition-colors hover:text-primary flex items-center gap-2',
            location.pathname === link.href ? 'text-primary' : 'text-muted-foreground',
            mobile && 'py-2'
          )}
        >
          <link.icon className="h-4 w-4" />
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
          <span className="font-display text-xl font-bold">Barber Flow</span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-8">
          <NavLinks />
        </div>

        <div className="hidden md:flex items-center gap-4">
          {userRole ? (
            <>
              <Button variant="ghost" size="sm" onClick={onLogout}>
                <LogOut className="h-4 w-4 mr-2" />
                Sair
              </Button>
            </>
          ) : (
            <>
              <Link to="/login">
                <Button variant="ghost" size="sm">Entrar</Button>
              </Link>
              <Link to="/booking">
                <Button variant="gold" size="sm">Agendar Agora</Button>
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
                {userRole ? (
                  <Button variant="outline" className="w-full" onClick={() => { onLogout?.(); setIsOpen(false); }}>
                    <LogOut className="h-4 w-4 mr-2" />
                    Sair
                  </Button>
                ) : (
                  <>
                    <Link to="/login" onClick={() => setIsOpen(false)}>
                      <Button variant="outline" className="w-full">Entrar</Button>
                    </Link>
                    <Link to="/booking" onClick={() => setIsOpen(false)}>
                      <Button variant="gold" className="w-full">Agendar Agora</Button>
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
