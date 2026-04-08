'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import { Meal } from '@/types'
import CalorieProgress from '@/components/CalorieProgress'
import MealCard from '@/components/MealCard'

export default function Dashboard() {
  const [meals, setMeals] = useState<Meal[]>([])
  const [loading, setLoading] = useState(true)
  const [dailyGoal] = useState(2000)

  useEffect(() => {
    async function fetchMeals() {
      const today = new Date()
      today.setHours(0, 0, 0, 0)
      
      const { data } = await supabase
        .from('meals')
        .select('*')
        .gte('consumed_at', today.toISOString())
        .order('consumed_at', { ascending: false })
      
      if (data) setMeals(data)
      setLoading(false)
    }
    fetchMeals()
  }, [])

  const totalCalories = meals.reduce(
    (sum, m) => sum + (m.actual_calories ?? m.estimated_calories),
    0
  )

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
      
      <CalorieProgress current={totalCalories} goal={dailyGoal} />
      
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold text-gray-900">Today's Meals</h2>
        <Link
          href="/camera"
          className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium"
        >
          + Add Meal
        </Link>
      </div>

      {loading ? (
        <div className="text-center py-8 text-gray-500">Loading...</div>
      ) : meals.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          <p>No meals logged today</p>
          <p className="text-sm mt-1">Tap the button above to add your first meal</p>
        </div>
      ) : (
        <div className="space-y-3">
          {meals.map((meal) => (
            <MealCard key={meal.id} meal={meal} />
          ))}
        </div>
      )}
    </div>
  )
}
