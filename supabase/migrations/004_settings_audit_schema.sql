-- =============================================
-- SETTINGS & AUDIT LOG SCHEMA (FIXED IDEMPOTENCY)
-- =============================================
-- Jalankan ini di Supabase SQL Editor

-- 1. SETTINGS TABLE
-- =============================================
CREATE TABLE IF NOT EXISTS public.settings (
    key TEXT PRIMARY KEY,
    value JSONB NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    updated_by UUID REFERENCES auth.users(id)
);

-- Enable RLS
ALTER TABLE public.settings ENABLE ROW LEVEL SECURITY;

-- Policies for settings (Drop first to avoid conflicts)
DROP POLICY IF EXISTS "Allow authenticated read settings" ON public.settings;
CREATE POLICY "Allow authenticated read settings" ON public.settings
    FOR SELECT TO authenticated USING (true);

DROP POLICY IF EXISTS "Allow authenticated update settings" ON public.settings;
CREATE POLICY "Allow authenticated update settings" ON public.settings
    FOR UPDATE TO authenticated USING (true);

DROP POLICY IF EXISTS "Allow authenticated insert settings" ON public.settings;
CREATE POLICY "Allow authenticated insert settings" ON public.settings
    FOR INSERT TO authenticated WITH CHECK (true);


-- 2. AUDIT LOGS TABLE
-- =============================================
CREATE TABLE IF NOT EXISTS public.audit_logs (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    user_id UUID REFERENCES auth.users(id),
    action TEXT NOT NULL,
    table_name TEXT NOT NULL,
    record_id TEXT,
    old_data JSONB,
    new_data JSONB,
    ip_address TEXT,
    user_agent TEXT
);

-- Enable RLS
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

-- Policies for audit logs (Drop first to avoid conflicts)
DROP POLICY IF EXISTS "Allow authenticated read audit_logs" ON public.audit_logs;
CREATE POLICY "Allow authenticated read audit_logs" ON public.audit_logs
    FOR SELECT TO authenticated USING (true);

DROP POLICY IF EXISTS "Allow authenticated insert audit_logs" ON public.audit_logs;
CREATE POLICY "Allow authenticated insert audit_logs" ON public.audit_logs
    FOR INSERT TO authenticated WITH CHECK (true);

-- =============================================
-- SEED DEFAULT SETTINGS
-- =============================================
INSERT INTO public.settings (key, value) VALUES 
('madrasah', '{"name": "MTs Khairul Ulum", "address": "Jl. Contoh No. 123", "phone": "021-12345678", "email": "info@khairululum.sch.id"}'::jsonb),
('billing', '{"default_spp_amount": 500000, "default_due_day": 10, "late_fee": 25000}'::jsonb),
('notifications', '{"email_notifications": true, "sms_reminders": false, "auto_reminder": true, "reminder_days_before": 3}'::jsonb)
ON CONFLICT (key) DO NOTHING;

SELECT 'Settings and Audit Logs schema created successfully!' as status;
