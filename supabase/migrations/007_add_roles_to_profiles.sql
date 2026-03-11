-- Add roles column to profiles
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS roles TEXT[] DEFAULT '{}';

-- Initialize roles with existing role for established users
UPDATE public.profiles SET roles = ARRAY[role] WHERE roles = '{}' OR roles IS NULL;

-- Update trigger function to handle roles from metadata
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
  default_role TEXT;
  initial_roles TEXT[];
BEGIN
  default_role := COALESCE(NEW.raw_user_meta_data->>'role', 'guru');
  
  -- If roles array is provided in metadata, use it, otherwise use default_role
  IF NEW.raw_user_meta_data->'roles' IS NOT NULL THEN
    -- Convert jsonb array to text array
    SELECT ARRAY_AGG(x)::TEXT[] INTO initial_roles FROM jsonb_array_elements_text(NEW.raw_user_meta_data->'roles') AS x;
  ELSE
    initial_roles := ARRAY[default_role];
  END IF;

  INSERT INTO public.profiles (id, name, role, roles)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'name', NEW.email),
    default_role,
    initial_roles
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
