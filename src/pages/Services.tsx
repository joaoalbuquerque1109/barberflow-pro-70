import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { mockServices } from '@/data/mockData';
import { Clock, ArrowRight, Scissors } from 'lucide-react';
import { cn } from '@/lib/utils';

const categories = ['Todos', 'Haircuts', 'Beard', 'Shave', 'Combos'];

const Services = () => {
  const [activeCategory, setActiveCategory] = useState('Todos');

  const filteredServices = activeCategory === 'Todos' 
    ? mockServices 
    : mockServices.filter(s => s.category === activeCategory);

  return (
    <>
      <Helmet>
        <title>Serviços - Barber Flow | Cortes, Barba e Tratamentos</title>
        <meta name="description" content="Conheça nossos serviços: cortes clássicos, fade, barba, hot towel shave e pacotes completos. Preços a partir de R$25. Agende online!" />
      </Helmet>

      <div className="min-h-screen flex flex-col">
        <Navbar />
        
        <main className="flex-1">
          {/* Hero */}
          <section className="section-padding bg-card/30">
            <div className="container-custom text-center">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-6">
                <Scissors className="h-4 w-4 text-primary" />
                <span className="text-sm font-medium text-primary">Nossos Serviços</span>
              </div>
              <h1 className="font-display text-4xl sm:text-5xl font-bold mb-4">
                Serviços <span className="gold-text">Premium</span>
              </h1>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Do corte tradicional ao moderno, oferecemos uma gama completa de serviços 
                com os melhores profissionais e produtos do mercado.
              </p>
            </div>
          </section>

          {/* Filters */}
          <section className="py-8 border-b border-border">
            <div className="container-custom">
              <div className="flex flex-wrap justify-center gap-2">
                {categories.map((category) => (
                  <Button
                    key={category}
                    variant={activeCategory === category ? 'gold' : 'outline'}
                    size="sm"
                    onClick={() => setActiveCategory(category)}
                  >
                    {category === 'Todos' ? 'Todos' : 
                     category === 'Cortes de cabelo' ? 'Cortes' :
                     category === 'Barba' ? 'Barba' :
                     category === 'Shave' ? 'Barbear' : 'Combos'}
                  </Button>
                ))}
              </div>
            </div>
          </section>

          {/* Services Grid */}
          <section className="section-padding">
            <div className="container-custom">
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredServices.map((service, index) => (
                  <Card 
                    key={service.id}
                    className={cn(
                      "group bg-card border-border/50 hover:border-primary/50 transition-all duration-300 hover:-translate-y-1 overflow-hidden animate-slide-up"
                    )}
                    style={{ animationDelay: `${index * 0.05}s` }}
                  >
                    <CardContent className="p-6">
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-medium px-3 py-1 rounded-full bg-primary/10 text-primary">
                            {service.category === 'Haircuts' ? 'Cortes' :
                             service.category === 'Beard' ? 'Barba' :
                             service.category === 'Shave' ? 'Barbear' : 'Combos'}
                          </span>
                          <div className="flex items-center gap-1 text-sm text-muted-foreground">
                            <Clock className="h-4 w-4" />
                            {service.duration} min
                          </div>
                        </div>
                        
                        <div>
                          <h3 className="font-display text-xl font-semibold group-hover:text-primary transition-colors">
                            {service.name}
                          </h3>
                          <p className="text-sm text-muted-foreground mt-2 line-clamp-3">
                            {service.description}
                          </p>
                        </div>

                        <div className="flex items-center justify-between pt-4 border-t border-border/50">
                          <div>
                            <span className="text-sm text-muted-foreground">A partir de</span>
                            <span className="block font-display text-3xl font-bold text-primary">
                              R$ {service.price}
                            </span>
                          </div>
                          <Link to={`/booking?service=${service.id}`}>
                            <Button variant="gold">
                              Agendar
                              <ArrowRight className="ml-2 h-4 w-4" />
                            </Button>
                          </Link>
                        </div>
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

export default Services;
