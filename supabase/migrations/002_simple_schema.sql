-- =============================================
-- WEB MADRASAH - SIMPLIFIED SCHEMA
-- =============================================
-- Jalankan script ini di Supabase SQL Editor
-- Script ini aman untuk dijalankan berulang kali

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =============================================
-- TABLE: academic_years
-- =============================================
CREATE TABLE IF NOT EXISTS public.academic_years (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT NOT NULL,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  is_active BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================
-- TABLE: classes
-- =============================================
CREATE TABLE IF NOT EXISTS public.classes (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT NOT NULL,
  grade_level INTEGER NOT NULL,
  academic_year_id UUID REFERENCES public.academic_years(id) ON DELETE SET NULL,
  homeroom_teacher_id UUID,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================
-- TABLE: students
-- =============================================
CREATE TABLE IF NOT EXISTS public.students (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  nis TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  gender TEXT CHECK (gender IN ('L', 'P')),
  birth_date DATE,
  address TEXT,
  phone TEXT,
  parent_name TEXT,
  parent_phone TEXT,
  class_id UUID REFERENCES public.classes(id) ON DELETE SET NULL,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================
-- TABLE: subjects
-- =============================================
CREATE TABLE IF NOT EXISTS public.subjects (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT NOT NULL,
  code TEXT UNIQUE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================
-- TABLE: categories (financial categories)
-- =============================================
CREATE TABLE IF NOT EXISTS public.categories (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT NOT NULL,
  type TEXT CHECK (type IN ('income', 'expense')) NOT NULL,
  description TEXT,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Insert default categories if not exists
INSERT INTO public.categories (name, type, description) 
SELECT 'SPP', 'income', 'Sumbangan Pembinaan Pendidikan bulanan'
WHERE NOT EXISTS (SELECT 1 FROM public.categories WHERE name = 'SPP');

INSERT INTO public.categories (name, type, description) 
SELECT 'Uang Ujian', 'income', 'Biaya ujian semester'
WHERE NOT EXISTS (SELECT 1 FROM public.categories WHERE name = 'Uang Ujian');

INSERT INTO public.categories (name, type, description) 
SELECT 'Donasi', 'income', 'Donasi dari donatur'
WHERE NOT EXISTS (SELECT 1 FROM public.categories WHERE name = 'Donasi');

INSERT INTO public.categories (name, type, description) 
SELECT 'Infaq', 'income', 'Infaq harian/bulanan'
WHERE NOT EXISTS (SELECT 1 FROM public.categories WHERE name = 'Infaq');

INSERT INTO public.categories (name, type, description) 
SELECT 'Gaji Guru', 'expense', 'Gaji tenaga pengajar'
WHERE NOT EXISTS (SELECT 1 FROM public.categories WHERE name = 'Gaji Guru');

INSERT INTO public.categories (name, type, description) 
SELECT 'ATK', 'expense', 'Alat tulis kantor'
WHERE NOT EXISTS (SELECT 1 FROM public.categories WHERE name = 'ATK');

INSERT INTO public.categories (name, type, description) 
SELECT 'Operasional', 'expense', 'Biaya operasional umum'
WHERE NOT EXISTS (SELECT 1 FROM public.categories WHERE name = 'Operasional');

INSERT INTO public.categories (name, type, description) 
SELECT 'Listrik & Air', 'expense', 'Tagihan listrik dan air'
WHERE NOT EXISTS (SELECT 1 FROM public.categories WHERE name = 'Listrik & Air');

-- =============================================
-- TABLE: bills
-- =============================================
CREATE TABLE IF NOT EXISTS public.bills (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  student_id UUID REFERENCES public.students(id) ON DELETE CASCADE NOT NULL,
  class_id UUID REFERENCES public.classes(id) ON DELETE CASCADE NOT NULL,
  category_id UUID REFERENCES public.categories(id) ON DELETE RESTRICT NOT NULL,
  amount DECIMAL(15,2) NOT NULL,
  month INTEGER CHECK (month BETWEEN 1 AND 12) NOT NULL,
  year INTEGER NOT NULL,
  status TEXT CHECK (status IN ('unpaid', 'paid', 'partial')) DEFAULT 'unpaid',
  due_date DATE,
  created_by UUID,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================
-- TABLE: payments
-- =============================================
CREATE TABLE IF NOT EXISTS public.payments (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  bill_id UUID REFERENCES public.bills(id) ON DELETE CASCADE NOT NULL,
  amount DECIMAL(15,2) NOT NULL,
  payment_date DATE NOT NULL,
  payment_method TEXT CHECK (payment_method IN ('cash', 'transfer', 'qris')),
  receipt_number TEXT,
  notes TEXT,
  received_by UUID,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================
-- TABLE: incomes
-- =============================================
CREATE TABLE IF NOT EXISTS public.incomes (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  category_id UUID REFERENCES public.categories(id) ON DELETE RESTRICT NOT NULL,
  amount DECIMAL(15,2) NOT NULL,
  date DATE NOT NULL,
  description TEXT,
  source TEXT,
  recorded_by UUID,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================
-- TABLE: expenses
-- =============================================
CREATE TABLE IF NOT EXISTS public.expenses (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  category_id UUID REFERENCES public.categories(id) ON DELETE RESTRICT NOT NULL,
  amount DECIMAL(15,2) NOT NULL,
  date DATE NOT NULL,
  description TEXT NOT NULL,
  recipient TEXT,
  recorded_by UUID,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================
-- INDEXES
-- =============================================
CREATE INDEX IF NOT EXISTS idx_students_class ON public.students(class_id);
CREATE INDEX IF NOT EXISTS idx_students_nis ON public.students(nis);
CREATE INDEX IF NOT EXISTS idx_bills_student ON public.bills(student_id);
CREATE INDEX IF NOT EXISTS idx_bills_status ON public.bills(status);
CREATE INDEX IF NOT EXISTS idx_bills_month_year ON public.bills(month, year);
CREATE INDEX IF NOT EXISTS idx_payments_date ON public.payments(payment_date);
CREATE INDEX IF NOT EXISTS idx_expenses_date ON public.expenses(date);
CREATE INDEX IF NOT EXISTS idx_incomes_date ON public.incomes(date);

-- =============================================
-- DISABLE RLS FOR SIMPLICITY (enable later if needed)
-- =============================================
ALTER TABLE public.academic_years DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.classes DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.students DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.subjects DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.bills DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.payments DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.incomes DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.expenses DISABLE ROW LEVEL SECURITY;

-- =============================================
-- DONE!
-- =============================================
SELECT 'Schema berhasil dibuat!' as status;
