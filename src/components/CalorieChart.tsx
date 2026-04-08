'use client'

import { Card } from '@/components/ui/card'
import { cn } from '@/lib/utils'

interface CalorieChartProps {
  data: Record<string, number>
  goal: number
}

export default function CalorieChart({ data, goal }: CalorieChartProps) {
  const entries = Object.entries(data).slice(-7)
  const maxValue = Math.max(...entries.map(([, v]) => v), goal)
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

  const getDayName = (dateStr: string) => {
    const date = new Date(dateStr)
    return days[date.getDay()]
  }

  const isToday = (dateStr: string) => {
    const today = new Date()
    const date = new Date(dateStr)
    return date.toDateString() === today.toDateString()
  }

  return (
    <Card className="overflow-hidden animate-fade-up-delay-1">
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold">Weekly Overview</h3>
          <div className="flex items-center gap-3 text-xs">
            <span className="flex items-center gap-1.5">
              <span className="size-2.5 rounded-full bg-primary" />
              On track
            </span>
            <span className="flex items-center gap-1.5">
              <span className="size-2.5 rounded-full bg-destructive" />
              Over goal
            </span>
          </div>
        </div>

        <div className="relative h-40 flex items-end justify-between gap-3">
          {entries.map(([date, calories], index) => {
            const height = (calories / maxValue) * 100
            const overGoal = calories > goal
            const today = isToday(date)

            return (
              <div
                key={date}
                className="flex-1 flex flex-col items-center gap-2 animate-fade-up"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <div className="relative w-full flex flex-col items-center justify-end h-full">
                  <span className="text-[10px] font-medium text-muted-foreground mb-1">
                    {calories > 0 ? calories.toLocaleString() : '0'}
                  </span>
                  <div
                    className={cn(
                      "w-full rounded-t-lg transition-all duration-300",
                      "min-h-[4px] relative overflow-hidden",
                      overGoal
                        ? "bg-gradient-to-t from-destructive/90 to-destructive"
                        : "bg-gradient-to-t from-primary/90 to-primary",
                      today && "ring-2 ring-primary/30 ring-offset-2 ring-offset-background"
                    )}
                    style={{ height: `${Math.max(height, 3)}%` }}
                  >
                    {today && (
                      <div className="absolute inset-0 bg-gradient-to-t from-white/20 to-transparent" />
                    )}
                  </div>
                </div>
                <span className={cn(
                  "text-[11px] font-medium",
                  today ? "text-primary" : "text-muted-foreground"
                )}>
                  {getDayName(date)}
                </span>
              </div>
            )
          })}

          {entries.length === 0 && (
            <div className="w-full h-full flex items-center justify-center text-muted-foreground text-sm">
              No data yet
            </div>
          )}
        </div>

        <div className="mt-4 pt-4 border-t border-border">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Daily goal</span>
            <span className="font-semibold text-foreground">{goal.toLocaleString()} cal</span>
          </div>
        </div>
      </div>
    </Card>
  )
}