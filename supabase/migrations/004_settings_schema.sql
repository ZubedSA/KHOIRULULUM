-- =============================================
-- 1. SETTINGS SCHEMA
-- =============================================

-- Create table
CREATE TABLE IF NOT EXISTS public.settings (
    key TEXT PRIMARY KEY,
    value JSONB NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    updated_by UUID REFERENCES auth.users(id)
);

-- Enable RLS
ALTER TABLE public.settings ENABLE ROW LEVEL SECURITY;

-- Policies
DROP POLICY IF EXISTS "Allow authenticated read settings" ON public.settings;
CREATE POLICY "Allow authenticated read settings" ON public.settings
    FOR SELECT TO authenticated USING (true);

DROP POLICY IF EXISTS "Allow authenticated update settings" ON public.settings;
CREATE POLICY "Allow authenticated update settings" ON public.settings
    FOR UPDATE TO authenticated USING (true);

DROP POLICY IF EXISTS "Allow authenticated insert settings" ON public.settings;
CREATE POLICY "Allow authenticated insert settings" ON public.settings
    FOR INSERT TO authenticated WITH CHECK (true);

-- Seed Data
INSERT INTO public.settings (key, value) VALUES 
('madrasah', '{"name": "MTs Khairul Ulum", "address": "Jl. Contoh No. 123", "phone": "021-12345678", "email": "info@khairululum.sch.id"}'::jsonb),
('billing', '{"default_spp_amount": 500000, "default_due_day": 10, "late_fee": 25000}'::jsonb),
('notifications', '{"email_notifications": true, "sms_reminders": false, "auto_reminder": true, "reminder_days_before": 3}'::jsonb)
ON CONFLICT (key) DO NOTHING;

SELECT 'Settings schema created successfully' as status;
