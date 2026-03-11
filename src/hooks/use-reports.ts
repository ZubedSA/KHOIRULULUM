'use client'

import { useState, useEffect, useCallback } from 'react'
import { createClient } from '@/lib/supabase/client'

export interface MonthlyData {
    month: string
    income: number
    expense: number
}

export interface CategoryBreakdown {
    category: string
    amount: number
    percentage: number
    color: string
}

interface UseReportsReturn {
    monthlyData: MonthlyData[]
    categoryBreakdown: {
        income: CategoryBreakdown[]
        expense: CategoryBreakdown[]
    }
    totalIncome: number
    totalExpense: number
    netIncome: number
    loading: boolean
    error: Error | null
    refetch: () => void
}

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des']
const COLORS = ['bg-emerald-500', 'bg-blue-500', 'bg-violet-500', 'bg-orange-500', 'bg-red-500', 'bg-yellow-500', 'bg-teal-500', 'bg-pink-500']

export function useReports(year: string): UseReportsReturn {
    const [monthlyData, setMonthlyData] = useState<MonthlyData[]>([])
    const [categoryBreakdown, setCategoryBreakdown] = useState<{ income: CategoryBreakdown[], expense: CategoryBreakdown[] }>({ income: [], expense: [] })
    const [totalIncome, setTotalIncome] = useState(0)
    const [totalExpense, setTotalExpense] = useState(0)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<Error | null>(null)

    const fetchReports = useCallback(async () => {
        setLoading(true)
        setError(null)
        const supabase = createClient()

        try {
            const startDate = `${year}-01-01`
            const endDate = `${year}-12-31`

            // Fetch Incomes
            const { data: incomes, error: incomeError } = await supabase
                .from('incomes')
                .select('amount, date, category:categories(name)')
                .gte('date', startDate)
                .lte('date', endDate)

            if (incomeError) throw incomeError

            // Fetch Expenses
            const { data: expenses, error: expenseError } = await supabase
                .from('expenses')
                .select('amount, date, category:categories(name)')
                .gte('date', startDate)
                .lte('date', endDate)

            if (expenseError) throw expenseError

            // ---- Process Monthly Data ----
            const monthlyStats = MONTHS.map((month, index) => {
                const monthNum = index + 1

                // Filter transactions for this month
                const monthIncomes = incomes?.filter((i: { date: string, amount: number | string, category: { name?: string } | null | unknown }) => {
                    const d = new Date(i.date)
                    return d.getMonth() + 1 === monthNum
                }) || []

                const monthExpenses = expenses?.filter((e: { date: string, amount: number | string, category: { name?: string } | null | unknown }) => {
                    const d = new Date(e.date)
                    return d.getMonth() + 1 === monthNum
                }) || []

                const incomeSum = monthIncomes.reduce((sum: number, item: { amount: string | number }) => sum + Number(item.amount), 0)
                const expenseSum = monthExpenses.reduce((sum: number, item: { amount: string | number }) => sum + Number(item.amount), 0)

                return {
                    month,
                    income: incomeSum,
                    expense: expenseSum
                }
            })

            // ---- Process Totals ----
            const totalInc = monthlyStats.reduce((sum, m) => sum + m.income, 0)
            const totalExp = monthlyStats.reduce((sum, m) => sum + m.expense, 0)

            // ---- Process Category Breakdown ----
            const processBreakdown = (data: { category?: { name?: string } | null, amount: number | string }[], total: number) => {
                const map = new Map<string, number>()

                data.forEach(item => {
                    const catName = item.category?.name || 'Uncategorized'
                    const amount = Number(item.amount)
                    map.set(catName, (map.get(catName) || 0) + amount)
                })

                const result: CategoryBreakdown[] = []
                let colorIdx = 0

                map.forEach((amount, category) => {
                    result.push({
                        category,
                        amount,
                        percentage: total > 0 ? parseFloat(((amount / total) * 100).toFixed(1)) : 0,
                        color: COLORS[colorIdx % COLORS.length]
                    })
                    colorIdx++
                })

                return result.sort((a, b) => b.amount - a.amount)
            }

            setMonthlyData(monthlyStats)
            setTotalIncome(totalInc)
            setTotalExpense(totalExp)
            setCategoryBreakdown({
                income: processBreakdown(incomes || [], totalInc),
                expense: processBreakdown(expenses || [], totalExp)
            })

        } catch (err) {
            console.error('Error fetching reports:', err)
            setError(err instanceof Error ? err : new Error('Failed to fetch reports'))
        } finally {
            setLoading(false)
        }
    }, [year])

    useEffect(() => {
        fetchReports()
    }, [fetchReports])

    return {
        monthlyData,
        categoryBreakdown,
        totalIncome,
        totalExpense,
        netIncome: totalIncome - totalExpense,
        loading,
        error,
        refetch: fetchReports
    }
}
