'use client'

import { useState, useEffect, useCallback } from 'react'
import { createClient } from '@/lib/supabase/client'
import type { Category } from '@/types/database'

interface Transaction {
    id: string
    category_id: string
    amount: number
    date: string
    description: string | null
    source?: string | null  // for incomes
    recipient?: string | null  // for expenses
    created_at: string
    category?: Category
}

interface TransactionFilters {
    categoryId?: string
    search?: string
    startDate?: string
    endDate?: string
}

interface UseTransactionsReturn {
    transactions: Transaction[]
    categories: Category[]
    loading: boolean
    error: Error | null
    refetch: () => void
    createTransaction: (data: Omit<Transaction, 'id' | 'created_at' | 'category'>) => Promise<boolean>
    deleteTransaction: (id: string) => Promise<boolean>
    totalAmount: number
    todayAmount: number
}

export function useTransactions(type: 'income' | 'expense', filters?: TransactionFilters): UseTransactionsReturn {
    const [transactions, setTransactions] = useState<Transaction[]>([])
    const [categories, setCategories] = useState<Category[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<Error | null>(null)

    const tableName = type === 'income' ? 'incomes' : 'expenses'

    const fetchTransactions = useCallback(async () => {
        setLoading(true)
        setError(null)

        const supabase = createClient()

        try {
            // Fetch categories
            const { data: categoriesData } = await supabase
                .from('categories')
                .select('*')
                .eq('type', type)
                .eq('is_active', true)
                .order('name')

            if (categoriesData) {
                setCategories(categoriesData)
            }

            // Build query for transactions
            let query = supabase
                .from(tableName)
                .select(`
                    *,
                    category:categories(*)
                `)
                .order('date', { ascending: false })
                .order('created_at', { ascending: false })

            // Apply filters
            if (filters?.categoryId && filters.categoryId !== 'all') {
                query = query.eq('category_id', filters.categoryId)
            }
            if (filters?.startDate) {
                query = query.gte('date', filters.startDate)
            }
            if (filters?.endDate) {
                query = query.lte('date', filters.endDate)
            }

            const { data, error: fetchError } = await query

            if (fetchError) throw fetchError

            if (data) {
                let filteredData = data as Transaction[]

                // Client-side search filter
                if (filters?.search) {
                    const searchLower = filters.search.toLowerCase()
                    filteredData = filteredData.filter(t =>
                        t.description?.toLowerCase().includes(searchLower) ||
                        t.source?.toLowerCase().includes(searchLower) ||
                        t.recipient?.toLowerCase().includes(searchLower)
                    )
                }

                setTransactions(filteredData)
            }
        } catch (err) {
            console.error(`Error fetching ${type}s:`, err)
            setError(err instanceof Error ? err : new Error(`Failed to fetch ${type}s`))
        } finally {
            setLoading(false)
        }
    }, [tableName, type, filters?.categoryId, filters?.search, filters?.startDate, filters?.endDate])

    const createTransaction = async (data: Omit<Transaction, 'id' | 'created_at' | 'category'>): Promise<boolean> => {
        const supabase = createClient()

        try {
            const { error: insertError } = await supabase
                .from(tableName)
                .insert({
                    category_id: data.category_id,
                    amount: data.amount,
                    date: data.date,
                    description: data.description,
                    ...(type === 'income' ? { source: data.source } : { recipient: data.recipient })
                })

            if (insertError) throw insertError

            await fetchTransactions()
            return true
        } catch (err) {
            console.error(`Error creating ${type}:`, err)
            return false
        }
    }

    const deleteTransaction = async (id: string): Promise<boolean> => {
        const supabase = createClient()

        try {
            const { error: deleteError } = await supabase
                .from(tableName)
                .delete()
                .eq('id', id)

            if (deleteError) throw deleteError

            await fetchTransactions()
            return true
        } catch (err) {
            console.error(`Error deleting ${type}:`, err)
            return false
        }
    }

    useEffect(() => {
        fetchTransactions()
    }, [fetchTransactions])

    // Calculate totals
    const today = new Date().toISOString().split('T')[0]
    const totalAmount = transactions.reduce((sum, t) => sum + Number(t.amount), 0)
    const todayAmount = transactions
        .filter(t => t.date === today)
        .reduce((sum, t) => sum + Number(t.amount), 0)

    return {
        transactions,
        categories,
        loading,
        error,
        refetch: fetchTransactions,
        createTransaction,
        deleteTransaction,
        totalAmount,
        todayAmount
    }
}
