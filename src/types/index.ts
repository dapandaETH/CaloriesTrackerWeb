export type MealType = 'breakfast' | 'lunch' | 'dinner' | 'snack'

export interface Meal {
  id: string
  user_id: string
  image_url: string
  food_name: string
  estimated_calories: number
  actual_calories: number | null
  portion_size: string
  confidence_score: number
  meal_type: MealType
  consumed_at: string
  created_at: string
}

export interface UserSettings {
  user_id: string
  daily_calorie_goal: number
  timezone: string
}

export interface MealAnalysis {
  food_name: string
  calories: number
  portion_size: string
  meal_type: MealType
  confidence_score: number
}
