import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { mockBookings } from '@/data/mockData';
import { 
  Calendar, 
  Clock, 
  MapPin,
  Star,
  MessageCircle,
  X,
  CalendarPlus
} from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { toast } from 'sonner';

const MyBookings = () => {
  const [bookings, setBookings] = useState(mockBookings);

  const upcomingBookings = bookings.filter(b => 
    b.status === 'CONFIRMED' || b.status === 'PENDING'
  );
  const pastBookings = bookings.filter(b => 
    b.status === 'COMPLETED' || b.status === 'CANCELLED'
  );

  const handleCancel = (bookingId: string) => {
    setBookings(prev => 
      prev.map(b => b.id === bookingId ? { ...b, status: 'CANCELLED' as const } : b)
    );
    toast.success('Agendamento cancelado com sucesso.');
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'CONFIRMED':
        return <Badge className="bg-success">Confirmado</Badge>;
      case 'PENDING':
        return <Badge variant="secondary">Pendente</Badge>;
      case 'COMPLETED':
        return <Badge className="bg-primary">Concluído</Badge>;
      case 'CANCELLED':
        return <Badge variant="destructive">Cancelado</Badge>;
      default:
        return null;
    }
  };

  const BookingCard = ({ booking, showActions = false }: { booking: typeof mockBookings[0]; showActions?: boolean }) => (
    <Card className="bg-card border-border/50">
      <CardContent className="p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-xl bg-primary/10 flex flex-col items-center justify-center">
              <span className="font-display text-lg font-bold text-primary">
                {format(new Date(booking.date), 'dd')}
              </span>
              <span className="text-xs text-muted-foreground uppercase">
                {format(new Date(booking.date), 'MMM', { locale: ptBR })}
              </span>
            </div>
            <div>
              <h3 className="font-semibold">{booking.serviceName}</h3>
              <p className="text-sm text-muted-foreground">com {booking.barberName}</p>
              <div className="flex items-center gap-3 mt-1 text-sm text-muted-foreground">
                <span className="flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  {booking.time}
                </span>
                <span className="flex items-center gap-1">
                  <MapPin className="h-3 w-3" />
                  Barber Flow
                </span>
              </div>
            </div>
          </div>
          
          <div className="flex flex-col items-end gap-2">
            {getStatusBadge(booking.status)}
            <p className="font-display text-xl font-bold text-primary">
              R$ {booking.price}
            </p>
          </div>
        </div>

        {showActions && (booking.status === 'CONFIRMED' || booking.status === 'PENDING') && (
          <div className="flex gap-2 mt-4 pt-4 border-t border-border">
            <Button variant="outline" size="sm" className="flex-1">
              <Calendar className="mr-2 h-4 w-4" />
              Reagendar
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              className="flex-1"
              onClick={() => handleCancel(booking.id)}
            >
              <X className="mr-2 h-4 w-4" />
              Cancelar
            </Button>
            <Button variant="outline" size="sm">
              <MessageCircle className="h-4 w-4" />
            </Button>
          </div>
        )}

        {booking.status === 'COMPLETED' && (
          <div className="flex gap-2 mt-4 pt-4 border-t border-border">
            <Button variant="gold-outline" size="sm" className="flex-1">
              <Star className="mr-2 h-4 w-4" />
              Avaliar
            </Button>
            <Link to={`/booking?service=${booking.serviceId}&barber=${booking.barberId}`} className="flex-1">
              <Button variant="outline" size="sm" className="w-full">
                <CalendarPlus className="mr-2 h-4 w-4" />
                Agendar Novamente
              </Button>
            </Link>
          </div>
        )}
      </CardContent>
    </Card>
  );

  return (
    <>
      <Helmet>
        <title>Meus Agendamentos - Barber Flow</title>
        <meta name="description" content="Gerencie seus agendamentos na Barber Flow. Veja seus próximos horários e histórico de visitas." />
      </Helmet>

      <div className="min-h-screen flex flex-col bg-background">
        <Navbar userRole="CLIENT" />
        
        <main className="flex-1 py-8">
          <div className="container-custom max-w-3xl">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h1 className="font-display text-3xl font-bold">Meus Agendamentos</h1>
                <p className="text-muted-foreground">Gerencie suas reservas</p>
              </div>
              <Link to="/booking">
                <Button variant="gold">
                  <CalendarPlus className="mr-2 h-4 w-4" />
                  Novo Agendamento
                </Button>
              </Link>
            </div>

            <Tabs defaultValue="upcoming" className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-6">
                <TabsTrigger value="upcoming">
                  Próximos ({upcomingBookings.length})
                </TabsTrigger>
                <TabsTrigger value="history">
                  Histórico ({pastBookings.length})
                </TabsTrigger>
              </TabsList>

              <TabsContent value="upcoming" className="space-y-4">
                {upcomingBookings.length > 0 ? (
                  upcomingBookings.map((booking) => (
                    <BookingCard key={booking.id} booking={booking} showActions />
                  ))
                ) : (
                  <Card className="bg-card border-border/50">
                    <CardContent className="py-12 text-center">
                      <Calendar className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-50" />
                      <h3 className="font-semibold mb-2">Nenhum agendamento</h3>
                      <p className="text-sm text-muted-foreground mb-4">
                        Você não tem nenhum agendamento próximo.
                      </p>
                      <Link to="/booking">
                        <Button variant="gold">Agendar Agora</Button>
                      </Link>
                    </CardContent>
                  </Card>
                )}
              </TabsContent>

              <TabsContent value="history" className="space-y-4">
                {pastBookings.length > 0 ? (
                  pastBookings.map((booking) => (
                    <BookingCard key={booking.id} booking={booking} />
                  ))
                ) : (
                  <Card className="bg-card border-border/50">
                    <CardContent className="py-12 text-center">
                      <Clock className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-50" />
                      <h3 className="font-semibold mb-2">Sem histórico</h3>
                      <p className="text-sm text-muted-foreground">
                        Seu histórico de agendamentos aparecerá aqui.
                      </p>
                    </CardContent>
                  </Card>
                )}
              </TabsContent>
            </Tabs>
          </div>
        </main>

        <Footer />
      </div>
    </>
  );
};

export default MyBookings;
