CREATE TABLE IF NOT EXISTS public.bookings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  topic text NOT NULL,
  meeting_type text NOT NULL DEFAULT 'discovery',
  preferred_date date NOT NULL,
  preferred_time time NOT NULL,
  timezone text NOT NULL DEFAULT 'Africa/Lagos',
  notes text,
  status text NOT NULL DEFAULT 'requested',
  admin_notes text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT bookings_status_check CHECK (status IN ('requested', 'confirmed', 'rescheduled', 'completed', 'cancelled')),
  CONSTRAINT bookings_meeting_type_check CHECK (meeting_type IN ('discovery', 'product', 'research', 'growth'))
);

CREATE INDEX IF NOT EXISTS bookings_client_id_idx ON public.bookings(client_id);
CREATE INDEX IF NOT EXISTS bookings_status_idx ON public.bookings(status);
CREATE INDEX IF NOT EXISTS bookings_preferred_date_idx ON public.bookings(preferred_date);

ALTER TABLE public.bookings
  ADD COLUMN IF NOT EXISTS scheduled_date date,
  ADD COLUMN IF NOT EXISTS scheduled_time time,
  ADD COLUMN IF NOT EXISTS scheduled_timezone text DEFAULT 'Africa/Lagos',
  ADD COLUMN IF NOT EXISTS meeting_url text,
  ADD COLUMN IF NOT EXISTS location text,
  ADD COLUMN IF NOT EXISTS reschedule_reason text;

ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Clients can view own bookings" ON public.bookings;
CREATE POLICY "Clients can view own bookings" ON public.bookings
  FOR SELECT
  TO authenticated
  USING ((select auth.uid()) = client_id);

DROP POLICY IF EXISTS "Clients can create own bookings" ON public.bookings;
CREATE POLICY "Clients can create own bookings" ON public.bookings
  FOR INSERT
  TO authenticated
  WITH CHECK ((select auth.uid()) = client_id);

DROP POLICY IF EXISTS "Admins can view all bookings" ON public.bookings;
CREATE POLICY "Admins can view all bookings" ON public.bookings
  FOR SELECT
  TO authenticated
  USING (public.is_admin());

DROP POLICY IF EXISTS "Admins can update all bookings" ON public.bookings;
CREATE POLICY "Admins can update all bookings" ON public.bookings
  FOR UPDATE
  TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());
