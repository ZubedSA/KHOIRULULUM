'use client'

import { useState, useEffect, useCallback } from 'react'
import { createClient } from '@/lib/supabase/client'
import type { Category } from '@/types/database'

export interface CreateCategoryInput {
    name: string
    type: 'income' | 'expense'
    description?: string
    is_active?: boolean
}

export interface UpdateCategoryInput {
    name?: string
    description?: string
    is_active?: boolean
}

interface UseCategoriesReturn {
    categories: Category[]
    loading: boolean
    error: Error | null
    refetch: () => void
    addCategory: (data: CreateCategoryInput) => Promise<boolean>
    updateCategory: (id: string, data: UpdateCategoryInput) => Promise<boolean>
    deleteCategory: (id: string) => Promise<boolean>
}

export function useCategories(): UseCategoriesReturn {
    const [categories, setCategories] = useState<Category[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<Error | null>(null)

    const fetchCategories = useCallback(async () => {
        setLoading(true)
        setError(null)
        const supabase = createClient()

        try {
            const { data, error: fetchError } = await supabase
                .from('categories')
                .select('*')
                .order('name')

            if (fetchError) throw fetchError

            if (data) {
                setCategories(data)
            }
        } catch (err) {
            console.error('Error fetching categories:', err)
            setError(err instanceof Error ? err : new Error('Failed to fetch categories'))
        } finally {
            setLoading(false)
        }
    }, [])

    const addCategory = async (data: CreateCategoryInput): Promise<boolean> => {
        const supabase = createClient()
        try {
            const { error: insertError } = await supabase
                .from('categories')
                .insert([data])

            if (insertError) throw insertError

            await fetchCategories()
            return true
        } catch (err) {
            console.error('Error adding category:', err)
            return false
        }
    }

    const updateCategory = async (id: string, data: UpdateCategoryInput): Promise<boolean> => {
        const supabase = createClient()
        try {
            const { error: updateError } = await supabase
                .from('categories')
                .update(data)
                .eq('id', id)

            if (updateError) throw updateError

            await fetchCategories()
            return true
        } catch (err) {
            console.error('Error updating category:', err)
            return false
        }
    }

    const deleteCategory = async (id: string): Promise<boolean> => {
        const supabase = createClient()
        try {
            const { error: deleteError } = await supabase
                .from('categories')
                .delete()
                .eq('id', id)

            if (deleteError) {
                // Handle FK constraint violation specifically if needed
                if (deleteError.code === '23503') {
                    throw new Error('Tidak dapat menghapus kategori yang sudah digunakan dalam transaksi.')
                }
                throw deleteError
            }

            await fetchCategories()
            return true
        } catch (err) {
            console.error('Error deleting category:', err)
            // Re-throw if it's the specific foreign key error so UI can show it
            if (err instanceof Error && err.message.includes('transaksi')) {
                throw err
            }
            return false
        }
    }

    useEffect(() => {
        fetchCategories()
    }, [fetchCategories])

    return {
        categories,
        loading,
        error,
        refetch: fetchCategories,
        addCategory,
        updateCategory,
        deleteCategory
    }
}
