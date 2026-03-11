-- Seed Academic Years
INSERT INTO public.academic_years (name, start_date, end_date, is_active)
VALUES 
    ('2025/2026', '2025-07-01', '2026-06-30', true),
    ('2024/2025', '2024-07-01', '2025-06-30', false)
ON CONFLICT DO NOTHING;

-- Seed Sample Classes (Optional, but good for demo)
-- Note: We need UUIDs, so we use subqueries or just let user create them
-- Skipping classes seed to avoid FK issues with teachers
