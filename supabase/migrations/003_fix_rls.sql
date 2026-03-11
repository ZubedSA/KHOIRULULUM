-- =============================================
-- FIX ALL RLS ISSUES - COMPREHENSIVE FIX
-- =============================================
-- Jalankan ini di Supabase SQL Editor

-- STEP 1: Disable RLS on all tables (for development)
ALTER TABLE public.academic_years DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.classes DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.students DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.subjects DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.bills DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.payments DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.incomes DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.expenses DISABLE ROW LEVEL SECURITY;

-- STEP 2: Fix profiles RLS (the one causing infinite recursion)
-- Check if profiles table exists first
DO $$ 
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'profiles') THEN
        -- Drop all existing policies
        DROP POLICY IF EXISTS "Admins can manage all profiles" ON public.profiles;
        DROP POLICY IF EXISTS "Profiles viewable by authenticated users" ON public.profiles;
        DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
        DROP POLICY IF EXISTS "allow_select_profiles" ON public.profiles;
        DROP POLICY IF EXISTS "allow_insert_profiles" ON public.profiles;
        DROP POLICY IF EXISTS "allow_update_profiles" ON public.profiles;
        
        -- Disable RLS on profiles
        ALTER TABLE public.profiles DISABLE ROW LEVEL SECURITY;
        
        RAISE NOTICE 'Profiles RLS disabled successfully';
    ELSE
        RAISE NOTICE 'Profiles table does not exist, skipping';
    END IF;
END $$;

SELECT 'All RLS issues fixed!' as status;
