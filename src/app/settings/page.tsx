'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Trash2, Info } from 'lucide-react'

export default function SettingsPage() {
  const [goal, setGoal] = useState(2000)
  const [saved, setSaved] = useState(false)

  const handleSaveGoal = async () => {
    await supabase.from('user_settings').upsert({
      user_id: '00000000-0000-0000-0000-000000000000',
      daily_calorie_goal: goal,
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    })
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  const handleClearData = async () => {
    if (confirm('Are you sure you want to delete all meal data? This cannot be undone.')) {
      await supabase.from('meals').delete().neq('id', '00000000-0000-0000-0000-000000000000')
      window.location.reload()
    }
  }

  return (
    <div className="space-y-6">
      <div className="animate-fade-up">
        <h1 className="text-2xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground mt-1">Customize your experience</p>
      </div>

      <Card className="p-6 space-y-6 animate-fade-up-delay-1">
        <div>
          <h2 className="font-semibold mb-1">Daily Calorie Goal</h2>
          <p className="text-sm text-muted-foreground">Set your target daily calorie intake</p>
        </div>

        <div className="space-y-4">
          <div className="flex justify-between items-baseline">
            <span className="text-sm text-muted-foreground">Goal</span>
            <span className="text-3xl font-bold gemini-gradient-text">{goal}</span>
          </div>

          <input
            type="range"
            min="1000"
            max="4000"
            step="50"
            value={goal}
            onChange={(e) => setGoal(parseInt(e.target.value))}
            className="w-full h-2 bg-muted rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:bg-primary [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:shadow-md"
          />

          <div className="flex justify-between text-xs text-muted-foreground">
            <span>1,000 cal</span>
            <span>4,000 cal</span>
          </div>
        </div>

        <Button
          onClick={handleSaveGoal}
          className="w-full"
          variant={saved ? "outline" : "default"}
        >
          {saved ? 'Saved!' : 'Save Goal'}
        </Button>
      </Card>

      <Card className="p-6 animate-fade-up-delay-2">
        <div className="flex items-start gap-4">
          <div className="size-10 shrink-0 rounded-xl bg-destructive/10 flex items-center justify-center">
            <Trash2 className="size-5 text-destructive" />
          </div>
          <div className="flex-1">
            <h2 className="font-semibold">Clear All Data</h2>
            <p className="text-sm text-muted-foreground mt-1">
              Permanently delete all your meal records. This action cannot be undone.
            </p>
            <Button
              onClick={handleClearData}
              variant="destructive"
              size="sm"
              className="mt-3"
            >
              Clear Meal Data
            </Button>
          </div>
        </div>
      </Card>

      <Card className="p-6 animate-fade-up-delay-3">
        <div className="flex items-start gap-4">
          <div className="size-10 shrink-0 rounded-xl bg-primary/10 flex items-center justify-center">
            <Info className="size-5 text-primary" />
          </div>
          <div>
            <h2 className="font-semibold">About</h2>
            <p className="text-sm text-muted-foreground mt-1">
              Calories Tracker v1.0
            </p>
            <p className="text-xs text-muted-foreground mt-2">
              Powered by AI food recognition
            </p>
          </div>
        </div>
      </Card>
    </div>
  )
}