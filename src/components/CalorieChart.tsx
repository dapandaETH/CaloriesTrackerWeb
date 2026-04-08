'use client'

interface CalorieChartProps {
  data: Record<string, number>
  goal: number
}

export default function CalorieChart({ data, goal }: CalorieChartProps) {
  const entries = Object.entries(data).slice(-7)
  const maxValue = Math.max(...entries.map(([, v]) => v), goal)

  return (
    <div className="bg-white rounded-2xl p-4 shadow-sm">
      <h3 className="font-semibold text-gray-900 mb-4">Daily Calories</h3>
      <div className="h-40 flex items-end justify-between gap-2">
        {entries.map(([date, calories]) => {
          const height = (calories / maxValue) * 100
          const overGoal = calories > goal
          return (
            <div key={date} className="flex-1 flex flex-col items-center gap-1">
              <div className="w-full flex flex-col items-center justify-end h-full">
                <div
                  className={`w-full rounded-t ${
                    overGoal ? 'bg-red-400' : 'bg-green-400'
                  }`}
                  style={{ height: `${height}%`, minHeight: '4px' }}
                />
              </div>
              <span className="text-xs text-gray-400">
                {new Date(date).toLocaleDateString(undefined, { weekday: 'short' })}
              </span>
            </div>
          )
        })}
      </div>
      <div className="mt-4 flex items-center justify-center gap-4 text-sm">
        <span className="flex items-center gap-1">
          <span className="w-3 h-3 rounded bg-green-400" />
          Under goal
        </span>
        <span className="flex items-center gap-1">
          <span className="w-3 h-3 rounded bg-red-400" />
          Over goal
        </span>
      </div>
    </div>
  )
}
