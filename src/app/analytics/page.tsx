'use client'

import { useEffect, useState } from 'react'
import CalorieChart from '@/components/CalorieChart'
import { Card } from '@/components/ui/card'
import { cn } from '@/lib/utils'

interface AnalyticsData {
  dailyTotals: Record<string, number>
  mealBreakdown: Record<string, Record<string, number>>
  dailyAverage: number
  totalMeals: number
}

export default function AnalyticsPage() {
  const [data, setData] = useState<AnalyticsData | null>(null)
  const [loading, setLoading] = useState(true)
  const [goal] = useState(2000)

  useEffect(() => {
    async function fetchAnalytics() {
      const res = await fetch('/api/analytics?days=7')
      const result = await res.json()
      setData(result)
      setLoading(false)
    }
    fetchAnalytics()
  }, [])

  const mealTypes = ['breakfast', 'lunch', 'dinner', 'snack'] as const
  const mealIcons = { breakfast: '🌅', lunch: '☀️', dinner: '🌙', snack: '🍎' }

  return (
    <div className="space-y-6">
      <div className="animate-fade-up">
        <h1 className="text-2xl font-bold tracking-tight">Insights</h1>
        <p className="text-muted-foreground mt-1">Your nutrition analytics</p>
      </div>

      {loading ? (
        <Card className="p-8">
          <div className="flex flex-col items-center justify-center text-muted-foreground">
            <div className="size-8 rounded-full border-2 border-primary/30 border-t-primary animate-spin" />
            <p className="mt-3 text-sm">Loading analytics...</p>
          </div>
        </Card>
      ) : data ? (
        <>
          <div className="grid grid-cols-2 gap-4 animate-fade-up-delay-1">
            <Card className="p-4">
              <p className="text-sm text-muted-foreground">Daily Average</p>
              <p className="text-2xl font-bold mt-1 gemini-gradient-text">{data.dailyAverage}</p>
              <p className="text-xs text-muted-foreground mt-0.5">calories</p>
            </Card>
            <Card className="p-4">
              <p className="text-sm text-muted-foreground">Total Meals</p>
              <p className="text-2xl font-bold mt-1 text-primary">{data.totalMeals}</p>
              <p className="text-xs text-muted-foreground mt-0.5">this week</p>
            </Card>
          </div>

          <div className="animate-fade-up-delay-2">
            <CalorieChart data={data.dailyTotals} goal={goal} />
          </div>

          <Card className="p-6 animate-fade-up-delay-3">
            <h3 className="font-semibold mb-4">Meal Breakdown</h3>
            <div className="space-y-3">
              {mealTypes.map((type) => {
                const total = Object.values(data.mealBreakdown)
                  .reduce((sum, day) => sum + (day[type] || 0), 0)
                const percentage = data.totalMeals > 0
                  ? Math.round((Object.values(data.mealBreakdown).filter(d => d[type]).length / 7) * 100)
                  : 0
                
                return (
                  <div key={type} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="text-lg">{mealIcons[type]}</span>
                      <div>
                        <p className="font-medium capitalize">{type}</p>
                        <p className="text-xs text-muted-foreground">{percentage}% of days</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold">{total.toLocaleString()}</p>
                      <p className="text-xs text-muted-foreground">cal</p>
                    </div>
                  </div>
                )
              })}
            </div>
          </Card>
        </>
      ) : (
        <Card className="p-8 animate-fade-up-delay-1">
          <div className="text-center">
            <div className="size-16 mx-auto mb-4 rounded-2xl bg-primary/10 flex items-center justify-center">
              <span className="text-3xl">📊</span>
            </div>
            <p className="text-foreground font-medium">No data available yet</p>
            <p className="text-sm text-muted-foreground mt-1">Start logging meals to see insights</p>
          </div>
        </Card>
      )}
    </div>
  )
}