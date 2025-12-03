import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link, useNavigate } from 'react-router-dom';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Scissors, Building2, User, ArrowRight, ArrowLeft, MapPin, Phone, Mail, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';

const step1Schema = z.object({
  tenantType: z.enum(['barbershop', 'independent']),
});

const step2Schema = z.object({
  name: z.string().min(2, 'Nome deve ter no mínimo 2 caracteres').max(100),
  description: z.string().max(500).optional(),
  phone: z.string().optional(),
  email: z.string().email('Email inválido').optional().or(z.literal('')),
});

const step3Schema = z.object({
  address: z.string().optional(),
  city: z.string().min(2, 'Cidade é obrigatória'),
  state: z.string().min(2, 'Estado é obrigatório'),
  zipCode: z.string().optional(),
});

const accountSchema = z.object({
  fullName: z.string().min(2, 'Nome deve ter no mínimo 2 caracteres'),
  email: z.string().email('Email inválido'),
  password: z.string().min(8, 'Senha deve ter no mínimo 8 caracteres'),
});

function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
    + '-' + Math.random().toString(36).substring(2, 8);
}

const RegisterBusiness = () => {
  const navigate = useNavigate();
  const { user, signUp, signIn, loading: authLoading } = useAuth();
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Form data
  const [tenantType, setTenantType] = useState<'barbershop' | 'independent'>('barbershop');
  const [businessName, setBusinessName] = useState('');
  const [businessDescription, setBusinessDescription] = useState('');
  const [businessPhone, setBusinessPhone] = useState('');
  const [businessEmail, setBusinessEmail] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [zipCode, setZipCode] = useState('');
  const [accountName, setAccountName] = useState('');
  const [accountEmail, setAccountEmail] = useState('');
  const [accountPassword, setAccountPassword] = useState('');
  const [coordinates, setCoordinates] = useState<{ lat: number | null; lng: number | null }>({ lat: null, lng: null });

  // Get user's location
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setCoordinates({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
        },
        () => {
          // Location permission denied or error
        }
      );
    }
  }, []);

  const validateStep = (currentStep: number): boolean => {
    setErrors({});
    
    switch (currentStep) {
      case 1:
        return step1Schema.safeParse({ tenantType }).success;
      case 2:
        const step2Result = step2Schema.safeParse({
          name: businessName,
          description: businessDescription,
          phone: businessPhone,
          email: businessEmail,
        });
        if (!step2Result.success) {
          const fieldErrors: Record<string, string> = {};
          step2Result.error.errors.forEach(err => {
            if (err.path[0]) fieldErrors[err.path[0] as string] = err.message;
          });
          setErrors(fieldErrors);
          return false;
        }
        return true;
      case 3:
        const step3Result = step3Schema.safeParse({
          address,
          city,
          state,
          zipCode,
        });
        if (!step3Result.success) {
          const fieldErrors: Record<string, string> = {};
          step3Result.error.errors.forEach(err => {
            if (err.path[0]) fieldErrors[err.path[0] as string] = err.message;
          });
          setErrors(fieldErrors);
          return false;
        }
        return true;
      case 4:
        if (user) return true; // Already logged in
        const accountResult = accountSchema.safeParse({
          fullName: accountName,
          email: accountEmail,
          password: accountPassword,
        });
        if (!accountResult.success) {
          const fieldErrors: Record<string, string> = {};
          accountResult.error.errors.forEach(err => {
            if (err.path[0]) fieldErrors[err.path[0] as string] = err.message;
          });
          setErrors(fieldErrors);
          return false;
        }
        return true;
      default:
        return true;
    }
  };

  const nextStep = () => {
    if (validateStep(step)) {
      setStep(step + 1);
    }
  };

  const prevStep = () => {
    setStep(step - 1);
  };

  const handleSubmit = async () => {
    if (!validateStep(step)) return;

    setIsLoading(true);

    try {
      let currentUser = user;

      // Create account if not logged in
      if (!currentUser) {
        const { error: signUpError } = await signUp(accountEmail, accountPassword, accountName);
        if (signUpError) {
          if (signUpError.message.includes('already registered')) {
            toast.error('Este email já está cadastrado. Faça login primeiro.');
          } else {
            toast.error('Erro ao criar conta', { description: signUpError.message });
          }
          setIsLoading(false);
          return;
        }

        // Get the user after signup
        const { data: { user: newUser } } = await supabase.auth.getUser();
        currentUser = newUser;
      }

      if (!currentUser) {
        toast.error('Erro ao autenticar. Tente novamente.');
        setIsLoading(false);
        return;
      }

      // Create tenant
      const slug = generateSlug(businessName);
      const { data: tenant, error: tenantError } = await supabase
        .from('tenants')
        .insert({
          name: businessName,
          slug,
          tenant_type: tenantType,
          description: businessDescription || null,
          phone: businessPhone || null,
          email: businessEmail || null,
          address: address || null,
          city,
          state,
          zip_code: zipCode || null,
          latitude: coordinates.lat,
          longitude: coordinates.lng,
        })
        .select()
        .single();

      if (tenantError) {
        console.error('Tenant creation error:', tenantError);
        toast.error('Erro ao criar negócio', { description: tenantError.message });
        setIsLoading(false);
        return;
      }

      // Update user profile with tenant_id
      await supabase
        .from('profiles')
        .update({ tenant_id: tenant.id })
        .eq('id', currentUser.id);

      // Add manager role for this tenant
      await supabase
        .from('user_roles')
        .insert({
          user_id: currentUser.id,
          tenant_id: tenant.id,
          role: 'manager',
        });

      // If independent barber, also create barber profile
      if (tenantType === 'independent') {
        await supabase
          .from('barbers')
          .insert({
            user_id: currentUser.id,
            tenant_id: tenant.id,
            display_name: businessName,
            bio: businessDescription || null,
          });

        // Add barber role
        await supabase
          .from('user_roles')
          .insert({
            user_id: currentUser.id,
            tenant_id: tenant.id,
            role: 'barber',
          });
      }

      toast.success('Negócio cadastrado com sucesso!', {
        description: 'Agora você pode configurar seus serviços e barbeiros.',
      });

      navigate('/manager/dashboard');
    } catch (error) {
      console.error('Registration error:', error);
      toast.error('Erro inesperado. Tente novamente.');
    }

    setIsLoading(false);
  };

  const totalSteps = user ? 3 : 4;

  return (
    <>
      <Helmet>
        <title>Cadastrar Barbearia - Barber Master</title>
        <meta name="description" content="Cadastre sua barbearia ou perfil de barbeiro autônomo na Barber Master e comece a receber agendamentos online." />
      </Helmet>

      <div className="min-h-screen flex items-center justify-center bg-background bg-pattern p-4">
        <div className="w-full max-w-lg">
          {/* Logo */}
          <Link to="/" className="flex items-center justify-center gap-2 mb-8">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gold-gradient">
              <Scissors className="h-6 w-6 text-primary-foreground" />
            </div>
            <span className="font-display text-2xl font-bold">Barber Master</span>
          </Link>

          {/* Progress */}
          <div className="mb-8">
            <div className="flex justify-between mb-2">
              {Array.from({ length: totalSteps }).map((_, i) => (
                <div
                  key={i}
                  className={`flex-1 h-2 rounded-full mx-1 transition-colors ${
                    i < step ? 'bg-primary' : i === step - 1 ? 'bg-primary' : 'bg-muted'
                  }`}
                />
              ))}
            </div>
            <p className="text-center text-sm text-muted-foreground">
              Passo {step} de {totalSteps}
            </p>
          </div>

          <Card className="bg-card/80 backdrop-blur-xl border-border/50">
            {/* Step 1: Business Type */}
            {step === 1 && (
              <>
                <CardHeader className="text-center">
                  <CardTitle className="font-display text-2xl">Tipo de Negócio</CardTitle>
                  <CardDescription>
                    Escolha o tipo de cadastro que melhor se aplica
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <RadioGroup
                    value={tenantType}
                    onValueChange={(v) => setTenantType(v as typeof tenantType)}
                    className="grid grid-cols-1 gap-4"
                  >
                    <Label
                      htmlFor="barbershop"
                      className={`flex items-start gap-4 p-4 rounded-lg border-2 cursor-pointer transition-colors ${
                        tenantType === 'barbershop' ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/50'
                      }`}
                    >
                      <RadioGroupItem value="barbershop" id="barbershop" />
                      <Building2 className="h-6 w-6 text-primary mt-0.5" />
                      <div>
                        <p className="font-semibold">Barbearia</p>
                        <p className="text-sm text-muted-foreground">
                          Estabelecimento com um ou mais barbeiros
                        </p>
                      </div>
                    </Label>

                    <Label
                      htmlFor="independent"
                      className={`flex items-start gap-4 p-4 rounded-lg border-2 cursor-pointer transition-colors ${
                        tenantType === 'independent' ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/50'
                      }`}
                    >
                      <RadioGroupItem value="independent" id="independent" />
                      <User className="h-6 w-6 text-primary mt-0.5" />
                      <div>
                        <p className="font-semibold">Barbeiro Autônomo</p>
                        <p className="text-sm text-muted-foreground">
                          Profissional independente
                        </p>
                      </div>
                    </Label>
                  </RadioGroup>

                  <Button variant="gold" className="w-full mt-6" onClick={nextStep}>
                    Continuar
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </CardContent>
              </>
            )}

            {/* Step 2: Business Info */}
            {step === 2 && (
              <>
                <CardHeader className="text-center">
                  <CardTitle className="font-display text-2xl">
                    {tenantType === 'barbershop' ? 'Dados da Barbearia' : 'Seus Dados Profissionais'}
                  </CardTitle>
                  <CardDescription>
                    Informações que os clientes verão
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="business-name">
                      {tenantType === 'barbershop' ? 'Nome da Barbearia' : 'Nome Profissional'} *
                    </Label>
                    <Input
                      id="business-name"
                      placeholder={tenantType === 'barbershop' ? 'Ex: Barbearia Premium' : 'Ex: João Barbeiro'}
                      value={businessName}
                      onChange={(e) => setBusinessName(e.target.value)}
                    />
                    {errors.name && <p className="text-xs text-destructive">{errors.name}</p>}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="description">Descrição</Label>
                    <Textarea
                      id="description"
                      placeholder="Conte um pouco sobre seu negócio..."
                      value={businessDescription}
                      onChange={(e) => setBusinessDescription(e.target.value)}
                      rows={3}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="phone">Telefone</Label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="phone"
                          placeholder="(11) 99999-9999"
                          className="pl-10"
                          value={businessPhone}
                          onChange={(e) => setBusinessPhone(e.target.value)}
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="business-email">Email</Label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="business-email"
                          type="email"
                          placeholder="contato@email.com"
                          className="pl-10"
                          value={businessEmail}
                          onChange={(e) => setBusinessEmail(e.target.value)}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-4 mt-6">
                    <Button variant="outline" className="flex-1" onClick={prevStep}>
                      <ArrowLeft className="mr-2 h-4 w-4" />
                      Voltar
                    </Button>
                    <Button variant="gold" className="flex-1" onClick={nextStep}>
                      Continuar
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </>
            )}

            {/* Step 3: Location */}
            {step === 3 && (
              <>
                <CardHeader className="text-center">
                  <CardTitle className="font-display text-2xl">Localização</CardTitle>
                  <CardDescription>
                    Onde os clientes podem te encontrar
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="address">Endereço</Label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="address"
                        placeholder="Rua, número, bairro"
                        className="pl-10"
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="city">Cidade *</Label>
                      <Input
                        id="city"
                        placeholder="São Paulo"
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                      />
                      {errors.city && <p className="text-xs text-destructive">{errors.city}</p>}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="state">Estado *</Label>
                      <Input
                        id="state"
                        placeholder="SP"
                        value={state}
                        onChange={(e) => setState(e.target.value)}
                      />
                      {errors.state && <p className="text-xs text-destructive">{errors.state}</p>}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="zip">CEP</Label>
                    <Input
                      id="zip"
                      placeholder="00000-000"
                      value={zipCode}
                      onChange={(e) => setZipCode(e.target.value)}
                    />
                  </div>

                  {coordinates.lat && coordinates.lng && (
                    <p className="text-xs text-green-500 flex items-center gap-1">
                      <MapPin className="h-3 w-3" />
                      Localização GPS detectada automaticamente
                    </p>
                  )}

                  <div className="flex gap-4 mt-6">
                    <Button variant="outline" className="flex-1" onClick={prevStep}>
                      <ArrowLeft className="mr-2 h-4 w-4" />
                      Voltar
                    </Button>
                    {user ? (
                      <Button variant="gold" className="flex-1" onClick={handleSubmit} disabled={isLoading}>
                        {isLoading ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Cadastrando...
                          </>
                        ) : (
                          <>
                            Finalizar
                            <ArrowRight className="ml-2 h-4 w-4" />
                          </>
                        )}
                      </Button>
                    ) : (
                      <Button variant="gold" className="flex-1" onClick={nextStep}>
                        Continuar
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </CardContent>
              </>
            )}

            {/* Step 4: Account (only if not logged in) */}
            {step === 4 && !user && (
              <>
                <CardHeader className="text-center">
                  <CardTitle className="font-display text-2xl">Criar sua Conta</CardTitle>
                  <CardDescription>
                    Você usará esta conta para gerenciar seu negócio
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="account-name">Seu Nome *</Label>
                    <Input
                      id="account-name"
                      placeholder="Seu nome completo"
                      value={accountName}
                      onChange={(e) => setAccountName(e.target.value)}
                    />
                    {errors.fullName && <p className="text-xs text-destructive">{errors.fullName}</p>}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="account-email">Email *</Label>
                    <Input
                      id="account-email"
                      type="email"
                      placeholder="seu@email.com"
                      value={accountEmail}
                      onChange={(e) => setAccountEmail(e.target.value)}
                    />
                    {errors.email && <p className="text-xs text-destructive">{errors.email}</p>}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="account-password">Senha *</Label>
                    <Input
                      id="account-password"
                      type="password"
                      placeholder="Mínimo 8 caracteres"
                      value={accountPassword}
                      onChange={(e) => setAccountPassword(e.target.value)}
                    />
                    {errors.password && <p className="text-xs text-destructive">{errors.password}</p>}
                  </div>

                  <div className="flex gap-4 mt-6">
                    <Button variant="outline" className="flex-1" onClick={prevStep}>
                      <ArrowLeft className="mr-2 h-4 w-4" />
                      Voltar
                    </Button>
                    <Button variant="gold" className="flex-1" onClick={handleSubmit} disabled={isLoading}>
                      {isLoading ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Cadastrando...
                        </>
                      ) : (
                        <>
                          Finalizar Cadastro
                          <ArrowRight className="ml-2 h-4 w-4" />
                        </>
                      )}
                    </Button>
                  </div>
                </CardContent>
              </>
            )}
          </Card>

          <p className="text-center text-sm text-muted-foreground mt-6">
            Já tem uma conta?{' '}
            <Link to="/auth" className="text-primary hover:underline">Fazer login</Link>
          </p>
        </div>
      </div>
    </>
  );
};

export default RegisterBusiness;
