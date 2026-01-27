-- Add INSERT policies for business registration flow

-- Allow authenticated users to create a new tenant
CREATE POLICY "Authenticated users can create tenants"
ON public.tenants
FOR INSERT
TO authenticated
WITH CHECK (true);

-- Allow authenticated users to insert their own barber profile
CREATE POLICY "Users can create own barber profile"
ON public.barbers
FOR INSERT
TO authenticated
WITH CHECK (user_id = auth.uid());

-- Allow authenticated users to insert their own roles (manager/barber roles for their own tenant)
CREATE POLICY "Users can create own roles"
ON public.user_roles
FOR INSERT
TO authenticated
WITH CHECK (user_id = auth.uid());