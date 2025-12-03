import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { mockServices } from '@/data/mockData';
import { Clock, ArrowRight } from 'lucide-react';

const ServicesPreview = () => {
  const featuredServices = mockServices.slice(0, 4);

  return (
    <section className="section-padding bg-card/30">
      <div className="container-custom">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-sm font-medium text-primary uppercase tracking-wider">
            Nossos Serviços
          </span>
          <h2 className="font-display text-3xl sm:text-4xl font-bold mt-2 mb-4">
            Cuidados Masculinos de <span className="gold-text">Excelência</span>
          </h2>
          <p className="text-muted-foreground">
            Do corte clássico ao moderno, oferecemos uma gama completa de serviços 
            para manter você sempre impecável.
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          {featuredServices.map((service, index) => (
            <Card 
              key={service.id}
              className="group bg-card/50 border-border/50 hover:border-primary/50 transition-all duration-300 hover:-translate-y-1 overflow-hidden"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <CardContent className="p-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-medium px-2 py-1 rounded-full bg-primary/10 text-primary">
                      {service.category}
                    </span>
                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                      <Clock className="h-3 w-3" />
                      {service.duration}min
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="font-display text-lg font-semibold group-hover:text-primary transition-colors">
                      {service.name}
                    </h3>
                    <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                      {service.description}
                    </p>
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t border-border/50">
                    <span className="font-display text-2xl font-bold text-primary">
                      R$ {service.price}
                    </span>
                    <Link to={`/booking?service=${service.id}`}>
                      <Button variant="ghost" size="sm" className="group-hover:text-primary">
                        Agendar
                        <ArrowRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1" />
                      </Button>
                    </Link>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* CTA */}
        <div className="text-center">
          <Link to="/services">
            <Button variant="outline" size="lg">
              Ver Todos os Serviços
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default ServicesPreview;
