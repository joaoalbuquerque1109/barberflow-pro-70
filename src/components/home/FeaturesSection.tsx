import { Calendar, CreditCard, Bell, Gift, MessageCircle, Shield } from 'lucide-react';

const features = [
  {
    icon: Calendar,
    title: 'Agendamento Online',
    description: 'Agende seu horário 24/7, sem precisar ligar. Escolha o barbeiro, serviço e horário ideais.',
  },
  {
    icon: Bell,
    title: 'Lembretes Automáticos',
    description: 'Receba notificações sobre seus agendamentos para nunca perder um horário.',
  },
  {
    icon: CreditCard,
    title: 'Pagamento Fácil',
    description: 'Pague com Pix, cartão de crédito ou débito. Rápido e seguro.',
  },
  {
    icon: Gift,
    title: 'Programa de Fidelidade',
    description: 'Acumule pontos a cada visita e ganhe cortes gratuitos e descontos exclusivos.',
  },
  {
    icon: MessageCircle,
    title: 'Chat Direto',
    description: 'Converse diretamente com a barbearia para dúvidas ou solicitações especiais.',
  },
  {
    icon: Shield,
    title: 'Check-in Digital',
    description: 'Faça check-in ao chegar e seja atendido sem filas ou esperas desnecessárias.',
  },
];

const FeaturesSection = () => {
  return (
    <section className="section-padding bg-gradient-to-b from-background to-card/30">
      <div className="container-custom">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-sm font-medium text-primary uppercase tracking-wider">
            Por que nos escolher
          </span>
          <h2 className="font-display text-3xl sm:text-4xl font-bold mt-2 mb-4">
            Uma Experiência <span className="gold-text">Completa</span>
          </h2>
          <p className="text-muted-foreground">
            Tecnologia e tradição combinadas para oferecer a você a melhor 
            experiência em cuidados masculinos.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div 
              key={feature.title}
              className="group p-6 rounded-2xl bg-card/50 border border-border/50 hover:border-primary/30 transition-all duration-300 hover:-translate-y-1"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-gold-gradient flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <feature.icon className="h-6 w-6 text-primary-foreground" />
                </div>
                <div>
                  <h3 className="font-display text-lg font-semibold mb-2 group-hover:text-primary transition-colors">
                    {feature.title}
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
