-- =================================================================
-- SECURITY FIX: Remove permissive user_roles INSERT policy
-- This prevents users from self-assigning elevated roles
-- =================================================================

-- Drop the dangerous policy that allows users to assign any role to themselves
DROP POLICY IF EXISTS "Users can create own roles" ON public.user_roles;

-- =================================================================
-- SECURITY FIX: Create secure role assignment function
-- Uses SECURITY DEFINER to bypass RLS but validates legitimate use cases
-- =================================================================

-- Function to assign manager role during tenant creation (called by trigger)
CREATE OR REPLACE FUNCTION public.assign_tenant_roles()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Assign manager role to the user who created the tenant
  INSERT INTO public.user_roles (user_id, tenant_id, role)
  SELECT p.id, NEW.id, 'manager'::app_role
  FROM public.profiles p
  WHERE p.id = auth.uid()
  ON CONFLICT DO NOTHING;
  
  RETURN NEW;
END;
$$;

-- Create trigger to automatically assign manager role when tenant is created
DROP TRIGGER IF EXISTS assign_tenant_roles_trigger ON public.tenants;
CREATE TRIGGER assign_tenant_roles_trigger
  AFTER INSERT ON public.tenants
  FOR EACH ROW
  EXECUTE FUNCTION public.assign_tenant_roles();

-- Function to assign barber role when a barber profile is created
CREATE OR REPLACE FUNCTION public.assign_barber_role()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Assign barber role to the user who created the barber profile
  INSERT INTO public.user_roles (user_id, tenant_id, role)
  VALUES (NEW.user_id, NEW.tenant_id, 'barber'::app_role)
  ON CONFLICT DO NOTHING;
  
  RETURN NEW;
END;
$$;

-- Create trigger to automatically assign barber role when barber profile is created
DROP TRIGGER IF EXISTS assign_barber_role_trigger ON public.barbers;
CREATE TRIGGER assign_barber_role_trigger
  AFTER INSERT ON public.barbers
  FOR EACH ROW
  EXECUTE FUNCTION public.assign_barber_role();

-- =================================================================
-- SECURITY FIX: Add payments INSERT policy
-- Allows clients to create payments only for their own bookings
-- =================================================================

CREATE POLICY "Clients can create payments for own bookings"
ON public.payments
FOR INSERT
TO authenticated
WITH CHECK (
  client_id = auth.uid() AND
  EXISTS (
    SELECT 1 FROM public.bookings
    WHERE bookings.id = booking_id
    AND bookings.client_id = auth.uid()
  )
);

-- =================================================================
-- SECURITY FIX: Add DELETE policy for managers on bookings
-- Allows managers to clean up spam/test bookings
-- =================================================================

CREATE POLICY "Managers can delete tenant bookings"
ON public.bookings
FOR DELETE
TO authenticated
USING (public.has_role(auth.uid(), 'manager'::app_role, tenant_id));