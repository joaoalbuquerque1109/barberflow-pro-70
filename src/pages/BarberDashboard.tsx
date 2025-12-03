import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import Navbar from '@/components/layout/Navbar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { mockBookings } from '@/data/mockData';
import { 
  Calendar, 
  DollarSign, 
  Clock,
  CheckCircle2,
  XCircle,
  User,
  Star,
  TrendingUp
} from 'lucide-react';
import { format, addDays } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

const BarberDashboard = () => {
  const [isAvailable, setIsAvailable] = useState(true);
  const [selectedDate, setSelectedDate] = useState(new Date());
  
  const dates = Array.from({ length: 7 }, (_, i) => addDays(new Date(), i));
  
  const todayBookings = mockBookings.filter(b => 
    b.barberId === '1' && (b.status === 'CONFIRMED' || b.status === 'PENDING')
  );

  const stats = {
    todayEarnings: 320,
    weekEarnings: 1850,
    monthEarnings: 7200,
    completedToday: 5,
    pendingToday: 3,
    rating: 4.9,
  };

  const handleAccept = (bookingId: string) => {
    toast.success('Agendamento confirmado!');
  };

  const handleReject = (bookingId: string) => {
    toast.info('Agendamento recusado.');
  };

  const handleCheckin = (bookingId: string) => {
    toast.success('Check-in realizado!');
  };

  return (
    <>
      <Helmet>
        <title>Minha Agenda - Barber Flow</title>
        <meta name="description" content="Gerencie sua agenda, confirme agendamentos e acompanhe seus ganhos na Barber Flow." />
      </Helmet>

      <div className="min-h-screen bg-background">
        <Navbar />
        
        <main className="container-custom py-8">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
            <div>
              <h1 className="font-display text-3xl font-bold">Minha Agenda</h1>
              <p className="text-muted-foreground">
                {format(new Date(), "EEEE, dd 'de' MMMM", { locale: ptBR })}
              </p>
            </div>
            <div className="flex items-center gap-4 mt-4 md:mt-0">
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">Disponível</span>
                <Switch
                  checked={isAvailable}
                  onCheckedChange={(checked) => {
                    setIsAvailable(checked);
                    toast.success(checked ? 'Você está disponível para agendamentos' : 'Você está indisponível');
                  }}
                />
              </div>
              <Badge className={isAvailable ? 'bg-success' : 'bg-muted'}>
                {isAvailable ? 'Online' : 'Offline'}
              </Badge>
            </div>
          </div>

          {/* Stats Row */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <Card className="bg-card border-border/50">
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                    <DollarSign className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Ganhos Hoje</p>
                    <p className="font-display text-2xl font-bold">R$ {stats.todayEarnings}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-card border-border/50">
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-success/10 flex items-center justify-center">
                    <TrendingUp className="h-6 w-6 text-success" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Esta Semana</p>
                    <p className="font-display text-2xl font-bold">R$ {stats.weekEarnings}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-card border-border/50">
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center">
                    <CheckCircle2 className="h-6 w-6 text-accent" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Atendimentos Hoje</p>
                    <p className="font-display text-2xl font-bold">{stats.completedToday}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-card border-border/50">
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                    <Star className="h-6 w-6 text-primary fill-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Minha Avaliação</p>
                    <p className="font-display text-2xl font-bold">{stats.rating}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid lg:grid-cols-3 gap-6">
            {/* Date Selector */}
            <Card className="lg:col-span-1 bg-card border-border/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-primary" />
                  Calendário
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {dates.map((date) => (
                    <button
                      key={date.toISOString()}
                      onClick={() => setSelectedDate(date)}
                      className={cn(
                        "w-full p-4 rounded-xl border text-left transition-all flex items-center justify-between",
                        selectedDate.toDateString() === date.toDateString()
                          ? "border-primary bg-primary/10"
                          : "border-border hover:border-primary/50"
                      )}
                    >
                      <div>
                        <p className="font-medium">
                          {format(date, "EEEE", { locale: ptBR })}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {format(date, "dd 'de' MMMM", { locale: ptBR })}
                        </p>
                      </div>
                      <Badge variant="secondary">
                        {Math.floor(Math.random() * 5 + 3)} agendamentos
                      </Badge>
                    </button>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Bookings List */}
            <Card className="lg:col-span-2 bg-card border-border/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5 text-primary" />
                  Agendamentos do Dia
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {todayBookings.map((booking) => (
                    <div 
                      key={booking.id} 
                      className="p-4 rounded-xl bg-secondary/50 space-y-4"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center">
                            <span className="font-display text-lg font-bold text-primary">
                              {booking.time}
                            </span>
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <User className="h-4 w-4 text-muted-foreground" />
                              <p className="font-medium">{booking.clientName}</p>
                            </div>
                            <p className="text-sm text-muted-foreground">
                              {booking.serviceName}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-display text-xl font-bold text-primary">
                            R$ {booking.price}
                          </p>
                          <Badge variant={booking.status === 'CONFIRMED' ? 'default' : 'secondary'}>
                            {booking.status === 'CONFIRMED' ? 'Confirmado' : 'Pendente'}
                          </Badge>
                        </div>
                      </div>

                      <div className="flex gap-2">
                        {booking.status === 'PENDING' ? (
                          <>
                            <Button 
                              variant="gold" 
                              size="sm" 
                              className="flex-1"
                              onClick={() => handleAccept(booking.id)}
                            >
                              <CheckCircle2 className="mr-2 h-4 w-4" />
                              Aceitar
                            </Button>
                            <Button 
                              variant="outline" 
                              size="sm" 
                              className="flex-1"
                              onClick={() => handleReject(booking.id)}
                            >
                              <XCircle className="mr-2 h-4 w-4" />
                              Recusar
                            </Button>
                          </>
                        ) : (
                          <Button 
                            variant="gold" 
                            size="sm" 
                            className="w-full"
                            onClick={() => handleCheckin(booking.id)}
                          >
                            <CheckCircle2 className="mr-2 h-4 w-4" />
                            Confirmar Chegada
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}

                  {todayBookings.length === 0 && (
                    <div className="text-center py-12 text-muted-foreground">
                      <Calendar className="h-12 w-12 mx-auto mb-4 opacity-50" />
                      <p>Nenhum agendamento para este dia.</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </>
  );
};

export default BarberDashboard;
