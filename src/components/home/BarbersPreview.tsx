import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { mockBarbers } from '@/data/mockData';
import { Star, Calendar, ArrowRight } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

const BarbersPreview = () => {
  return (
    <section className="section-padding">
      <div className="container-custom">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-sm font-medium text-primary uppercase tracking-wider">
            Nossa Equipe
          </span>
          <h2 className="font-display text-3xl sm:text-4xl font-bold mt-2 mb-4">
            Barbeiros <span className="gold-text">Especialistas</span>
          </h2>
          <p className="text-muted-foreground">
            Profissionais experientes e apaixonados pela arte de cortar cabelo, 
            prontos para criar o visual perfeito para você.
          </p>
        </div>

        {/* Barbers Grid */}
        <div className="grid md:grid-cols-3 gap-8 mb-10">
          {mockBarbers.map((barber, index) => (
            <Card 
              key={barber.id}
              className="group bg-card border-border/50 hover:border-primary/50 transition-all duration-300 overflow-hidden"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="relative">
                <img
                  src={barber.avatar}
                  alt={barber.name}
                  className="w-full h-72 object-cover object-top transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-card via-transparent to-transparent" />
                
                {/* Availability Badge */}
                <Badge 
                  className={`absolute top-4 right-4 ${
                    barber.isAvailable 
                      ? 'bg-success text-success-foreground' 
                      : 'bg-muted text-muted-foreground'
                  }`}
                >
                  {barber.isAvailable ? 'Disponível' : 'Ocupado'}
                </Badge>
              </div>

              <CardContent className="p-6 -mt-12 relative z-10">
                <div className="space-y-4">
                  <div>
                    <h3 className="font-display text-xl font-semibold">{barber.name}</h3>
                    <div className="flex items-center gap-2 mt-1">
                      <div className="flex items-center gap-1 text-primary">
                        <Star className="h-4 w-4 fill-primary" />
                        <span className="font-medium">{barber.rating}</span>
                      </div>
                      <span className="text-sm text-muted-foreground">
                        ({barber.reviewCount} avaliações)
                      </span>
                    </div>
                  </div>

                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {barber.bio}
                  </p>

                  <div className="flex flex-wrap gap-2">
                    {barber.specialties.slice(0, 3).map((specialty) => (
                      <span 
                        key={specialty}
                        className="text-xs px-2 py-1 rounded-full bg-secondary text-secondary-foreground"
                      >
                        {specialty}
                      </span>
                    ))}
                  </div>

                  <Link to={`/booking?barber=${barber.id}`}>
                    <Button variant="gold-outline" className="w-full">
                      <Calendar className="mr-2 h-4 w-4" />
                      Agendar com {barber.name.split(' ')[0]}
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* CTA */}
        <div className="text-center">
          <Link to="/barbers">
            <Button variant="outline" size="lg">
              Conhecer Todos os Barbeiros
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default BarbersPreview;
