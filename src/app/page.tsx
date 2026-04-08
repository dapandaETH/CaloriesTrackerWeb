'use client'

import { useEffect, useState, useCallback } from 'react'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import { Meal } from '@/types'
import CalorieProgress from '@/components/CalorieProgress'
import MealCard from '@/components/MealCard'
import EditMealModal from '@/components/EditMealModal'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Plus } from 'lucide-react'

export default function Dashboard() {
  const [meals, setMeals] = useState<Meal[]>([])
  const [loading, setLoading] = useState(true)
  const [dailyGoal] = useState(2000)
  const [editingMeal, setEditingMeal] = useState<Meal | null>(null)

  const fetchMeals = useCallback(async () => {
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    
    const { data } = await supabase
      .from('meals')
      .select('*')
      .gte('consumed_at', today.toISOString())
      .order('consumed_at', { ascending: false })
    
    if (data) setMeals(data)
    setLoading(false)
  }, [])

  useEffect(() => {
    fetchMeals()
  }, [fetchMeals])

  useEffect(() => {
    const handleFocus = () => fetchMeals()
    window.addEventListener('focus', handleFocus)
    return () => window.removeEventListener('focus', handleFocus)
  }, [fetchMeals])

  const handleDelete = async (id: string) => {
    const res = await fetch(`/api/meals/${id}`, { method: 'DELETE' })
    if (res.ok) {
      setMeals((prev) => prev.filter((m) => m.id !== id))
    } else {
      alert('Failed to delete meal')
    }
  }

  const handleEditSave = (updated: Meal) => {
    setMeals((prev) => prev.map((m) => m.id === updated.id ? updated : m))
    setEditingMeal(null)
  }

  const totalCalories = meals.reduce(
    (sum, m) => sum + (m.actual_calories ?? m.estimated_calories),
    0
  )

  return (
    <div className="space-y-6">
      <div className="animate-fade-up">
        <h1 className="text-2xl font-bold tracking-tight">Good {getGreeting()}</h1>
        <p className="text-muted-foreground mt-1">Track your nutrition journey</p>
      </div>
      
      <div className="animate-fade-up-delay-1">
        <CalorieProgress current={totalCalories} goal={dailyGoal} />
      </div>
      
      <div className="flex items-center justify-between animate-fade-up-delay-2">
        <h2 className="text-lg font-semibold">Today's Meals</h2>
        <Link href="/camera">
          <Button size="sm" className="gap-1.5">
            <Plus className="size-4" />
            Add
          </Button>
        </Link>
      </div>

      {loading ? (
        <Card className="p-8">
          <div className="flex flex-col items-center justify-center text-muted-foreground">
            <div className="size-8 rounded-full border-2 border-primary/30 border-t-primary animate-spin" />
            <p className="mt-3 text-sm">Loading meals...</p>
          </div>
        </Card>
      ) : meals.length === 0 ? (
        <Card className="p-8 animate-fade-up-delay-3">
          <div className="text-center">
            <div className="size-16 mx-auto mb-4 rounded-2xl bg-primary/10 flex items-center justify-center">
              <span className="text-3xl">🍽️</span>
            </div>
            <p className="text-foreground font-medium">No meals logged today</p>
            <p className="text-sm text-muted-foreground mt-1">Tap the button above to add your first meal</p>
          </div>
        </Card>
      ) : (
        <>
          <div className="space-y-3">
            {meals.map((meal, index) => (
              <div key={meal.id} className="animate-fade-up" style={{ animationDelay: `${index * 50}ms` }}>
                <MealCard meal={meal} onDelete={handleDelete} onEdit={setEditingMeal} />
              </div>
            ))}
          </div>
          {editingMeal && (
            <EditMealModal
              meal={editingMeal}
              onClose={() => setEditingMeal(null)}
              onSave={handleEditSave}
            />
          )}
        </>
      )}
    </div>
  )
}

function getGreeting() {
  const hour = new Date().getHours()
  if (hour < 12) return 'morning'
  if (hour < 18) return 'afternoon'
  return 'evening'
}