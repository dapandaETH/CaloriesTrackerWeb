'use client'

import Image from 'next/image'
import { useState } from 'react'
import { Meal } from '@/types'
import { Card } from '@/components/ui/card'
import { cn } from '@/lib/utils'
import { Pencil, Trash2 } from 'lucide-react'

interface MealCardProps {
  meal: Meal
  onDelete?: (id: string) => void
  onEdit?: (meal: Meal) => void
}

export default function MealCard({ meal, onDelete, onEdit }: MealCardProps) {
  const [isDeleting, setIsDeleting] = useState(false)
  const [imageError, setImageError] = useState(false)

  const time = new Date(meal.consumed_at)
  const now = new Date()
  const diffMs = now.getTime() - time.getTime()
  const diffMins = Math.floor(diffMs / 60000)
  const diffHours = Math.floor(diffMins / 60)
  const diffDays = Math.floor(diffHours / 24)

  const relativeTime = diffDays > 0
    ? `${diffDays}d`
    : diffHours > 0
    ? `${diffHours}h`
    : diffMins > 0
    ? `${diffMins}m`
    : 'now'

  const handleDelete = async () => {
    if (!onDelete || isDeleting) return
    
    const confirmed = window.confirm(`Delete "${meal.food_name}"?`)
    if (!confirmed) return

    setIsDeleting(true)
    await onDelete(meal.id)
    setIsDeleting(false)
  }

  return (
    <Card className="group overflow-hidden animate-fade-up">
      <div className="flex items-center gap-4 p-4">
        <div className="relative size-16 shrink-0 overflow-hidden rounded-xl ring-1 ring-border/50 transition-transform duration-200 group-hover:scale-105">
          {meal.image_url && !imageError ? (
            <Image
              src={meal.image_url}
              alt={meal.food_name}
              fill
              className="object-cover"
              onError={() => setImageError(true)}
            />
          ) : (
            <div className="size-full bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center">
              <span className="text-2xl">🍽️</span>
            </div>
          )}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0">
              <h3 className="font-semibold text-foreground truncate group-hover:text-primary transition-colors">
                {meal.food_name}
              </h3>
              <p className="text-sm text-muted-foreground truncate">{meal.portion_size}</p>
            </div>
            <div className="text-right shrink-0">
              <p className="text-xl font-bold text-primary">
                {meal.actual_calories ?? meal.estimated_calories}
              </p>
              <p className="text-[10px] text-muted-foreground">cal</p>
            </div>
          </div>

          <div className="flex items-center justify-between mt-2">
            <span className={cn(
              "inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-medium capitalize",
              "bg-primary/10 text-primary"
            )}>
              {meal.meal_type}
            </span>

            <div className="flex items-center gap-3">
              <span className="text-xs text-muted-foreground">{relativeTime}</span>
              
              <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                {onEdit && (
                  <button
                    onClick={() => onEdit(meal)}
                    className="p-1.5 rounded-lg text-muted-foreground hover:text-primary hover:bg-primary/10 transition-all"
                    title="Edit meal"
                  >
                    <Pencil className="size-4" />
                  </button>
                )}
                {onDelete && (
                  <button
                    onClick={handleDelete}
                    disabled={isDeleting}
                    className="p-1.5 rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-all disabled:opacity-50"
                    title="Delete meal"
                  >
                    <Trash2 className="size-4" />
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </Card>
  )
}