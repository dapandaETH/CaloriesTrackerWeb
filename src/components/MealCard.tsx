import Image from 'next/image'
import { useState } from 'react'
import { Meal } from '@/types'

interface MealCardProps {
  meal: Meal
  onDelete?: (id: string) => void
}

export default function MealCard({ meal, onDelete }: MealCardProps) {
  const [isDeleting, setIsDeleting] = useState(false)
  const time = new Date(meal.consumed_at).toLocaleTimeString([], { 
    hour: '2-digit', 
    minute: '2-digit' 
  })

  const handleDelete = async () => {
    if (!onDelete || isDeleting) return
    
    const confirmed = window.confirm(`Delete "${meal.food_name}"?`)
    if (!confirmed) return

    setIsDeleting(true)
    await onDelete(meal.id)
    setIsDeleting(false)
  }

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
          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-400">{time}</span>
            {onDelete && (
              <button
                onClick={handleDelete}
                disabled={isDeleting}
                className="p-1 text-gray-400 hover:text-red-500 transition-colors disabled:opacity-50"
                title="Delete meal"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
