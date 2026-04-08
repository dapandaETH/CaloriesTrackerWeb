import Image from 'next/image'
import { Meal } from '@/types'

interface MealCardProps {
  meal: Meal
}

export default function MealCard({ meal }: MealCardProps) {
  const time = new Date(meal.consumed_at).toLocaleTimeString([], { 
    hour: '2-digit', 
    minute: '2-digit' 
  })

  return (
    <div className="bg-white rounded-xl p-4 shadow-sm flex gap-4">
      <div className="w-16 h-16 relative rounded-lg overflow-hidden bg-gray-100">
        {meal.image_url && (
          <Image
            src={meal.image_url}
            alt={meal.food_name}
            fill
            className="object-cover"
          />
        )}
      </div>
      <div className="flex-1">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="font-medium text-gray-900">{meal.food_name}</h3>
            <p className="text-sm text-gray-500">{meal.portion_size}</p>
          </div>
          <span className="text-lg font-semibold text-orange-600">
            {meal.actual_calories ?? meal.estimated_calories} cal
          </span>
        </div>
        <div className="flex justify-between items-center mt-2">
          <span className="text-xs text-gray-400 capitalize">{meal.meal_type}</span>
          <span className="text-xs text-gray-400">{time}</span>
        </div>
      </div>
    </div>
  )
}
