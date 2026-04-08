'use client'

interface CalorieProgressProps {
  current: number
  goal: number
}

export default function CalorieProgress({ current, goal }: CalorieProgressProps) {
  const percentage = Math.min((current / goal) * 100, 100)
  
  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm">
      <div className="text-center mb-4">
        <p className="text-gray-500 text-sm">Today's Calories</p>
        <p className="text-4xl font-bold text-gray-900">
          {current}
          <span className="text-lg text-gray-400"> / {goal}</span>
        </p>
      </div>
      <div className="h-4 bg-gray-100 rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full transition-all ${
            percentage > 100 ? 'bg-red-500' : percentage > 80 ? 'bg-yellow-500' : 'bg-green-500'
          }`}
          style={{ width: `${percentage}%` }}
        />
      </div>
      <p className="text-center text-sm text-gray-500 mt-2">
        {percentage.toFixed(0)}% of daily goal
      </p>
    </div>
  )
}
