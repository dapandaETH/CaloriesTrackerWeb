'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabase'

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
      <h1 className="text-2xl font-bold text-gray-900">Settings</h1>

      <div className="bg-white rounded-xl p-4 shadow-sm space-y-4">
        <h2 className="font-semibold text-gray-900">Daily Calorie Goal</h2>
        <div className="space-y-2">
          <input
            type="range"
            min="1000"
            max="4000"
            step="100"
            value={goal}
            onChange={(e) => setGoal(parseInt(e.target.value))}
            className="w-full"
          />
          <div className="flex justify-between text-sm text-gray-500">
            <span>1000</span>
            <span className="text-lg font-semibold text-blue-600">{goal} cal</span>
            <span>4000</span>
          </div>
        </div>
        <button
          onClick={handleSaveGoal}
          className="w-full py-2 bg-blue-600 text-white rounded-lg font-medium"
        >
          {saved ? 'Saved!' : 'Save Goal'}
        </button>
      </div>

      <div className="bg-white rounded-xl p-4 shadow-sm">
        <h2 className="font-semibold text-gray-900 mb-4">Data Management</h2>
        <button
          onClick={handleClearData}
          className="w-full py-2 bg-red-50 text-red-600 rounded-lg font-medium"
        >
          Clear All Meal Data
        </button>
      </div>

      <div className="bg-white rounded-xl p-4 shadow-sm">
        <h2 className="font-semibold text-gray-900 mb-2">About</h2>
        <p className="text-sm text-gray-500">
          Calories Tracker v1.0
        </p>
        <p className="text-xs text-gray-400 mt-1">
          Powered by AI food recognition
        </p>
      </div>
    </div>
  )
}
