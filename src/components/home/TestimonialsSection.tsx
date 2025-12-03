import { Star, Quote } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

const testimonials = [
  {
    id: 1,
    name: 'Ricardo Oliveira',
    avatar: 'https://images.unsplash.com/photo-1599566150163-29194dcabd36?w=100&h=100&fit=crop&crop=face',
    rating: 5,
    text: 'Melhor barbearia da cidade! O Carlos é um artista com a tesoura. Ambiente aconchegante e atendimento impecável.',
    date: 'Há 2 dias',
  },
  {
    id: 2,
    name: 'Fernando Costa',
    avatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=100&h=100&fit=crop&crop=face',
    rating: 5,
    text: 'Agendamento online super prático. Cheguei, fiz check-in pelo app e fui atendido na hora. Recomendo demais!',
    date: 'Há 1 semana',
  },
  {
    id: 3,
    name: 'Bruno Mendes',
    avatar: 'https://images.unsplash.com/photo-1531427186611-ecfd6d936c79?w=100&h=100&fit=crop&crop=face',
    rating: 5,
    text: 'O programa de fidelidade é ótimo! Já ganhei 2 cortes grátis. Qualidade sempre consistente em cada visita.',
    date: 'Há 2 semanas',
  },
];

const TestimonialsSection = () => {
  return (
    <section className="section-padding bg-card/30">
      <div className="container-custom">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-sm font-medium text-primary uppercase tracking-wider">
            Depoimentos
          </span>
          <h2 className="font-display text-3xl sm:text-4xl font-bold mt-2 mb-4">
            O que nossos <span className="gold-text">Clientes</span> dizem
          </h2>
          <p className="text-muted-foreground">
            A satisfação dos nossos clientes é nossa maior recompensa. 
            Veja o que eles têm a dizer sobre a experiência Barber Flow.
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid md:grid-cols-3 gap-6">
          {testimonials.map((testimonial, index) => (
            <Card 
              key={testimonial.id}
              className="bg-card border-border/50 hover:border-primary/30 transition-all duration-300"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <CardContent className="p-6">
                <div className="space-y-4">
                  <Quote className="h-8 w-8 text-primary/30" />
                  
                  <p className="text-foreground/90 leading-relaxed">
                    "{testimonial.text}"
                  </p>

                  <div className="flex items-center gap-1">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-primary text-primary" />
                    ))}
                  </div>

                  <div className="flex items-center gap-3 pt-4 border-t border-border/50">
                    <img
                      src={testimonial.avatar}
                      alt={testimonial.name}
                      className="w-12 h-12 rounded-full object-cover"
                    />
                    <div>
                      <p className="font-medium">{testimonial.name}</p>
                      <p className="text-sm text-muted-foreground">{testimonial.date}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Stats Bar */}
        <div className="mt-16 p-8 rounded-2xl bg-gold-gradient">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="font-display text-3xl md:text-4xl font-bold text-primary-foreground">5,000+</div>
              <p className="text-primary-foreground/80 text-sm">Clientes Satisfeitos</p>
            </div>
            <div>
              <div className="font-display text-3xl md:text-4xl font-bold text-primary-foreground">15,000+</div>
              <p className="text-primary-foreground/80 text-sm">Cortes Realizados</p>
            </div>
            <div>
              <div className="font-display text-3xl md:text-4xl font-bold text-primary-foreground">4.9</div>
              <p className="text-primary-foreground/80 text-sm">Avaliação Média</p>
            </div>
            <div>
              <div className="font-display text-3xl md:text-4xl font-bold text-primary-foreground">8+</div>
              <p className="text-primary-foreground/80 text-sm">Anos de Experiência</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
