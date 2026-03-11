-- ============================================
-- SAMPLE DATA UNTUK WEB MADRASAH KHAIRUL ULUM
-- ============================================
-- Jalankan SETELAH 001_initial_schema.sql berhasil dijalankan

-- ============================================
-- 1. TAHUN AJARAN AKTIF
-- ============================================
INSERT INTO academic_years (name, start_date, end_date, is_active) VALUES
  ('2025/2026', '2025-07-01', '2026-06-30', true)
ON CONFLICT DO NOTHING;

-- ============================================
-- 2. KELAS
-- ============================================
INSERT INTO classes (name, grade_level, academic_year_id)
SELECT '7A', 7, id FROM academic_years WHERE is_active = true
ON CONFLICT DO NOTHING;

INSERT INTO classes (name, grade_level, academic_year_id)
SELECT '7B', 7, id FROM academic_years WHERE is_active = true
ON CONFLICT DO NOTHING;

INSERT INTO classes (name, grade_level, academic_year_id)
SELECT '8A', 8, id FROM academic_years WHERE is_active = true
ON CONFLICT DO NOTHING;

INSERT INTO classes (name, grade_level, academic_year_id)
SELECT '8B', 8, id FROM academic_years WHERE is_active = true
ON CONFLICT DO NOTHING;

INSERT INTO classes (name, grade_level, academic_year_id)
SELECT '9A', 9, id FROM academic_years WHERE is_active = true
ON CONFLICT DO NOTHING;

INSERT INTO classes (name, grade_level, academic_year_id)
SELECT '9B', 9, id FROM academic_years WHERE is_active = true
ON CONFLICT DO NOTHING;

-- ============================================
-- 3. MATA PELAJARAN
-- ============================================
INSERT INTO subjects (name, code) VALUES
  ('Al-Quran', 'QUR'),
  ('Hadits', 'HDT'),
  ('Fiqih', 'FQH'),
  ('Aqidah Akhlak', 'AQD'),
  ('Bahasa Arab', 'ARB'),
  ('Matematika', 'MTK'),
  ('Bahasa Indonesia', 'IND'),
  ('Bahasa Inggris', 'ENG'),
  ('IPA', 'IPA'),
  ('IPS', 'IPS')
ON CONFLICT (code) DO NOTHING;

-- ============================================
-- 4. SISWA (72 santri)
-- ============================================

-- Kelas 7A
INSERT INTO students (nis, name, gender, birth_date, class_id, is_active)
SELECT '2024001', 'Ahmad Fauzi', 'L', '2012-03-15', id, true FROM classes WHERE name = '7A'
ON CONFLICT (nis) DO NOTHING;

INSERT INTO students (nis, name, gender, birth_date, class_id, is_active)
SELECT '2024002', 'Fatimah Azzahra', 'P', '2012-05-20', id, true FROM classes WHERE name = '7A'
ON CONFLICT (nis) DO NOTHING;

INSERT INTO students (nis, name, gender, birth_date, class_id, is_active)
SELECT '2024003', 'Muhammad Rizki', 'L', '2012-01-10', id, true FROM classes WHERE name = '7A'
ON CONFLICT (nis) DO NOTHING;

INSERT INTO students (nis, name, gender, birth_date, class_id, is_active)
SELECT '2024004', 'Aisyah Putri', 'P', '2012-07-25', id, true FROM classes WHERE name = '7A'
ON CONFLICT (nis) DO NOTHING;

INSERT INTO students (nis, name, gender, birth_date, class_id, is_active)
SELECT '2024005', 'Abdul Rahman', 'L', '2012-09-30', id, true FROM classes WHERE name = '7A'
ON CONFLICT (nis) DO NOTHING;

INSERT INTO students (nis, name, gender, birth_date, class_id, is_active)
SELECT '2024006', 'Khadijah Sari', 'P', '2012-02-14', id, true FROM classes WHERE name = '7A'
ON CONFLICT (nis) DO NOTHING;

INSERT INTO students (nis, name, gender, birth_date, class_id, is_active)
SELECT '2024007', 'Umar Hakim', 'L', '2012-11-08', id, true FROM classes WHERE name = '7A'
ON CONFLICT (nis) DO NOTHING;

INSERT INTO students (nis, name, gender, birth_date, class_id, is_active)
SELECT '2024008', 'Zainab Dewi', 'P', '2012-04-22', id, true FROM classes WHERE name = '7A'
ON CONFLICT (nis) DO NOTHING;

INSERT INTO students (nis, name, gender, birth_date, class_id, is_active)
SELECT '2024009', 'Ibrahim Kamil', 'L', '2012-06-17', id, true FROM classes WHERE name = '7A'
ON CONFLICT (nis) DO NOTHING;

INSERT INTO students (nis, name, gender, birth_date, class_id, is_active)
SELECT '2024010', 'Hafizah Nur', 'P', '2012-08-03', id, true FROM classes WHERE name = '7A'
ON CONFLICT (nis) DO NOTHING;

INSERT INTO students (nis, name, gender, birth_date, class_id, is_active)
SELECT '2024011', 'Salman Alfarisi', 'L', '2012-12-28', id, true FROM classes WHERE name = '7A'
ON CONFLICT (nis) DO NOTHING;

INSERT INTO students (nis, name, gender, birth_date, class_id, is_active)
SELECT '2024012', 'Maryam Indah', 'P', '2012-10-12', id, true FROM classes WHERE name = '7A'
ON CONFLICT (nis) DO NOTHING;

-- Kelas 7B
INSERT INTO students (nis, name, gender, birth_date, class_id, is_active)
SELECT '2024013', 'Yusuf Hidayat', 'L', '2012-01-05', id, true FROM classes WHERE name = '7B'
ON CONFLICT (nis) DO NOTHING;

INSERT INTO students (nis, name, gender, birth_date, class_id, is_active)
SELECT '2024014', 'Ruqayah Siti', 'P', '2012-03-18', id, true FROM classes WHERE name = '7B'
ON CONFLICT (nis) DO NOTHING;

INSERT INTO students (nis, name, gender, birth_date, class_id, is_active)
SELECT '2024015', 'Hamzah Prasetyo', 'L', '2012-05-22', id, true FROM classes WHERE name = '7B'
ON CONFLICT (nis) DO NOTHING;

INSERT INTO students (nis, name, gender, birth_date, class_id, is_active)
SELECT '2024016', 'Asma Lestari', 'P', '2012-07-30', id, true FROM classes WHERE name = '7B'
ON CONFLICT (nis) DO NOTHING;

INSERT INTO students (nis, name, gender, birth_date, class_id, is_active)
SELECT '2024017', 'Bilal Akbar', 'L', '2012-09-14', id, true FROM classes WHERE name = '7B'
ON CONFLICT (nis) DO NOTHING;

INSERT INTO students (nis, name, gender, birth_date, class_id, is_active)
SELECT '2024018', 'Safiyah Wati', 'P', '2012-11-25', id, true FROM classes WHERE name = '7B'
ON CONFLICT (nis) DO NOTHING;

INSERT INTO students (nis, name, gender, birth_date, class_id, is_active)
SELECT '2024019', 'Zaid Maulana', 'L', '2012-02-08', id, true FROM classes WHERE name = '7B'
ON CONFLICT (nis) DO NOTHING;

INSERT INTO students (nis, name, gender, birth_date, class_id, is_active)
SELECT '2024020', 'Aminah Rahman', 'P', '2012-04-12', id, true FROM classes WHERE name = '7B'
ON CONFLICT (nis) DO NOTHING;

INSERT INTO students (nis, name, gender, birth_date, class_id, is_active)
SELECT '2024021', 'Khalid Ikhsan', 'L', '2012-06-28', id, true FROM classes WHERE name = '7B'
ON CONFLICT (nis) DO NOTHING;

INSERT INTO students (nis, name, gender, birth_date, class_id, is_active)
SELECT '2024022', 'Halimah Sari', 'P', '2012-08-15', id, true FROM classes WHERE name = '7B'
ON CONFLICT (nis) DO NOTHING;

INSERT INTO students (nis, name, gender, birth_date, class_id, is_active)
SELECT '2024023', 'Muawiyah Dani', 'L', '2012-10-03', id, true FROM classes WHERE name = '7B'
ON CONFLICT (nis) DO NOTHING;

INSERT INTO students (nis, name, gender, birth_date, class_id, is_active)
SELECT '2024024', 'Sumayyah Tri', 'P', '2012-12-20', id, true FROM classes WHERE name = '7B'
ON CONFLICT (nis) DO NOTHING;

-- Kelas 8A
INSERT INTO students (nis, name, gender, birth_date, class_id, is_active)
SELECT '2023001', 'Hasan Basri', 'L', '2011-01-15', id, true FROM classes WHERE name = '8A'
ON CONFLICT (nis) DO NOTHING;

INSERT INTO students (nis, name, gender, birth_date, class_id, is_active)
SELECT '2023002', 'Husna Amelia', 'P', '2011-03-20', id, true FROM classes WHERE name = '8A'
ON CONFLICT (nis) DO NOTHING;

INSERT INTO students (nis, name, gender, birth_date, class_id, is_active)
SELECT '2023003', 'Imran Habibi', 'L', '2011-05-25', id, true FROM classes WHERE name = '8A'
ON CONFLICT (nis) DO NOTHING;

INSERT INTO students (nis, name, gender, birth_date, class_id, is_active)
SELECT '2023004', 'Jamilah Putri', 'P', '2011-07-10', id, true FROM classes WHERE name = '8A'
ON CONFLICT (nis) DO NOTHING;

INSERT INTO students (nis, name, gender, birth_date, class_id, is_active)
SELECT '2023005', 'Khairul Anam', 'L', '2011-09-05', id, true FROM classes WHERE name = '8A'
ON CONFLICT (nis) DO NOTHING;

INSERT INTO students (nis, name, gender, birth_date, class_id, is_active)
SELECT '2023006', 'Laila Majnun', 'P', '2011-11-18', id, true FROM classes WHERE name = '8A'
ON CONFLICT (nis) DO NOTHING;

INSERT INTO students (nis, name, gender, birth_date, class_id, is_active)
SELECT '2023007', 'Malik Ibrahim', 'L', '2011-02-22', id, true FROM classes WHERE name = '8A'
ON CONFLICT (nis) DO NOTHING;

INSERT INTO students (nis, name, gender, birth_date, class_id, is_active)
SELECT '2023008', 'Nabila Syifa', 'P', '2011-04-28', id, true FROM classes WHERE name = '8A'
ON CONFLICT (nis) DO NOTHING;

INSERT INTO students (nis, name, gender, birth_date, class_id, is_active)
SELECT '2023009', 'Omar Faruq', 'L', '2011-06-15', id, true FROM classes WHERE name = '8A'
ON CONFLICT (nis) DO NOTHING;

INSERT INTO students (nis, name, gender, birth_date, class_id, is_active)
SELECT '2023010', 'Putri Aisyah', 'P', '2011-08-30', id, true FROM classes WHERE name = '8A'
ON CONFLICT (nis) DO NOTHING;

INSERT INTO students (nis, name, gender, birth_date, class_id, is_active)
SELECT '2023011', 'Qasim Rasyid', 'L', '2011-10-12', id, true FROM classes WHERE name = '8A'
ON CONFLICT (nis) DO NOTHING;

INSERT INTO students (nis, name, gender, birth_date, class_id, is_active)
SELECT '2023012', 'Rahma Dewi', 'P', '2011-12-05', id, true FROM classes WHERE name = '8A'
ON CONFLICT (nis) DO NOTHING;

-- Kelas 8B
INSERT INTO students (nis, name, gender, birth_date, class_id, is_active)
SELECT '2023013', 'Said Abdullah', 'L', '2011-01-08', id, true FROM classes WHERE name = '8B'
ON CONFLICT (nis) DO NOTHING;

INSERT INTO students (nis, name, gender, birth_date, class_id, is_active)
SELECT '2023014', 'Taqiya Nurul', 'P', '2011-03-25', id, true FROM classes WHERE name = '8B'
ON CONFLICT (nis) DO NOTHING;

INSERT INTO students (nis, name, gender, birth_date, class_id, is_active)
SELECT '2023015', 'Ubaidillah Hasan', 'L', '2011-05-18', id, true FROM classes WHERE name = '8B'
ON CONFLICT (nis) DO NOTHING;

INSERT INTO students (nis, name, gender, birth_date, class_id, is_active)
SELECT '2023016', 'Vina Azzahra', 'P', '2011-07-22', id, true FROM classes WHERE name = '8B'
ON CONFLICT (nis) DO NOTHING;

INSERT INTO students (nis, name, gender, birth_date, class_id, is_active)
SELECT '2023017', 'Wahid Firmansyah', 'L', '2011-09-30', id, true FROM classes WHERE name = '8B'
ON CONFLICT (nis) DO NOTHING;

INSERT INTO students (nis, name, gender, birth_date, class_id, is_active)
SELECT '2023018', 'Ximena Salwa', 'P', '2011-11-12', id, true FROM classes WHERE name = '8B'
ON CONFLICT (nis) DO NOTHING;

INSERT INTO students (nis, name, gender, birth_date, class_id, is_active)
SELECT '2023019', 'Yasir Muttaqin', 'L', '2011-02-28', id, true FROM classes WHERE name = '8B'
ON CONFLICT (nis) DO NOTHING;

INSERT INTO students (nis, name, gender, birth_date, class_id, is_active)
SELECT '2023020', 'Zahra Kamila', 'P', '2011-04-15', id, true FROM classes WHERE name = '8B'
ON CONFLICT (nis) DO NOTHING;

INSERT INTO students (nis, name, gender, birth_date, class_id, is_active)
SELECT '2023021', 'Abidin Jauhari', 'L', '2011-06-08', id, true FROM classes WHERE name = '8B'
ON CONFLICT (nis) DO NOTHING;

INSERT INTO students (nis, name, gender, birth_date, class_id, is_active)
SELECT '2023022', 'Bushra Amira', 'P', '2011-08-20', id, true FROM classes WHERE name = '8B'
ON CONFLICT (nis) DO NOTHING;

INSERT INTO students (nis, name, gender, birth_date, class_id, is_active)
SELECT '2023023', 'Cahyo Wibowo', 'L', '2011-10-25', id, true FROM classes WHERE name = '8B'
ON CONFLICT (nis) DO NOTHING;

INSERT INTO students (nis, name, gender, birth_date, class_id, is_active)
SELECT '2023024', 'Dina Safitri', 'P', '2011-12-18', id, true FROM classes WHERE name = '8B'
ON CONFLICT (nis) DO NOTHING;

-- Kelas 9A
INSERT INTO students (nis, name, gender, birth_date, class_id, is_active)
SELECT '2022001', 'Elang Pradipta', 'L', '2010-01-20', id, true FROM classes WHERE name = '9A'
ON CONFLICT (nis) DO NOTHING;

INSERT INTO students (nis, name, gender, birth_date, class_id, is_active)
SELECT '2022002', 'Farah Nabila', 'P', '2010-03-15', id, true FROM classes WHERE name = '9A'
ON CONFLICT (nis) DO NOTHING;

INSERT INTO students (nis, name, gender, birth_date, class_id, is_active)
SELECT '2022003', 'Ghani Zakaria', 'L', '2010-05-10', id, true FROM classes WHERE name = '9A'
ON CONFLICT (nis) DO NOTHING;

INSERT INTO students (nis, name, gender, birth_date, class_id, is_active)
SELECT '2022004', 'Hanifa Rahmawati', 'P', '2010-07-28', id, true FROM classes WHERE name = '9A'
ON CONFLICT (nis) DO NOTHING;

INSERT INTO students (nis, name, gender, birth_date, class_id, is_active)
SELECT '2022005', 'Iqbal Ramadhan', 'L', '2010-09-22', id, true FROM classes WHERE name = '9A'
ON CONFLICT (nis) DO NOTHING;

INSERT INTO students (nis, name, gender, birth_date, class_id, is_active)
SELECT '2022006', 'Jasmine Ayu', 'P', '2010-11-08', id, true FROM classes WHERE name = '9A'
ON CONFLICT (nis) DO NOTHING;

INSERT INTO students (nis, name, gender, birth_date, class_id, is_active)
SELECT '2022007', 'Kamal Hamdani', 'L', '2010-02-14', id, true FROM classes WHERE name = '9A'
ON CONFLICT (nis) DO NOTHING;

INSERT INTO students (nis, name, gender, birth_date, class_id, is_active)
SELECT '2022008', 'Latifa Zulfa', 'P', '2010-04-25', id, true FROM classes WHERE name = '9A'
ON CONFLICT (nis) DO NOTHING;

INSERT INTO students (nis, name, gender, birth_date, class_id, is_active)
SELECT '2022009', 'Mujahid Ilham', 'L', '2010-06-18', id, true FROM classes WHERE name = '9A'
ON CONFLICT (nis) DO NOTHING;

INSERT INTO students (nis, name, gender, birth_date, class_id, is_active)
SELECT '2022010', 'Naila Husna', 'P', '2010-08-12', id, true FROM classes WHERE name = '9A'
ON CONFLICT (nis) DO NOTHING;

INSERT INTO students (nis, name, gender, birth_date, class_id, is_active)
SELECT '2022011', 'Osman Harun', 'L', '2010-10-30', id, true FROM classes WHERE name = '9A'
ON CONFLICT (nis) DO NOTHING;

INSERT INTO students (nis, name, gender, birth_date, class_id, is_active)
SELECT '2022012', 'Puspita Sari', 'P', '2010-12-22', id, true FROM classes WHERE name = '9A'
ON CONFLICT (nis) DO NOTHING;

-- Kelas 9B  
INSERT INTO students (nis, name, gender, birth_date, class_id, is_active)
SELECT '2022013', 'Qodri Hafidzh', 'L', '2010-01-28', id, true FROM classes WHERE name = '9B'
ON CONFLICT (nis) DO NOTHING;

INSERT INTO students (nis, name, gender, birth_date, class_id, is_active)
SELECT '2022014', 'Raisya Khalishah', 'P', '2010-03-08', id, true FROM classes WHERE name = '9B'
ON CONFLICT (nis) DO NOTHING;

INSERT INTO students (nis, name, gender, birth_date, class_id, is_active)
SELECT '2022015', 'Syahrul Gunawan', 'L', '2010-05-22', id, true FROM classes WHERE name = '9B'
ON CONFLICT (nis) DO NOTHING;

INSERT INTO students (nis, name, gender, birth_date, class_id, is_active)
SELECT '2022016', 'Tasya Maulida', 'P', '2010-07-15', id, true FROM classes WHERE name = '9B'
ON CONFLICT (nis) DO NOTHING;

INSERT INTO students (nis, name, gender, birth_date, class_id, is_active)
SELECT '2022017', 'Ubaydah Ahmad', 'L', '2010-09-10', id, true FROM classes WHERE name = '9B'
ON CONFLICT (nis) DO NOTHING;

INSERT INTO students (nis, name, gender, birth_date, class_id, is_active)
SELECT '2022018', 'Vira Anggraini', 'P', '2010-11-25', id, true FROM classes WHERE name = '9B'
ON CONFLICT (nis) DO NOTHING;

INSERT INTO students (nis, name, gender, birth_date, class_id, is_active)
SELECT '2022019', 'Wildan Hakim', 'L', '2010-02-05', id, true FROM classes WHERE name = '9B'
ON CONFLICT (nis) DO NOTHING;

INSERT INTO students (nis, name, gender, birth_date, class_id, is_active)
SELECT '2022020', 'Xena Rahmadani', 'P', '2010-04-18', id, true FROM classes WHERE name = '9B'
ON CONFLICT (nis) DO NOTHING;

INSERT INTO students (nis, name, gender, birth_date, class_id, is_active)
SELECT '2022021', 'Yudha Pratama', 'L', '2010-06-28', id, true FROM classes WHERE name = '9B'
ON CONFLICT (nis) DO NOTHING;

INSERT INTO students (nis, name, gender, birth_date, class_id, is_active)
SELECT '2022022', 'Zalfa Maulidia', 'P', '2010-08-22', id, true FROM classes WHERE name = '9B'
ON CONFLICT (nis) DO NOTHING;

INSERT INTO students (nis, name, gender, birth_date, class_id, is_active)
SELECT '2022023', 'Arkan Firdaus', 'L', '2010-10-15', id, true FROM classes WHERE name = '9B'
ON CONFLICT (nis) DO NOTHING;

INSERT INTO students (nis, name, gender, birth_date, class_id, is_active)
SELECT '2022024', 'Bella Safira', 'P', '2010-12-08', id, true FROM classes WHERE name = '9B'
ON CONFLICT (nis) DO NOTHING;

-- ============================================
-- 5. TAGIHAN SPP BULAN JANUARI 2026
-- ============================================
INSERT INTO bills (student_id, class_id, category_id, amount, month, year, status, due_date)
SELECT s.id, s.class_id, c.id, 500000, 1, 2026, 'paid', '2026-01-10'
FROM students s
CROSS JOIN categories c
WHERE s.nis = '2024001' AND c.name = 'SPP'
ON CONFLICT DO NOTHING;

INSERT INTO bills (student_id, class_id, category_id, amount, month, year, status, due_date)
SELECT s.id, s.class_id, c.id, 500000, 1, 2026, 'paid', '2026-01-10'
FROM students s
CROSS JOIN categories c
WHERE s.nis = '2024002' AND c.name = 'SPP'
ON CONFLICT DO NOTHING;

INSERT INTO bills (student_id, class_id, category_id, amount, month, year, status, due_date)
SELECT s.id, s.class_id, c.id, 500000, 1, 2026, 'unpaid', '2026-01-10'
FROM students s
CROSS JOIN categories c
WHERE s.nis = '2024003' AND c.name = 'SPP'
ON CONFLICT DO NOTHING;

INSERT INTO bills (student_id, class_id, category_id, amount, month, year, status, due_date)
SELECT s.id, s.class_id, c.id, 500000, 1, 2026, 'partial', '2026-01-10'
FROM students s
CROSS JOIN categories c
WHERE s.nis = '2024004' AND c.name = 'SPP'
ON CONFLICT DO NOTHING;

INSERT INTO bills (student_id, class_id, category_id, amount, month, year, status, due_date)
SELECT s.id, s.class_id, c.id, 500000, 1, 2026, 'unpaid', '2026-01-10'
FROM students s
CROSS JOIN categories c
WHERE s.nis = '2024005' AND c.name = 'SPP'
ON CONFLICT DO NOTHING;

INSERT INTO bills (student_id, class_id, category_id, amount, month, year, status, due_date)
SELECT s.id, s.class_id, c.id, 500000, 1, 2026, 'paid', '2026-01-10'
FROM students s
CROSS JOIN categories c
WHERE s.nis = '2023001' AND c.name = 'SPP'
ON CONFLICT DO NOTHING;

INSERT INTO bills (student_id, class_id, category_id, amount, month, year, status, due_date)
SELECT s.id, s.class_id, c.id, 500000, 1, 2026, 'unpaid', '2026-01-10'
FROM students s
CROSS JOIN categories c
WHERE s.nis = '2022001' AND c.name = 'SPP'
ON CONFLICT DO NOTHING;

-- ============================================
-- 6. PEMASUKAN (INCOMES) BULAN INI
-- ============================================
INSERT INTO incomes (category_id, amount, date, description, source)
SELECT id, 25000000, '2026-01-15', 'Pembayaran SPP Januari 2026', 'SPP Siswa'
FROM categories WHERE name = 'SPP'
ON CONFLICT DO NOTHING;

INSERT INTO incomes (category_id, amount, date, description, source)
SELECT id, 10000000, '2026-01-10', 'Donasi Bapak H. Ahmad', 'Donatur Eksternal'
FROM categories WHERE name = 'Donasi'
ON CONFLICT DO NOTHING;

INSERT INTO incomes (category_id, amount, date, description, source)
SELECT id, 5000000, '2026-01-12', 'Infaq bulanan siswa', 'Infaq Rutin'
FROM categories WHERE name = 'Infaq'
ON CONFLICT DO NOTHING;

-- ============================================
-- 7. PENGELUARAN (EXPENSES) BULAN INI
-- ============================================
INSERT INTO expenses (category_id, amount, date, description, recipient)
SELECT id, 35000000, '2026-01-05', 'Gaji guru bulan Januari 2026', 'Staff Pengajar'
FROM categories WHERE name = 'Gaji Guru'
ON CONFLICT DO NOTHING;

INSERT INTO expenses (category_id, amount, date, description, recipient)
SELECT id, 3000000, '2026-01-10', 'Tagihan listrik dan air Desember', 'PLN & PDAM'
FROM categories WHERE name = 'Listrik & Air'
ON CONFLICT DO NOTHING;

INSERT INTO expenses (category_id, amount, date, description, recipient)
SELECT id, 750000, '2026-01-08', 'Pembelian ATK kantor', 'Toko ATK'
FROM categories WHERE name = 'ATK'
ON CONFLICT DO NOTHING;

INSERT INTO expenses (category_id, amount, date, description, recipient)
SELECT id, 2000000, '2026-01-12', 'Biaya operasional umum', 'Berbagai vendor'
FROM categories WHERE name = 'Operasional'
ON CONFLICT DO NOTHING;

-- ============================================
-- VERIFIKASI DATA
-- ============================================
SELECT 'academic_years' as tabel, COUNT(*) as jumlah FROM academic_years
UNION ALL SELECT 'classes', COUNT(*) FROM classes
UNION ALL SELECT 'subjects', COUNT(*) FROM subjects
UNION ALL SELECT 'students', COUNT(*) FROM students
UNION ALL SELECT 'categories', COUNT(*) FROM categories
UNION ALL SELECT 'bills', COUNT(*) FROM bills
UNION ALL SELECT 'incomes', COUNT(*) FROM incomes
UNION ALL SELECT 'expenses', COUNT(*) FROM expenses;
