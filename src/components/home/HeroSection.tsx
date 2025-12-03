import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Calendar, Star, Clock, Award } from 'lucide-react';

const HeroSection = () => {
  return (
    <section className="relative min-h-[90vh] flex items-center overflow-hidden bg-pattern">
      {/* Background Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-background via-background/95 to-background/80" />
      
      {/* Decorative Elements */}
      <div className="absolute top-20 right-10 w-72 h-72 bg-primary/10 rounded-full blur-3xl animate-float" />
      <div className="absolute bottom-20 left-10 w-96 h-96 bg-primary/5 rounded-full blur-3xl animate-float" style={{ animationDelay: '-3s' }} />

      <div className="container-custom relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Content */}
          <div className="space-y-8 animate-slide-up">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20">
              <Award className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium text-primary">A Barbearia #1 da Cidade</span>
            </div>
            
            <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold leading-tight">
              Estilo e
              <span className="block gold-text">Tradição</span>
              em Cada Corte
            </h1>
            
            <p className="text-lg text-muted-foreground max-w-lg">
              Experimente o melhor em cuidados masculinos. Nossos barbeiros especializados 
              combinam técnicas tradicionais com tendências modernas para criar seu visual perfeito.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <Link to="/booking">
                <Button variant="gold" size="xl" className="w-full sm:w-auto">
                  <Calendar className="mr-2 h-5 w-5" />
                  Agendar Agora
                </Button>
              </Link>
              <Link to="/services">
                <Button variant="outline" size="xl" className="w-full sm:w-auto">
                  Ver Serviços
                </Button>
              </Link>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-6 pt-8 border-t border-border/50">
              <div>
                <div className="flex items-center gap-1 text-primary">
                  <Star className="h-4 w-4 fill-primary" />
                  <span className="font-display text-2xl font-bold">4.9</span>
                </div>
                <p className="text-sm text-muted-foreground">Avaliação</p>
              </div>
              <div>
                <div className="font-display text-2xl font-bold text-foreground">5k+</div>
                <p className="text-sm text-muted-foreground">Clientes</p>
              </div>
              <div>
                <div className="font-display text-2xl font-bold text-foreground">8+</div>
                <p className="text-sm text-muted-foreground">Anos</p>
              </div>
            </div>
          </div>

          {/* Hero Image */}
          <div className="relative hidden lg:block">
            <div className="relative z-10 rounded-2xl overflow-hidden shadow-2xl animate-fade-in" style={{ animationDelay: '0.3s' }}>
              <img
                src="https://images.unsplash.com/photo-1621605815971-fbc98d665033?w=600&h=750&fit=crop"
                alt="Barbeiro profissional cortando cabelo"
                className="w-full h-auto object-cover"
              />
              {/* Overlay Card */}
              <div className="absolute bottom-6 left-6 right-6 p-4 glass-card rounded-xl">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <img
                      src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=50&h=50&fit=crop&crop=face"
                      alt="Barbeiro"
                      className="w-12 h-12 rounded-full object-cover border-2 border-primary"
                    />
                    <div>
                      <p className="font-medium">Carlos Silva</p>
                      <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <Star className="h-3 w-3 fill-primary text-primary" />
                        <span>4.9 (234 avaliações)</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 text-sm text-primary">
                    <Clock className="h-4 w-4" />
                    <span>Disponível</span>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Decorative Frame */}
            <div className="absolute -top-4 -right-4 w-full h-full border-2 border-primary/30 rounded-2xl" />
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
