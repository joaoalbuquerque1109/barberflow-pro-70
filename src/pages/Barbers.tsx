import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { mockBarbers } from '@/data/mockData';
import { Star, Calendar, Users } from 'lucide-react';

const Barbers = () => {
  return (
    <>
      <Helmet>
        <title>Nossos Barbeiros - Barber Flow | Profissionais Especialistas</title>
        <meta name="description" content="Conheça nossa equipe de barbeiros especialistas. Profissionais com anos de experiência em cortes modernos, fade, barba e mais. Agende com seu favorito!" />
      </Helmet>

      <div className="min-h-screen flex flex-col">
        <Navbar />
        
        <main className="flex-1">
          {/* Hero */}
          <section className="section-padding bg-card/30">
            <div className="container-custom text-center">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-6">
                <Users className="h-4 w-4 text-primary" />
                <span className="text-sm font-medium text-primary">Nossa Equipe</span>
              </div>
              <h1 className="font-display text-4xl sm:text-5xl font-bold mb-4">
                Barbeiros <span className="gold-text">Especialistas</span>
              </h1>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Profissionais apaixonados pela arte de cortar cabelo, 
                com anos de experiência e formação contínua nas últimas tendências.
              </p>
            </div>
          </section>

          {/* Barbers Grid */}
          <section className="section-padding">
            <div className="container-custom">
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {mockBarbers.map((barber, index) => (
                  <Card 
                    key={barber.id}
                    className="group bg-card border-border/50 hover:border-primary/50 transition-all duration-300 overflow-hidden animate-slide-up"
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <div className="relative h-80">
                      <img
                        src={barber.avatar}
                        alt={barber.name}
                        className="w-full h-full object-cover object-top transition-transform duration-500 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-card via-card/50 to-transparent" />
                      
                      <Badge 
                        className={`absolute top-4 right-4 ${
                          barber.isAvailable 
                            ? 'bg-success text-success-foreground' 
                            : 'bg-muted text-muted-foreground'
                        }`}
                      >
                        {barber.isAvailable ? 'Disponível Agora' : 'Ocupado'}
                      </Badge>
                    </div>

                    <CardContent className="p-6 -mt-20 relative z-10">
                      <div className="space-y-4">
                        <div>
                          <h2 className="font-display text-2xl font-bold">{barber.name}</h2>
                          <div className="flex items-center gap-3 mt-2">
                            <div className="flex items-center gap-1 text-primary">
                              <Star className="h-5 w-5 fill-primary" />
                              <span className="font-semibold text-lg">{barber.rating}</span>
                            </div>
                            <span className="text-muted-foreground">
                              ({barber.reviewCount} avaliações)
                            </span>
                          </div>
                        </div>

                        <p className="text-muted-foreground">
                          {barber.bio}
                        </p>

                        <div>
                          <p className="text-sm font-medium text-foreground mb-2">Especialidades:</p>
                          <div className="flex flex-wrap gap-2">
                            {barber.specialties.map((specialty) => (
                              <span 
                                key={specialty}
                                className="text-sm px-3 py-1 rounded-full bg-secondary text-secondary-foreground"
                              >
                                {specialty}
                              </span>
                            ))}
                          </div>
                        </div>

                        <Link to={`/booking?barber=${barber.id}`} className="block pt-2">
                          <Button variant="gold" className="w-full" size="lg">
                            <Calendar className="mr-2 h-5 w-5" />
                            Agendar com {barber.name.split(' ')[0]}
                          </Button>
                        </Link>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </section>
        </main>

        <Footer />
      </div>
    </>
  );
};

export default Barbers;
