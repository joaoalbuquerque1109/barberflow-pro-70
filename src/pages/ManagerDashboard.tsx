import { Helmet } from 'react-helmet-async';
import Navbar from '@/components/layout/Navbar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { mockDashboardMetrics, weeklyRevenue, mockBookings, mockBarbers } from '@/data/mockData';
import { 
  TrendingUp, 
  TrendingDown, 
  Users, 
  DollarSign, 
  Calendar, 
  Star,
  BarChart3,
  Clock,
  Download
} from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const ManagerDashboard = () => {
  const metrics = [
    {
      title: 'Agendamentos Hoje',
      value: mockDashboardMetrics.totalBookings,
      change: mockDashboardMetrics.bookingsChange,
      icon: Calendar,
      trend: 'up',
    },
    {
      title: 'Receita do Mês',
      value: `R$ ${mockDashboardMetrics.totalRevenue.toLocaleString()}`,
      change: mockDashboardMetrics.revenueChange,
      icon: DollarSign,
      trend: 'up',
    },
    {
      title: 'Novos Clientes',
      value: mockDashboardMetrics.newClients,
      change: mockDashboardMetrics.clientsChange,
      icon: Users,
      trend: 'up',
    },
    {
      title: 'Avaliação Média',
      value: mockDashboardMetrics.avgRating,
      change: 0.2,
      icon: Star,
      trend: 'up',
    },
  ];

  const serviceData = [
    { name: 'Fade', value: 35, color: 'hsl(38, 92%, 50%)' },
    { name: 'Clássico', value: 25, color: 'hsl(38, 80%, 60%)' },
    { name: 'Barba', value: 20, color: 'hsl(38, 70%, 70%)' },
    { name: 'Combos', value: 15, color: 'hsl(38, 60%, 75%)' },
    { name: 'Outros', value: 5, color: 'hsl(38, 50%, 80%)' },
  ];

  const todayBookings = mockBookings.filter(b => b.status === 'CONFIRMED' || b.status === 'PENDING');

  return (
    <>
      <Helmet>
        <title>Dashboard - Barber Flow Manager</title>
        <meta name="description" content="Painel de controle para gerentes da Barber Flow. Acompanhe métricas, receita e desempenho da equipe." />
      </Helmet>

      <div className="min-h-screen bg-background">
        <Navbar userRole="MANAGER" />
        
        <main className="container-custom py-8">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
            <div>
              <h1 className="font-display text-3xl font-bold">Dashboard</h1>
              <p className="text-muted-foreground">Bem-vindo de volta! Aqui está o resumo de hoje.</p>
            </div>
            <div className="flex gap-2 mt-4 md:mt-0">
              <Button variant="outline">
                <Download className="mr-2 h-4 w-4" />
                Exportar Relatório
              </Button>
            </div>
          </div>

          {/* Metrics Grid */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {metrics.map((metric) => (
              <Card key={metric.title} className="bg-card border-border/50">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                      <metric.icon className="h-6 w-6 text-primary" />
                    </div>
                    <div className={`flex items-center gap-1 text-sm ${
                      metric.trend === 'up' ? 'text-success' : 'text-destructive'
                    }`}>
                      {metric.trend === 'up' ? (
                        <TrendingUp className="h-4 w-4" />
                      ) : (
                        <TrendingDown className="h-4 w-4" />
                      )}
                      {metric.change}%
                    </div>
                  </div>
                  <div className="mt-4">
                    <p className="text-2xl font-display font-bold">{metric.value}</p>
                    <p className="text-sm text-muted-foreground">{metric.title}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Charts Row */}
          <div className="grid lg:grid-cols-3 gap-6 mb-8">
            {/* Revenue Chart */}
            <Card className="lg:col-span-2 bg-card border-border/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5 text-primary" />
                  Receita Semanal
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={weeklyRevenue}>
                      <defs>
                        <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="hsl(38, 92%, 50%)" stopOpacity={0.3}/>
                          <stop offset="95%" stopColor="hsl(38, 92%, 50%)" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="hsl(20, 10%, 18%)" />
                      <XAxis dataKey="day" stroke="hsl(40, 10%, 55%)" />
                      <YAxis stroke="hsl(40, 10%, 55%)" />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: 'hsl(20, 14%, 8%)', 
                          border: '1px solid hsl(20, 10%, 18%)',
                          borderRadius: '8px'
                        }}
                        formatter={(value) => [`R$ ${value}`, 'Receita']}
                      />
                      <Area 
                        type="monotone" 
                        dataKey="revenue" 
                        stroke="hsl(38, 92%, 50%)" 
                        fillOpacity={1} 
                        fill="url(#colorRevenue)" 
                        strokeWidth={2}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            {/* Services Distribution */}
            <Card className="bg-card border-border/50">
              <CardHeader>
                <CardTitle>Serviços Mais Populares</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[200px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={serviceData}
                        cx="50%"
                        cy="50%"
                        innerRadius={50}
                        outerRadius={80}
                        paddingAngle={2}
                        dataKey="value"
                      >
                        {serviceData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: 'hsl(20, 14%, 8%)', 
                          border: '1px solid hsl(20, 10%, 18%)',
                          borderRadius: '8px'
                        }}
                        formatter={(value) => [`${value}%`, '']}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="grid grid-cols-2 gap-2 mt-4">
                  {serviceData.map((item) => (
                    <div key={item.name} className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                      <span className="text-sm text-muted-foreground">{item.name}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Bottom Row */}
          <div className="grid lg:grid-cols-2 gap-6">
            {/* Today's Bookings */}
            <Card className="bg-card border-border/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5 text-primary" />
                  Agendamentos de Hoje
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {todayBookings.map((booking) => (
                    <div 
                      key={booking.id} 
                      className="flex items-center justify-between p-4 rounded-xl bg-secondary/50"
                    >
                      <div className="flex items-center gap-4">
                        <div className="text-center">
                          <p className="font-display text-lg font-bold text-primary">{booking.time}</p>
                        </div>
                        <div>
                          <p className="font-medium">{booking.clientName}</p>
                          <p className="text-sm text-muted-foreground">
                            {booking.serviceName} • {booking.barberName}
                          </p>
                        </div>
                      </div>
                      <Badge variant={booking.status === 'CONFIRMED' ? 'default' : 'secondary'}>
                        {booking.status === 'CONFIRMED' ? 'Confirmado' : 'Pendente'}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Team Performance */}
            <Card className="bg-card border-border/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-primary" />
                  Desempenho da Equipe
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {mockBarbers.map((barber, index) => (
                    <div 
                      key={barber.id} 
                      className="flex items-center gap-4 p-4 rounded-xl bg-secondary/50"
                    >
                      <div className="relative">
                        <img
                          src={barber.avatar}
                          alt={barber.name}
                          className="w-12 h-12 rounded-full object-cover"
                        />
                        <div className={`absolute -top-1 -right-1 w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold ${
                          index === 0 ? 'bg-primary text-primary-foreground' : 'bg-secondary text-secondary-foreground'
                        }`}>
                          {index + 1}
                        </div>
                      </div>
                      <div className="flex-1">
                        <p className="font-medium">{barber.name}</p>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Star className="h-3 w-3 fill-primary text-primary" />
                          {barber.rating} • {barber.reviewCount} avaliações
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-display font-bold text-primary">
                          R$ {(Math.random() * 2000 + 1000).toFixed(0)}
                        </p>
                        <p className="text-xs text-muted-foreground">esta semana</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </>
  );
};

export default ManagerDashboard;
