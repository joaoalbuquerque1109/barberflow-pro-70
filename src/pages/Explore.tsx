import { useState, useMemo } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { MapPin, Search, Filter, Star, Navigation, Clock, Building2, User, Loader2 } from 'lucide-react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { useLocation, formatDistance } from '@/hooks/useLocation';
import { useTenants, Tenant } from '@/hooks/useTenants';

const Explore = () => {
  const { latitude, longitude, loading: locationLoading, error: locationError, requestLocation } = useLocation();
  const [searchQuery, setSearchQuery] = useState('');
  const [radius, setRadius] = useState(10);
  const [sortBy, setSortBy] = useState<'distance' | 'rating' | 'name'>('distance');
  const [filterType, setFilterType] = useState<'all' | 'barbershop' | 'independent'>('all');

  const { data: tenants, isLoading: tenantsLoading } = useTenants({
    userLat: latitude,
    userLng: longitude,
    radius,
    search: searchQuery || undefined,
  });

  const filteredTenants = useMemo(() => {
    if (!tenants) return [];

    let filtered = tenants;

    if (filterType !== 'all') {
      filtered = filtered.filter(t => t.tenant_type === filterType);
    }

    // Sort
    return filtered.sort((a, b) => {
      switch (sortBy) {
        case 'distance':
          if (a.distance !== undefined && b.distance !== undefined) {
            return a.distance - b.distance;
          }
          return 0;
        case 'rating':
          return 0; // Would need rating data
        case 'name':
          return a.name.localeCompare(b.name);
        default:
          return 0;
      }
    });
  }, [tenants, sortBy, filterType]);

  const openInMaps = (tenant: Tenant) => {
    if (tenant.latitude && tenant.longitude) {
      window.open(
        `https://www.google.com/maps/dir/?api=1&destination=${tenant.latitude},${tenant.longitude}`,
        '_blank'
      );
    }
  };

  return (
    <>
      <Helmet>
        <title>Explorar Barbeiros Próximos - Barber Master</title>
        <meta name="description" content="Encontre barbeiros e barbearias próximos a você. Use o GPS para descobrir os melhores profissionais na sua região." />
      </Helmet>

      <div className="min-h-screen flex flex-col">
        <Navbar />
        
        <main className="flex-1 bg-background">
          {/* Header */}
          <section className="bg-card border-b border-border py-8">
            <div className="container-custom">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <h1 className="font-display text-3xl font-bold">
                    Explorar <span className="gold-text">Barbeiros</span>
                  </h1>
                  <p className="text-muted-foreground mt-1">
                    Encontre os melhores profissionais perto de você
                  </p>
                </div>

                {/* Location Status */}
                <div className="flex items-center gap-2">
                  {locationLoading ? (
                    <Badge variant="secondary" className="flex items-center gap-1">
                      <Loader2 className="h-3 w-3 animate-spin" />
                      Obtendo localização...
                    </Badge>
                  ) : locationError ? (
                    <Button variant="outline" size="sm" onClick={requestLocation}>
                      <MapPin className="h-4 w-4 mr-1" />
                      Permitir localização
                    </Button>
                  ) : (
                    <Badge variant="secondary" className="flex items-center gap-1">
                      <MapPin className="h-3 w-3 text-green-500" />
                      Localização ativa
                    </Badge>
                  )}
                </div>
              </div>

              {/* Search and Filters */}
              <div className="mt-6 grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="md:col-span-2 relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Buscar por nome..."
                    className="pl-10"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>

                <Select value={filterType} onValueChange={(v) => setFilterType(v as typeof filterType)}>
                  <SelectTrigger>
                    <Filter className="h-4 w-4 mr-2" />
                    <SelectValue placeholder="Tipo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos</SelectItem>
                    <SelectItem value="barbershop">Barbearias</SelectItem>
                    <SelectItem value="independent">Autônomos</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={sortBy} onValueChange={(v) => setSortBy(v as typeof sortBy)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Ordenar por" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="distance">Mais próximos</SelectItem>
                    <SelectItem value="rating">Melhor avaliados</SelectItem>
                    <SelectItem value="name">Nome A-Z</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Radius Slider */}
              {latitude && longitude && (
                <div className="mt-4 flex items-center gap-4">
                  <span className="text-sm text-muted-foreground">Raio:</span>
                  <Slider
                    value={[radius]}
                    onValueChange={(v) => setRadius(v[0])}
                    max={50}
                    min={1}
                    step={1}
                    className="w-48"
                  />
                  <span className="text-sm font-medium">{radius}km</span>
                </div>
              )}
            </div>
          </section>

          {/* Results */}
          <section className="py-8">
            <div className="container-custom">
              {tenantsLoading ? (
                <div className="flex items-center justify-center py-20">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
              ) : filteredTenants.length === 0 ? (
                <div className="text-center py-20">
                  <MapPin className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <h3 className="font-display text-xl font-semibold mb-2">Nenhum resultado encontrado</h3>
                  <p className="text-muted-foreground">
                    {locationError 
                      ? 'Permita o acesso à localização para ver barbeiros próximos'
                      : 'Tente aumentar o raio de busca ou alterar os filtros'
                    }
                  </p>
                </div>
              ) : (
                <>
                  <p className="text-sm text-muted-foreground mb-6">
                    {filteredTenants.length} resultado{filteredTenants.length !== 1 ? 's' : ''} encontrado{filteredTenants.length !== 1 ? 's' : ''}
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredTenants.map((tenant) => (
                      <TenantCard 
                        key={tenant.id} 
                        tenant={tenant} 
                        onNavigate={() => openInMaps(tenant)}
                      />
                    ))}
                  </div>
                </>
              )}
            </div>
          </section>
        </main>

        <Footer />
      </div>
    </>
  );
};

interface TenantCardProps {
  tenant: Tenant;
  onNavigate: () => void;
}

function TenantCard({ tenant, onNavigate }: TenantCardProps) {
  return (
    <Card className="group overflow-hidden hover:border-primary/50 transition-all duration-300">
      {/* Cover Image */}
      <div className="relative h-40 bg-muted overflow-hidden">
        {tenant.cover_image_url ? (
          <img 
            src={tenant.cover_image_url} 
            alt={tenant.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center">
            {tenant.tenant_type === 'barbershop' ? (
              <Building2 className="h-12 w-12 text-muted-foreground" />
            ) : (
              <User className="h-12 w-12 text-muted-foreground" />
            )}
          </div>
        )}

        {/* Type Badge */}
        <Badge 
          className="absolute top-3 left-3"
          variant={tenant.tenant_type === 'barbershop' ? 'default' : 'secondary'}
        >
          {tenant.tenant_type === 'barbershop' ? 'Barbearia' : 'Autônomo'}
        </Badge>

        {/* Distance Badge */}
        {tenant.distance !== undefined && (
          <Badge className="absolute top-3 right-3 bg-background/80 backdrop-blur-sm text-foreground">
            <MapPin className="h-3 w-3 mr-1" />
            {formatDistance(tenant.distance)}
          </Badge>
        )}

        {/* Logo */}
        {tenant.logo_url && (
          <div className="absolute -bottom-6 left-4">
            <div className="h-12 w-12 rounded-xl border-2 border-background overflow-hidden bg-card">
              <img src={tenant.logo_url} alt={tenant.name} className="w-full h-full object-cover" />
            </div>
          </div>
        )}
      </div>

      <CardContent className="pt-8 pb-4">
        <div className="flex items-start justify-between gap-2">
          <div>
            <h3 className="font-display text-lg font-semibold group-hover:text-primary transition-colors">
              {tenant.name}
            </h3>
            {tenant.city && (
              <p className="text-sm text-muted-foreground flex items-center gap-1 mt-1">
                <MapPin className="h-3 w-3" />
                {tenant.city}{tenant.state && `, ${tenant.state}`}
              </p>
            )}
          </div>

          {tenant.is_verified && (
            <Badge variant="outline" className="text-green-500 border-green-500/30">
              Verificado
            </Badge>
          )}
        </div>

        {tenant.description && (
          <p className="text-sm text-muted-foreground mt-3 line-clamp-2">
            {tenant.description}
          </p>
        )}

        <div className="flex items-center gap-2 mt-4">
          <Link to={`/b/${tenant.slug}`} className="flex-1">
            <Button variant="gold" className="w-full" size="sm">
              Ver Perfil
            </Button>
          </Link>
          
          {tenant.latitude && tenant.longitude && (
            <Button 
              variant="outline" 
              size="sm"
              onClick={(e) => {
                e.preventDefault();
                onNavigate();
              }}
            >
              <Navigation className="h-4 w-4" />
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

export default Explore;
