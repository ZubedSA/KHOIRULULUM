'use client'

import { useState, useEffect, useCallback } from 'react'
import { createClient } from '@/lib/supabase/client'
import type { Bill, Student, Category, Class } from '@/types/database'

interface BillWithRelations extends Bill {
    student?: Student
    category?: Category
    class?: Class
}

interface BillFilters {
    classId?: string
    month?: number
    year?: number
    status?: 'unpaid' | 'paid' | 'partial' | 'all'
    search?: string
}

interface UseBillsReturn {
    bills: BillWithRelations[]
    classes: Class[]
    categories: Category[]
    loading: boolean
    error: Error | null
    refetch: () => void
    createPayment: (billId: string, amount: number, method: 'cash' | 'transfer' | 'qris') => Promise<boolean>
}

// Mock data fallback
const mockBills: BillWithRelations[] = [
    {
        id: '1',
        student_id: '1',
        class_id: '1',
        category_id: '1',
        amount: 500000,
        month: 1,
        year: 2026,
        status: 'paid',
        due_date: '2026-01-10',
        created_by: null,
        created_at: '2026-01-01',
        updated_at: '2026-01-10',
        student: { id: '1', nis: '2024001', name: 'Ahmad Fauzi', gender: 'L', birth_date: null, address: null, phone: null, parent_name: null, parent_phone: null, class_id: '1', is_active: true, created_at: '', updated_at: '' },
        category: { id: '1', name: 'SPP', type: 'income', description: null, is_active: true, created_at: '' }
    },
    {
        id: '2',
        student_id: '2',
        class_id: '1',
        category_id: '1',
        amount: 500000,
        month: 1,
        year: 2026,
        status: 'paid',
        due_date: '2026-01-10',
        created_by: null,
        created_at: '2026-01-01',
        updated_at: '2026-01-12',
        student: { id: '2', nis: '2024002', name: 'Fatimah Zahra', gender: 'P', birth_date: null, address: null, phone: null, parent_name: null, parent_phone: null, class_id: '1', is_active: true, created_at: '', updated_at: '' },
        category: { id: '1', name: 'SPP', type: 'income', description: null, is_active: true, created_at: '' }
    },
    {
        id: '3',
        student_id: '3',
        class_id: '2',
        category_id: '1',
        amount: 500000,
        month: 1,
        year: 2026,
        status: 'unpaid',
        due_date: '2026-01-10',
        created_by: null,
        created_at: '2026-01-01',
        updated_at: '2026-01-01',
        student: { id: '3', nis: '2024003', name: 'Muhammad Ali', gender: 'L', birth_date: null, address: null, phone: null, parent_name: null, parent_phone: null, class_id: '2', is_active: true, created_at: '', updated_at: '' },
        category: { id: '1', name: 'SPP', type: 'income', description: null, is_active: true, created_at: '' }
    },
    {
        id: '4',
        student_id: '4',
        class_id: '3',
        category_id: '1',
        amount: 500000,
        month: 1,
        year: 2026,
        status: 'partial',
        due_date: '2026-01-10',
        created_by: null,
        created_at: '2026-01-01',
        updated_at: '2026-01-01',
        student: { id: '4', nis: '2024004', name: 'Aisyah Putri', gender: 'P', birth_date: null, address: null, phone: null, parent_name: null, parent_phone: null, class_id: '3', is_active: true, created_at: '', updated_at: '' },
        category: { id: '1', name: 'SPP', type: 'income', description: null, is_active: true, created_at: '' }
    },
    {
        id: '5',
        student_id: '5',
        class_id: '4',
        category_id: '1',
        amount: 500000,
        month: 1,
        year: 2026,
        status: 'unpaid',
        due_date: '2026-01-10',
        created_by: null,
        created_at: '2026-01-01',
        updated_at: '2026-01-01',
        student: { id: '5', nis: '2024005', name: 'Rizky Pratama', gender: 'L', birth_date: null, address: null, phone: null, parent_name: null, parent_phone: null, class_id: '4', is_active: true, created_at: '', updated_at: '' },
        category: { id: '1', name: 'SPP', type: 'income', description: null, is_active: true, created_at: '' }
    },
]

const mockClasses: Class[] = [
    { id: '1', name: '7A', grade_level: 7, academic_year_id: '1', homeroom_teacher_id: null, created_at: '' },
    { id: '2', name: '7B', grade_level: 7, academic_year_id: '1', homeroom_teacher_id: null, created_at: '' },
    { id: '3', name: '8A', grade_level: 8, academic_year_id: '1', homeroom_teacher_id: null, created_at: '' },
    { id: '4', name: '8B', grade_level: 8, academic_year_id: '1', homeroom_teacher_id: null, created_at: '' },
    { id: '5', name: '9A', grade_level: 9, academic_year_id: '1', homeroom_teacher_id: null, created_at: '' },
    { id: '6', name: '9B', grade_level: 9, academic_year_id: '1', homeroom_teacher_id: null, created_at: '' },
]

const mockCategories: Category[] = [
    { id: '1', name: 'SPP', type: 'income', description: 'Sumbangan Pembinaan Pendidikan', is_active: true, created_at: '' },
    { id: '2', name: 'Uang Makan', type: 'income', description: 'Biaya makan harian', is_active: true, created_at: '' },
    { id: '3', name: 'Kegiatan', type: 'income', description: 'Biaya kegiatan sekolah', is_active: true, created_at: '' },
]

export function useBills(filters?: BillFilters): UseBillsReturn {
    const [bills, setBills] = useState<BillWithRelations[]>([])
    const [classes, setClasses] = useState<Class[]>(mockClasses)
    const [categories, setCategories] = useState<Category[]>(mockCategories)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<Error | null>(null)

    const fetchBills = useCallback(async () => {
        setLoading(true)
        setError(null)

        const supabase = createClient()

        try {
            // Fetch classes and categories in parallel
            const [classesResult, categoriesResult] = await Promise.all([
                supabase.from('classes').select('*').order('grade_level').order('name'),
                supabase.from('categories').select('*').eq('type', 'income').eq('is_active', true)
            ])

            if (classesResult.data && classesResult.data.length > 0) {
                setClasses(classesResult.data)
            }
            if (categoriesResult.data && categoriesResult.data.length > 0) {
                setCategories(categoriesResult.data)
            }

            // Build query for bills
            let query = supabase
                .from('bills')
                .select(`
                    *,
                    student:students(*),
                    category:categories(*),
                    class:classes(*)
                `)
                .order('created_at', { ascending: false })

            // Apply filters
            if (filters?.classId && filters.classId !== 'all') {
                query = query.eq('class_id', filters.classId)
            }
            if (filters?.month) {
                query = query.eq('month', filters.month)
            }
            if (filters?.year) {
                query = query.eq('year', filters.year)
            }
            if (filters?.status && filters.status !== 'all') {
                query = query.eq('status', filters.status)
            }

            const { data, error: billsError } = await query

            if (billsError) throw billsError

            if (data && data.length > 0) {
                // Apply search filter client-side
                let filteredData = data as BillWithRelations[]
                if (filters?.search) {
                    const searchLower = filters.search.toLowerCase()
                    filteredData = filteredData.filter(bill =>
                        bill.student?.name.toLowerCase().includes(searchLower) ||
                        bill.student?.nis.includes(filters.search!)
                    )
                }
                setBills(filteredData)
            } else {
                // Use mock data if no real data
                let filteredMock = [...mockBills]
                if (filters?.search) {
                    const searchLower = filters.search.toLowerCase()
                    filteredMock = filteredMock.filter(bill =>
                        bill.student?.name.toLowerCase().includes(searchLower) ||
                        bill.student?.nis.includes(filters.search!)
                    )
                }
                if (filters?.status && filters.status !== 'all') {
                    filteredMock = filteredMock.filter(bill => bill.status === filters.status)
                }
                setBills(filteredMock)
            }
        } catch (err) {
            console.error('Error fetching bills:', err)
            setError(err instanceof Error ? err : new Error('Failed to fetch bills'))
            // Use mock data on error
            setBills(mockBills)
        } finally {
            setLoading(false)
        }
    }, [filters?.classId, filters?.month, filters?.year, filters?.status, filters?.search])

    const createPayment = async (billId: string, amount: number, method: 'cash' | 'transfer' | 'qris'): Promise<boolean> => {
        const supabase = createClient()

        try {
            const { data: { user } } = await supabase.auth.getUser()

            // Create payment record
            const { error: paymentError } = await supabase
                .from('payments')
                .insert({
                    bill_id: billId,
                    amount,
                    payment_date: new Date().toISOString().split('T')[0],
                    payment_method: method,
                    received_by: user?.id || null
                })

            if (paymentError) throw paymentError

            // Update bill status
            const bill = bills.find(b => b.id === billId)
            if (bill) {
                const newStatus = amount >= bill.amount ? 'paid' : 'partial'
                const { error: updateError } = await supabase
                    .from('bills')
                    .update({
                        status: newStatus,
                        updated_at: new Date().toISOString()
                    })
                    .eq('id', billId)

                if (updateError) throw updateError
            }

            // Refetch bills
            await fetchBills()
            return true
        } catch (err) {
            console.error('Error creating payment:', err)
            return false
        }
    }

    useEffect(() => {
        fetchBills()
    }, [fetchBills])

    return { bills, classes, categories, loading, error, refetch: fetchBills, createPayment }
}
