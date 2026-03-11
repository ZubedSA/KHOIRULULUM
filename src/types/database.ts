export type UserRole = 'admin' | 'guru' | 'bendahara'

export interface Profile {
    id: string
    name: string
    email: string
    role: UserRole
    roles: UserRole[]
    avatar_url: string | null
    status?: 'active' | 'inactive'
    created_at: string
    updated_at: string
}

export interface AcademicYear {
    id: string
    name: string
    start_date: string
    end_date: string
    is_active: boolean
    created_at: string
}

export interface Class {
    id: string
    name: string
    grade_level: number
    academic_year_id: string
    homeroom_teacher_id: string | null
    created_at: string
    academic_year?: AcademicYear
    homeroom_teacher?: Profile
}

export interface Student {
    id: string
    nis: string
    name: string
    gender: 'L' | 'P'
    birth_date: string | null
    address: string | null
    phone: string | null
    parent_name: string | null
    parent_phone: string | null
    class_id: string | null
    is_active: boolean
    created_at: string
    updated_at: string
    class?: Class
}

export interface Subject {
    id: string
    name: string
    code: string
    created_at: string
}

export interface Schedule {
    id: string
    class_id: string
    subject_id: string
    teacher_id: string | null
    day_of_week: number
    start_time: string
    end_time: string
    created_at: string
    class?: Class
    subject?: Subject
    teacher?: Profile
}

export interface Attendance {
    id: string
    student_id: string
    class_id: string
    date: string
    status: 'hadir' | 'sakit' | 'izin' | 'alpha'
    notes: string | null
    recorded_by: string | null
    created_at: string
    student?: Student
}

export interface Grade {
    id: string
    student_id: string
    subject_id: string
    class_id: string
    grade_type: 'tugas' | 'uts' | 'uas' | 'praktik'
    score: number
    semester: 1 | 2
    academic_year_id: string | null
    recorded_by: string | null
    created_at: string
    student?: Student
    subject?: Subject
}

export interface Category {
    id: string
    name: string
    type: 'income' | 'expense'
    description: string | null
    is_active: boolean
    created_at: string
}

export interface Bill {
    id: string
    student_id: string
    class_id: string
    category_id: string
    amount: number
    month: number
    year: number
    status: 'unpaid' | 'paid' | 'partial'
    due_date: string | null
    created_by: string | null
    created_at: string
    updated_at: string
    student?: Student
    class?: Class
    category?: Category
}

export interface Payment {
    id: string
    bill_id: string
    amount: number
    payment_date: string
    payment_method: 'cash' | 'transfer' | 'qris'
    receipt_number: string | null
    notes: string | null
    received_by: string | null
    created_at: string
    bill?: Bill
}

export interface Income {
    id: string
    category_id: string
    amount: number
    date: string
    description: string | null
    source: string | null
    recorded_by: string | null
    created_at: string
    category?: Category
}

export interface Expense {
    id: string
    category_id: string
    amount: number
    date: string
    description: string
    recipient: string | null
    recorded_by: string | null
    created_at: string
    category?: Category
}

export interface Settings {
    id: string
    key: string
    value: Record<string, unknown>
    updated_at: string
}

export interface AuditLog {
    id: string
    user_id: string | null
    action: string
    table_name: string
    record_id: string | null
    old_data: Record<string, unknown> | null
    new_data: Record<string, unknown> | null
    created_at: string
    user?: Profile
}
