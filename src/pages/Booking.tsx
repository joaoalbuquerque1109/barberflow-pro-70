import { useState, useMemo } from 'react';
import { Helmet } from 'react-helmet-async';
import { useSearchParams, useNavigate } from 'react-router-dom';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { mockBarbers, mockServices, generateTimeSlots } from '@/data/mockData';
import { Calendar, Clock, Check, ArrowLeft, ArrowRight, User, Scissors, CreditCard } from 'lucide-react';
import { cn } from '@/lib/utils';
import { format, addDays } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { toast } from 'sonner';

type Step = 'service' | 'barber' | 'datetime' | 'confirm';

const Booking = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  
  const [step, setStep] = useState<Step>('service');
  const [selectedService, setSelectedService] = useState<string | null>(searchParams.get('service'));
  const [selectedBarber, setSelectedBarber] = useState<string | null>(searchParams.get('barber'));
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [selectedTime, setSelectedTime] = useState<string | null>(null);

  const service = mockServices.find(s => s.id === selectedService);
  const barber = mockBarbers.find(b => b.id === selectedBarber);
  const timeSlots = useMemo(() => generateTimeSlots(format(selectedDate, 'yyyy-MM-dd')), [selectedDate]);

  const dates = Array.from({ length: 7 }, (_, i) => addDays(new Date(), i));

  const steps: { key: Step; label: string; icon: React.ElementType }[] = [
    { key: 'service', label: 'Serviço', icon: Scissors },
    { key: 'barber', label: 'Barbeiro', icon: User },
    { key: 'datetime', label: 'Data e Hora', icon: Calendar },
    { key: 'confirm', label: 'Confirmar', icon: Check },
  ];

  const currentStepIndex = steps.findIndex(s => s.key === step);

  const canProceed = () => {
    switch (step) {
      case 'service': return !!selectedService;
      case 'barber': return !!selectedBarber;
      case 'datetime': return !!selectedTime;
      default: return true;
    }
  };

  const nextStep = () => {
    const nextIndex = currentStepIndex + 1;
    if (nextIndex < steps.length) {
      setStep(steps[nextIndex].key);
    }
  };

  const prevStep = () => {
    const prevIndex = currentStepIndex - 1;
    if (prevIndex >= 0) {
      setStep(steps[prevIndex].key);
    }
  };

  const handleConfirm = () => {
    toast.success('Agendamento confirmado!', {
      description: `${service?.name} com ${barber?.name} em ${format(selectedDate, 'dd/MM')} às ${selectedTime}`,
    });
    navigate('/');
  };

  return (
    <>
      <Helmet>
        <title>Agendar Horário - Barber Flow</title>
        <meta name="description" content="Agende seu horário na Barber Flow. Escolha o serviço, barbeiro e horário em poucos cliques. Rápido e fácil!" />
      </Helmet>

      <div className="min-h-screen flex flex-col bg-background">
        <Navbar />
        
        <main className="flex-1 py-8">
          <div className="container-custom max-w-4xl">
            {/* Progress Steps */}
            <div className="mb-8">
              <div className="flex items-center justify-between">
                {steps.map((s, i) => (
                  <div key={s.key} className="flex items-center">
                    <div className={cn(
                      "flex items-center gap-2 px-4 py-2 rounded-full transition-all",
                      i <= currentStepIndex ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
                    )}>
                      <s.icon className="h-4 w-4" />
                      <span className="hidden sm:inline text-sm font-medium">{s.label}</span>
                    </div>
                    {i < steps.length - 1 && (
                      <div className={cn(
                        "w-8 sm:w-16 h-0.5 mx-2",
                        i < currentStepIndex ? "bg-primary" : "bg-border"
                      )} />
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Step Content */}
            <Card className="bg-card border-border/50">
              <CardHeader>
                <CardTitle className="font-display text-2xl">
                  {step === 'service' && 'Escolha o Serviço'}
                  {step === 'barber' && 'Escolha o Barbeiro'}
                  {step === 'datetime' && 'Escolha Data e Horário'}
                  {step === 'confirm' && 'Confirme seu Agendamento'}
                </CardTitle>
              </CardHeader>
              <CardContent>
                {/* Service Selection */}
                {step === 'service' && (
                  <div className="grid sm:grid-cols-2 gap-4">
                    {mockServices.map((s) => (
                      <button
                        key={s.id}
                        onClick={() => setSelectedService(s.id)}
                        className={cn(
                          "p-4 rounded-xl border text-left transition-all hover:-translate-y-0.5",
                          selectedService === s.id 
                            ? "border-primary bg-primary/10" 
                            : "border-border hover:border-primary/50"
                        )}
                      >
                        <div className="flex justify-between items-start mb-2">
                          <span className="text-xs font-medium px-2 py-1 rounded-full bg-secondary">
                            {s.category}
                          </span>
                          <div className="flex items-center gap-1 text-sm text-muted-foreground">
                            <Clock className="h-3 w-3" />
                            {s.duration}min
                          </div>
                        </div>
                        <h3 className="font-semibold mb-1">{s.name}</h3>
                        <p className="text-sm text-muted-foreground line-clamp-2 mb-3">{s.description}</p>
                        <p className="font-display text-xl font-bold text-primary">R$ {s.price}</p>
                      </button>
                    ))}
                  </div>
                )}

                {/* Barber Selection */}
                {step === 'barber' && (
                  <div className="grid sm:grid-cols-3 gap-4">
                    {mockBarbers.map((b) => (
                      <button
                        key={b.id}
                        onClick={() => setSelectedBarber(b.id)}
                        disabled={!b.isAvailable}
                        className={cn(
                          "p-4 rounded-xl border text-center transition-all",
                          selectedBarber === b.id 
                            ? "border-primary bg-primary/10" 
                            : "border-border hover:border-primary/50",
                          !b.isAvailable && "opacity-50 cursor-not-allowed"
                        )}
                      >
                        <img
                          src={b.avatar}
                          alt={b.name}
                          className="w-20 h-20 rounded-full mx-auto mb-3 object-cover"
                        />
                        <h3 className="font-semibold">{b.name}</h3>
                        <div className="flex items-center justify-center gap-1 text-sm text-primary mt-1">
                          <span>⭐ {b.rating}</span>
                        </div>
                        <p className="text-xs text-muted-foreground mt-2">
                          {b.isAvailable ? 'Disponível' : 'Indisponível'}
                        </p>
                      </button>
                    ))}
                  </div>
                )}

                {/* DateTime Selection */}
                {step === 'datetime' && (
                  <div className="space-y-6">
                    {/* Date Selection */}
                    <div>
                      <h4 className="font-medium mb-3">Selecione a data:</h4>
                      <div className="flex gap-2 overflow-x-auto pb-2">
                        {dates.map((date) => (
                          <button
                            key={date.toISOString()}
                            onClick={() => {
                              setSelectedDate(date);
                              setSelectedTime(null);
                            }}
                            className={cn(
                              "flex-shrink-0 w-20 p-3 rounded-xl border text-center transition-all",
                              selectedDate.toDateString() === date.toDateString()
                                ? "border-primary bg-primary/10"
                                : "border-border hover:border-primary/50"
                            )}
                          >
                            <p className="text-xs text-muted-foreground uppercase">
                              {format(date, 'EEE', { locale: ptBR })}
                            </p>
                            <p className="font-display text-xl font-bold">
                              {format(date, 'd')}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {format(date, 'MMM', { locale: ptBR })}
                            </p>
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Time Selection */}
                    <div>
                      <h4 className="font-medium mb-3">Selecione o horário:</h4>
                      <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-2">
                        {timeSlots.map((slot) => (
                          <button
                            key={slot.id}
                            onClick={() => slot.isAvailable && setSelectedTime(slot.time)}
                            disabled={!slot.isAvailable}
                            className={cn(
                              "py-2 px-3 rounded-lg border text-sm font-medium transition-all",
                              selectedTime === slot.time
                                ? "border-primary bg-primary text-primary-foreground"
                                : slot.isAvailable
                                  ? "border-border hover:border-primary/50"
                                  : "border-border/30 text-muted-foreground/50 cursor-not-allowed line-through"
                            )}
                          >
                            {slot.time}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* Confirmation */}
                {step === 'confirm' && service && barber && (
                  <div className="space-y-6">
                    <div className="p-6 rounded-xl bg-secondary/50 space-y-4">
                      <div className="flex items-center gap-4">
                        <img
                          src={barber.avatar}
                          alt={barber.name}
                          className="w-16 h-16 rounded-full object-cover"
                        />
                        <div>
                          <p className="font-semibold">{barber.name}</p>
                          <p className="text-sm text-muted-foreground">Barbeiro</p>
                        </div>
                      </div>
                      
                      <div className="grid gap-3 pt-4 border-t border-border">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Serviço</span>
                          <span className="font-medium">{service.name}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Data</span>
                          <span className="font-medium">
                            {format(selectedDate, "dd 'de' MMMM", { locale: ptBR })}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Horário</span>
                          <span className="font-medium">{selectedTime}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Duração</span>
                          <span className="font-medium">{service.duration} minutos</span>
                        </div>
                        <div className="flex justify-between pt-4 border-t border-border">
                          <span className="font-semibold">Total</span>
                          <span className="font-display text-2xl font-bold text-primary">
                            R$ {service.price}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 p-4 rounded-xl bg-primary/10 border border-primary/20">
                      <CreditCard className="h-5 w-5 text-primary" />
                      <p className="text-sm">
                        Pagamento será feito no local. Aceitamos Pix, cartão de crédito e débito.
                      </p>
                    </div>
                  </div>
                )}

                {/* Navigation */}
                <div className="flex justify-between mt-8 pt-6 border-t border-border">
                  <Button
                    variant="outline"
                    onClick={prevStep}
                    disabled={currentStepIndex === 0}
                  >
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Voltar
                  </Button>

                  {step === 'confirm' ? (
                    <Button variant="gold" onClick={handleConfirm}>
                      Confirmar Agendamento
                      <Check className="ml-2 h-4 w-4" />
                    </Button>
                  ) : (
                    <Button
                      variant="gold"
                      onClick={nextStep}
                      disabled={!canProceed()}
                    >
                      Continuar
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </main>

        <Footer />
      </div>
    </>
  );
};

export default Booking;
