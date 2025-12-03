import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { calculateDistance } from './useLocation';

export interface Tenant {
  id: string;
  name: string;
  slug: string;
  tenant_type: 'barbershop' | 'independent';
  description: string | null;
  logo_url: string | null;
  cover_image_url: string | null;
  phone: string | null;
  email: string | null;
  address: string | null;
  city: string | null;
  state: string | null;
  latitude: number | null;
  longitude: number | null;
  is_active: boolean;
  is_verified: boolean;
  business_hours: Record<string, unknown>;
  created_at: string;
  distance?: number;
}

interface UseTenantOptions {
  userLat?: number | null;
  userLng?: number | null;
  radius?: number; // in km
  city?: string;
  search?: string;
}

export function useTenants(options: UseTenantOptions = {}) {
  const { userLat, userLng, radius = 50, city, search } = options;

  return useQuery({
    queryKey: ['tenants', userLat, userLng, radius, city, search],
    queryFn: async () => {
      let query = supabase
        .from('tenants')
        .select('*')
        .eq('is_active', true);

      if (city) {
        query = query.ilike('city', `%${city}%`);
      }

      if (search) {
        query = query.ilike('name', `%${search}%`);
      }

      const { data, error } = await query;

      if (error) throw error;

      let tenants = (data || []) as Tenant[];

      // Calculate distances if user location is available
      if (userLat && userLng) {
        tenants = tenants
          .map(tenant => {
            if (tenant.latitude && tenant.longitude) {
              const distance = calculateDistance(
                userLat,
                userLng,
                Number(tenant.latitude),
                Number(tenant.longitude)
              );
              return { ...tenant, distance };
            }
            return tenant;
          })
          .filter(tenant => {
            // Filter by radius if distance is calculated
            if (tenant.distance !== undefined) {
              return tenant.distance <= radius;
            }
            return true;
          })
          .sort((a, b) => {
            // Sort by distance
            if (a.distance !== undefined && b.distance !== undefined) {
              return a.distance - b.distance;
            }
            return 0;
          });
      }

      return tenants;
    },
  });
}

export function useTenant(slug: string) {
  return useQuery({
    queryKey: ['tenant', slug],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('tenants')
        .select('*')
        .eq('slug', slug)
        .eq('is_active', true)
        .maybeSingle();

      if (error) throw error;
      return data as Tenant | null;
    },
    enabled: !!slug,
  });
}
