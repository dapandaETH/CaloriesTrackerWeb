'use client'

import { useEffect, useState } from 'react'
import CalorieChart from '@/components/CalorieChart'

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

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Analytics</h1>

      {loading ? (
        <div className="text-center py-8 text-gray-500">Loading...</div>
      ) : data ? (
        <>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white rounded-xl p-4 shadow-sm">
              <p className="text-sm text-gray-500">Daily Average</p>
              <p className="text-2xl font-bold text-gray-900">{data.dailyAverage}</p>
            </div>
            <div className="bg-white rounded-xl p-4 shadow-sm">
              <p className="text-sm text-gray-500">Total Meals</p>
              <p className="text-2xl font-bold text-gray-900">{data.totalMeals}</p>
            </div>
          </div>

          <CalorieChart data={data.dailyTotals} goal={goal} />

          <div className="bg-white rounded-xl p-4 shadow-sm">
            <h3 className="font-semibold text-gray-900 mb-4">Meal Breakdown</h3>
            <div className="space-y-3">
              {['breakfast', 'lunch', 'dinner', 'snack'].map((type) => {
                const total = Object.values(data.mealBreakdown)
                  .reduce((sum, day) => sum + (day[type] || 0), 0)
                return (
                  <div key={type} className="flex justify-between items-center">
                    <span className="capitalize text-gray-700">{type}</span>
                    <span className="font-medium text-gray-900">{total} cal</span>
                  </div>
                )
              })}
            </div>
          </div>
        </>
      ) : (
        <div className="text-center py-8 text-gray-500">
          No data available yet
        </div>
      )}
    </div>
  )
}
