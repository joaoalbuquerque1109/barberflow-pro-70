-- Drop the overly permissive policy and create a more secure one
DROP POLICY "Authenticated users can create tenants" ON public.tenants;

-- Create a more restrictive policy that prevents spam tenant creation
-- Allow tenant creation only if user doesn't already have a manager role for any tenant
CREATE POLICY "Authenticated users can create first tenant"
ON public.tenants
FOR INSERT
TO authenticated
WITH CHECK (
  NOT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = auth.uid() AND role = 'manager'
  )
);