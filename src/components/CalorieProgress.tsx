'use client'

import { Card } from '@/components/ui/card'
import { Progress, ProgressTrack, ProgressIndicator } from '@/components/ui/progress'
import { cn } from '@/lib/utils'

interface CalorieProgressProps {
  current: number
  goal: number
}

export default function CalorieProgress({ current, goal }: CalorieProgressProps) {
  const percentage = Math.min((current / goal) * 100, 100)
  const remaining = Math.max(goal - current, 0)
  const isOver = current > goal

  return (
    <Card className="overflow-hidden animate-fade-up">
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <p className="text-sm font-medium text-muted-foreground mb-1">Today's Progress</p>
            <div className="flex items-baseline gap-2">
              <span className="text-4xl font-bold tracking-tight gemini-gradient-text">
                {current.toLocaleString()}
              </span>
              <span className="text-sm text-muted-foreground">
                / {goal.toLocaleString()} cal
              </span>
            </div>
          </div>
          <div className="text-right">
            <div className={cn(
              "text-2xl font-bold",
              isOver ? "text-destructive" : "text-primary"
            )}>
              {percentage.toFixed(0)}%
            </div>
            <p className="text-xs text-muted-foreground">
              {isOver ? 'Over by' : 'Remaining'} {remaining.toLocaleString()}
            </p>
          </div>
        </div>

        <Progress value={percentage} className="h-3">
          <ProgressTrack className={cn(
            "h-3 rounded-full overflow-hidden",
            isOver ? "bg-destructive/20" : "bg-muted"
          )}>
            <ProgressIndicator
              className={cn(
                "h-full rounded-full transition-all duration-500 ease-out",
                isOver
                  ? "bg-gradient-to-r from-destructive to-destructive/80"
                  : "bg-gradient-to-r from-primary via-primary/90 to-primary/80"
              )}
              style={{ width: `${Math.min(percentage, 100)}%` }}
            />
          </ProgressTrack>
        </Progress>

        <div className="flex justify-between mt-4 text-xs">
          <div className="flex items-center gap-2">
            <span className={cn(
              "inline-flex items-center rounded-full px-2.5 py-0.5 font-medium",
              percentage > 100
                ? "bg-destructive/10 text-destructive"
                : percentage > 80
                ? "bg-yellow-500/10 text-yellow-600 dark:text-yellow-400"
                : "bg-primary/10 text-primary"
            )}>
              {percentage > 100 ? 'Over goal' : percentage > 80 ? 'Almost there' : 'On track'}
            </span>
          </div>
          <span className="text-muted-foreground">
            {goal.toLocaleString()} cal daily goal
          </span>
        </div>
      </div>
    </Card>
  )
}