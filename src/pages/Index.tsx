import { Helmet } from 'react-helmet-async';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import HeroSection from '@/components/home/HeroSection';
import ServicesPreview from '@/components/home/ServicesPreview';
import BarbersPreview from '@/components/home/BarbersPreview';
import FeaturesSection from '@/components/home/FeaturesSection';

const Index = () => {
  return (
    <>
      <Helmet>
        <title>Barber Flow - A Melhor Barbearia da Cidade | Agendamento Online</title>
        <meta name="description" content="Barber Flow: Agende seu corte de cabelo online. Barbeiros especialistas, ambiente premium e programa de fidelidade. A barbearia #1 com avaliação 4.9 estrelas." />
        <meta property="og:title" content="Barber Flow - Barbearia Premium com Agendamento Online" />
        <meta property="og:description" content="Experimente o melhor em cuidados masculinos. Agende online 24/7, escolha seu barbeiro favorito e acumule pontos de fidelidade." />
        <link rel="canonical" href="https://barberflow.com" />
      </Helmet>
      
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1">
          <HeroSection />
          <ServicesPreview />
          <BarbersPreview />
          <FeaturesSection />
        </main>
        <Footer />
      </div>
    </>
  );
};

export default Index;
