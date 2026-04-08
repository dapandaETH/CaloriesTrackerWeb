import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const days = parseInt(searchParams.get('days') || '7')

  const startDate = new Date()
  startDate.setDate(startDate.getDate() - days)
  startDate.setHours(0, 0, 0, 0)

  const { data, error } = await supabaseAdmin
    .from('meals')
    .select('*')
    .gte('consumed_at', startDate.toISOString())
    .order('consumed_at', { ascending: true })

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  const dailyTotals: Record<string, number> = {}
  const mealBreakdown: Record<string, Record<string, number>> = {}

  data.forEach((meal) => {
    const date = meal.consumed_at.split('T')[0]
    const calories = meal.actual_calories ?? meal.estimated_calories
    
    dailyTotals[date] = (dailyTotals[date] || 0) + calories
    
    if (!mealBreakdown[date]) {
      mealBreakdown[date] = { breakfast: 0, lunch: 0, dinner: 0, snack: 0 }
    }
    mealBreakdown[date][meal.meal_type] = 
      (mealBreakdown[date][meal.meal_type] || 0) + calories
  })

  const dailyAverage = Object.values(dailyTotals).reduce((a, b) => a + b, 0) / 
    Math.max(Object.keys(dailyTotals).length, 1)

  return NextResponse.json({
    dailyTotals,
    mealBreakdown,
    dailyAverage: Math.round(dailyAverage),
    totalMeals: data.length,
  })
}
