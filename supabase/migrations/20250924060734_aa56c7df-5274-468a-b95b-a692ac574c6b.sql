-- 1) Helper function to get current user role
CREATE OR REPLACE FUNCTION public.get_current_user_role()
RETURNS public.app_role
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT role FROM public.profiles WHERE user_id = auth.uid();
$$;

-- 2) Mentor applications: allow mentors to accept/decline
DROP POLICY IF EXISTS "Mentors can update applications" ON public.mentor_applications;
CREATE POLICY "Mentors can update applications"
ON public.mentor_applications
FOR UPDATE
USING (auth.uid() = mentor_id);

-- 3) Events policies to allow creation by alumni/faculty and approval by admin
-- Allow admins to see all events (including inactive)
DROP POLICY IF EXISTS "Admins can view all events" ON public.events;
CREATE POLICY "Admins can view all events"
ON public.events
FOR SELECT
USING (public.get_current_user_role() = 'admin');

-- Allow alumni and faculty to create events (default active can be false at insert-time by UI)
DROP POLICY IF EXISTS "Alumni and faculty can create events" ON public.events;
CREATE POLICY "Alumni and faculty can create events"
ON public.events
FOR INSERT
WITH CHECK (public.get_current_user_role() IN ('alumni','faculty'));

-- Allow admins to update any event (e.g., approve)
DROP POLICY IF EXISTS "Admins can update events" ON public.events;
CREATE POLICY "Admins can update events"
ON public.events
FOR UPDATE
USING (public.get_current_user_role() = 'admin');

-- 4) Achievements table for alumni
CREATE TABLE IF NOT EXISTS public.achievements (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  title text NOT NULL,
  description text,
  type text CHECK (type IN ('career','academic','business','award')) DEFAULT 'career',
  likes integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.achievements ENABLE ROW LEVEL SECURITY;

-- Everyone can view achievements
DROP POLICY IF EXISTS "Anyone can view achievements" ON public.achievements;
CREATE POLICY "Anyone can view achievements"
ON public.achievements
FOR SELECT
USING (true);

-- Owners can insert their achievements
DROP POLICY IF EXISTS "Users can create achievements" ON public.achievements;
CREATE POLICY "Users can create achievements"
ON public.achievements
FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Owners can update their achievements
DROP POLICY IF EXISTS "Users can update their achievements" ON public.achievements;
CREATE POLICY "Users can update their achievements"
ON public.achievements
FOR UPDATE
USING (auth.uid() = user_id);

-- Owners can delete their achievements
DROP POLICY IF EXISTS "Users can delete their achievements" ON public.achievements;
CREATE POLICY "Users can delete their achievements"
ON public.achievements
FOR DELETE
USING (auth.uid() = user_id);

-- Trigger to auto-update updated_at
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS trigger AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

DROP TRIGGER IF EXISTS trg_achievements_updated_at ON public.achievements;
CREATE TRIGGER trg_achievements_updated_at
BEFORE UPDATE ON public.achievements
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- 5) Optional: indexes for performance
CREATE INDEX IF NOT EXISTS idx_achievements_user_id ON public.achievements (user_id);

-- Ensure existing tables have realtime enabled data capture (best practice, optional)
-- Note: Lovable will add to publication automatically; REPLICA IDENTITY FULL is not strictly necessary here.
