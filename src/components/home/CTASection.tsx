import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Calendar, ArrowRight, Sparkles } from 'lucide-react';

const CTASection = () => {
  return (
    <section className="section-padding relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-background to-primary/5" />
      <div className="absolute top-0 right-0 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-72 h-72 bg-primary/5 rounded-full blur-3xl" />

      <div className="container-custom relative z-10">
        <div className="max-w-3xl mx-auto text-center space-y-8">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20">
            <Sparkles className="h-4 w-4 text-primary" />
            <span className="text-sm font-medium text-primary">Primeira visita? Ganhe 10% de desconto!</span>
          </div>

          <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-bold">
            Pronto para transformar seu
            <span className="block gold-text">Visual?</span>
          </h2>

          <p className="text-lg text-muted-foreground max-w-xl mx-auto">
            Agende agora e descubra por que somos a barbearia mais bem avaliada da região. 
            Sua primeira experiência Barber Flow começa aqui.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/booking">
              <Button variant="gold" size="xl">
                <Calendar className="mr-2 h-5 w-5" />
                Agendar Meu Horário
              </Button>
            </Link>
            <Link to="/services">
              <Button variant="glass" size="xl">
                Explorar Serviços
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>

          <p className="text-sm text-muted-foreground">
            Sem compromisso. Cancele ou reagende a qualquer momento.
          </p>
        </div>
      </div>
    </section>
  );
};

export default CTASection;
