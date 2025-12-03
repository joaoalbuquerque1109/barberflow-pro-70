import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface Barber {
  id: string;
  user_id: string;
  tenant_id: string;
  display_name: string;
  bio: string | null;
  avatar_url: string | null;
  specialties: string[];
  commission_percentage: number;
  rating: number;
  review_count: number;
  is_available: boolean;
  is_active: boolean;
  portfolio_images: string[];
  created_at: string;
  tenant?: {
    id: string;
    name: string;
    slug: string;
    city: string | null;
    address: string | null;
    latitude: number | null;
    longitude: number | null;
  } | null;
}

interface UseBarberOptions {
  tenantId?: string;
  search?: string;
}

export function useBarbers(options: UseBarberOptions = {}) {
  const { tenantId, search } = options;

  return useQuery({
    queryKey: ['barbers', tenantId, search],
    queryFn: async () => {
      let query = supabase
        .from('barbers')
        .select(`
          *,
          tenant:tenants(id, name, slug, city, address, latitude, longitude)
        `)
        .eq('is_active', true);

      if (tenantId) {
        query = query.eq('tenant_id', tenantId);
      }

      if (search) {
        query = query.ilike('display_name', `%${search}%`);
      }

      const { data, error } = await query;

      if (error) throw error;
      return (data || []) as Barber[];
    },
  });
}

export function useBarber(barberId: string) {
  return useQuery({
    queryKey: ['barber', barberId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('barbers')
        .select(`
          *,
          tenant:tenants(id, name, slug, city, address, latitude, longitude)
        `)
        .eq('id', barberId)
        .eq('is_active', true)
        .maybeSingle();

      if (error) throw error;
      return data as Barber | null;
    },
    enabled: !!barberId,
  });
}
