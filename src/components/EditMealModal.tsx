'use client'

import { useState, useEffect } from 'react'
import { Meal, MealType } from '@/types'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

interface EditMealModalProps {
  meal: Meal
  onClose: () => void
  onSave: (updated: Meal) => void
}

export default function EditMealModal({ meal, onClose, onSave }: EditMealModalProps) {
  const [formData, setFormData] = useState({
    food_name: meal.food_name,
    estimated_calories: meal.estimated_calories,
    actual_calories: meal.actual_calories ?? '',
    portion_size: meal.portion_size,
    meal_type: meal.meal_type,
  })
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = 'unset' }
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)

    const res = await fetch(`/api/meals/${meal.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...formData,
        actual_calories: formData.actual_calories || null,
      }),
    })

    if (res.ok) {
      const updated = await res.json()
      onSave(updated)
    } else {
      alert('Failed to save changes')
    }
    setSaving(false)
  }

  const mealTypes: MealType[] = ['breakfast', 'lunch', 'dinner', 'snack']

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">Edit Meal</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-5 mt-2">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">
                Food Name
              </label>
              <input
                type="text"
                value={formData.food_name}
                onChange={(e) => setFormData({ ...formData, food_name: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl border border-input bg-background text-foreground placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/20 focus:outline-none transition-all"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-foreground mb-1.5">
                  Estimated
                </label>
                <input
                  type="number"
                  value={formData.estimated_calories}
                  onChange={(e) => setFormData({ ...formData, estimated_calories: parseInt(e.target.value) || 0 })}
                  className="w-full px-4 py-2.5 rounded-xl border border-input bg-background text-foreground placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/20 focus:outline-none transition-all"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-1.5">
                  Actual
                </label>
                <input
                  type="number"
                  value={formData.actual_calories}
                  onChange={(e) => setFormData({ ...formData, actual_calories: e.target.value })}
                  placeholder="Optional"
                  className="w-full px-4 py-2.5 rounded-xl border border-input bg-background text-foreground placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/20 focus:outline-none transition-all"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-foreground mb-1.5">
                  Portion
                </label>
                <input
                  type="text"
                  value={formData.portion_size}
                  onChange={(e) => setFormData({ ...formData, portion_size: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-input bg-background text-foreground placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/20 focus:outline-none transition-all"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-1.5">
                  Type
                </label>
                <select
                  value={formData.meal_type}
                  onChange={(e) => setFormData({ ...formData, meal_type: e.target.value as MealType })}
                  className="w-full px-4 py-2.5 rounded-xl border border-input bg-background text-foreground focus:border-primary focus:ring-2 focus:ring-primary/20 focus:outline-none transition-all appearance-none"
                >
                  {mealTypes.map((type) => (
                    <option key={type} value={type} className="capitalize">
                      {type}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={saving}
              className="flex-1 bg-primary hover:bg-primary/90"
            >
              {saving ? 'Saving...' : 'Save Changes'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}