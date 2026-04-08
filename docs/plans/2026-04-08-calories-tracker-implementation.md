# Calories Tracker Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Build a mobile-first calories tracker web app with AI-powered food recognition

**Architecture:** Next.js 14 app deployed on Cloudflare Pages with serverless API routes, Supabase for database/storage, OpenRouter for AI food analysis

**Tech Stack:** Next.js 14, Tailwind CSS, Cloudflare Pages, Supabase, OpenRouter API

---

## Phase 1: Project Setup

### Task 1: Initialize Next.js Project

**Files:**
- Create: `.env.local`
- Create: `src/app/layout.tsx`
- Create: `src/app/page.tsx`
- Create: `src/app/globals.css`

**Step 1: Create Next.js app**

Run: `npx create-next-app@latest . --typescript --tailwind --eslint --app --src-dir --import-alias "@/*" --no-git`

Expected: Interactive prompts - answer:
- TypeScript: Yes
- Tailwind: Yes
- ESLint: Yes
- App Router: Yes
- Import alias: @/*

**Step 2: Create environment template**

```bash
cat > .env.local.example << 'ENVEOF'
OPENROUTER_API_KEY=your_openrouter_api_key
OPENROUTER_MODEL=openai/gpt-4-vision-preview
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
ENVEOF
```

**Step 3: Commit**

```bash
git add . && git commit -m "feat: initialize Next.js project with TypeScript and Tailwind"
```

---

### Task 2: Configure Supabase Client

**Files:**
- Create: `src/lib/supabase.ts`
- Create: `src/types/index.ts`

**Step 1: Create Supabase client**

```typescript
// src/lib/supabase.ts
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export const supabaseAdmin = createClient(
  supabaseUrl,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)
```

**Step 2: Create TypeScript types**

```typescript
// src/types/index.ts
export type MealType = 'breakfast' | 'lunch' | 'dinner' | 'snack'

export interface Meal {
  id: string
  user_id: string
  image_url: string
  food_name: string
  estimated_calories: number
  actual_calories: number | null
  portion_size: string
  confidence_score: number
  meal_type: MealType
  consumed_at: string
  created_at: string
}

export interface UserSettings {
  user_id: string
  daily_calorie_goal: number
  timezone: string
}

export interface MealAnalysis {
  food_name: string
  calories: number
  portion_size: string
  meal_type: MealType
  confidence_score: number
}
```

**Step 3: Commit**

```bash
git add src/lib/supabase.ts src/types/index.ts && git commit -m "feat: add Supabase client and TypeScript types"
```

---

## Phase 2: Core UI Components

### Task 3: Create Layout and Navigation

**Files:**
- Create: `src/components/Layout.tsx`
- Modify: `src/app/layout.tsx`

**Step 1: Create Layout component**

```tsx
// src/components/Layout.tsx
'use client'

import { ReactNode } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

const navItems = [
  { href: '/', label: 'Dashboard', icon: '🏠' },
  { href: '/camera', label: 'Add Meal', icon: '📷' },
  { href: '/analytics', label: 'Analytics', icon: '📊' },
  { href: '/settings', label: 'Settings', icon: '⚙️' },
]

export default function Layout({ children }: { children: ReactNode }) {
  const pathname = usePathname()

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <main className="px-4 py-6">{children}</main>
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200">
        <div className="flex justify-around py-2">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center p-2 ${
                pathname === item.href ? 'text-blue-600' : 'text-gray-500'
              }`}
            >
              <span className="text-xl">{item.icon}</span>
              <span className="text-xs mt-1">{item.label}</span>
            </Link>
          ))}
        </div>
      </nav>
    </div>
  )
}
```

**Step 2: Update layout**

```tsx
// src/app/layout.tsx
import './globals.css'
import Layout from '@/components/Layout'

export const metadata = {
  title: 'Calories Tracker',
  viewport: 'width=device-width, initial-scale=1, maximum-scale=1',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <Layout>{children}</Layout>
      </body>
    </html>
  )
}
```

**Step 3: Commit**

```bash
git add src/components/Layout.tsx src/app/layout.tsx && git commit -m "feat: add mobile layout with bottom navigation"
```

---

### Task 4: Create Dashboard Screen

**Files:**
- Create: `src/app/page.tsx`
- Create: `src/components/MealCard.tsx`
- Create: `src/components/CalorieProgress.tsx`

**Step 1: Create CalorieProgress component**

```tsx
// src/components/CalorieProgress.tsx
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
```

**Step 2: Create MealCard component**

```tsx
// src/components/MealCard.tsx
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
```

**Step 3: Create Dashboard page**

```tsx
// src/app/page.tsx
'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import { Meal } from '@/types'
import CalorieProgress from '@/components/CalorieProgress'
import MealCard from '@/components/MealCard'

export default function Dashboard() {
  const [meals, setMeals] = useState<Meal[]>([])
  const [loading, setLoading] = useState(true)
  const [dailyGoal] = useState(2000)

  useEffect(() => {
    async function fetchMeals() {
      const today = new Date()
      today.setHours(0, 0, 0, 0)
      
      const { data } = await supabase
        .from('meals')
        .select('*')
        .gte('consumed_at', today.toISOString())
        .order('consumed_at', { ascending: false })
      
      if (data) setMeals(data)
      setLoading(false)
    }
    fetchMeals()
  }, [])

  const totalCalories = meals.reduce(
    (sum, m) => sum + (m.actual_calories ?? m.estimated_calories),
    0
  )

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
      
      <CalorieProgress current={totalCalories} goal={dailyGoal} />
      
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold text-gray-900">Today's Meals</h2>
        <Link
          href="/camera"
          className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium"
        >
          + Add Meal
        </Link>
      </div>

      {loading ? (
        <div className="text-center py-8 text-gray-500">Loading...</div>
      ) : meals.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          <p>No meals logged today</p>
          <p className="text-sm mt-1">Tap the button above to add your first meal</p>
        </div>
      ) : (
        <div className="space-y-3">
          {meals.map((meal) => (
            <MealCard key={meal.id} meal={meal} />
          ))}
        </div>
      )}
    </div>
  )
}
```

**Step 4: Commit**

```bash
git add src/app/page.tsx src/components/CalorieProgress.tsx src/components/MealCard.tsx && git commit -m "feat: create dashboard with calorie progress and meal list"
```

---

### Task 5: Create Camera Screen

**Files:**
- Create: `src/app/camera/page.tsx`
- Create: `src/components/CameraView.tsx`

**Step 1: Create CameraView component**

```tsx
// src/components/CameraView.tsx
'use client'

import { useRef, useState, useCallback } from 'react'

interface CameraViewProps {
  onCapture: (file: File) => void
}

export default function CameraView({ onCapture }: CameraViewProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [stream, setStream] = useState<MediaStream | null>(null)
  const [error, setError] = useState<string | null>(null)

  const startCamera = useCallback(async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment' },
      })
      setStream(mediaStream)
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream
      }
    } catch (err) {
      setError('Camera access denied. Please enable camera permissions.')
    }
  }, [])

  const capturePhoto = useCallback(() => {
    if (!videoRef.current || !stream) return

    const video = videoRef.current
    const canvas = document.createElement('canvas')
    canvas.width = video.videoWidth
    canvas.height = video.videoHeight
    canvas.getContext('2d')?.drawImage(video, 0, 0)

    canvas.toBlob((blob) => {
      if (blob) {
        const file = new File([blob], 'meal.jpg', { type: 'image/jpeg' })
        onCapture(file)
        stream.getTracks().forEach(track => track.stop())
        setStream(null)
      }
    }, 'image/jpeg', 0.8)
  }, [stream, onCapture])

  return (
    <div className="relative h-[60vh] bg-black rounded-2xl overflow-hidden">
      {!stream && !error && (
        <div className="absolute inset-0 flex items-center justify-center">
          <button
            onClick={startCamera}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg font-medium"
          >
            Start Camera
          </button>
        </div>
      )}
      
      {error && (
        <div className="absolute inset-0 flex items-center justify-center text-white text-center p-4">
          <p>{error}</p>
        </div>
      )}

      <video
        ref={videoRef}
        autoPlay
        playsInline
        className={`w-full h-full object-cover ${!stream ? 'hidden' : ''}`}
      />

      {stream && (
        <button
          onClick={capturePhoto}
          className="absolute bottom-6 left-1/2 -translate-x-1/2 w-16 h-16 bg-white rounded-full border-4 border-blue-600"
        />
      )}
    </div>
  )
}
```

**Step 2: Create Camera page**

```tsx
// src/app/camera/page.tsx
'use client'

import { useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import CameraView from '@/components/CameraView'
import Link from 'next/link'

export default function CameraPage() {
  const router = useRouter()
  const [uploading, setUploading] = useState(false)

  const handleCapture = useCallback(async (file: File) => {
    setUploading(true)
    
    const formData = new FormData()
    formData.append('image', file)

    try {
      const res = await fetch('/api/analyze-meal', {
        method: 'POST',
        body: formData,
      })
      
      if (res.ok) {
        router.push('/')
      }
    } catch (err) {
      console.error('Upload failed:', err)
    }
    
    setUploading(false)
  }, [router])

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Add Meal</h1>
        <Link href="/" className="text-gray-500">
          Cancel
        </Link>
      </div>

      <CameraView onCapture={handleCapture} />

      {uploading && (
        <div className="text-center py-4">
          <p className="text-gray-600">Analyzing your meal...</p>
          <p className="text-sm text-gray-400 mt-1">This may take a moment</p>
        </div>
      )}

      <p className="text-center text-sm text-gray-500">
        Point camera at your food and tap the button to capture
      </p>
    </div>
  )
}
```

**Step 3: Commit**

```bash
git add src/app/camera/page.tsx src/components/CameraView.tsx && git commit -m "feat: add camera capture screen"
```

---

## Phase 3: API Endpoints

### Task 6: Create Meal Analysis API

**Files:**
- Create: `src/app/api/analyze-meal/route.ts`
- Create: `src/lib/openrouter.ts`

**Step 1: Create OpenRouter client**

```typescript
// src/lib/openrouter.ts
interface OpenRouterResponse {
  choices: {
    message: {
      content: string
    }
  }[]
}

export async function analyzeFood(imageBase64: string): Promise<{
  food_name: string
  calories: number
  portion_size: string
  meal_type: 'breakfast' | 'lunch' | 'dinner' | 'snack'
  confidence_score: number
}> {
  const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
    },
    body: JSON.stringify({
      model: process.env.OPENROUTER_MODEL || 'openai/gpt-4-vision-preview',
      messages: [
        {
          role: 'user',
          content: [
            {
              type: 'image_url',
              image_url: {
                url: `data:image/jpeg;base64,${imageBase64}`,
              },
            },
            {
              type: 'text',
              text: 'Identify this food and estimate its calories. Return JSON with: food_name (string), calories (integer), portion_size (string), meal_type (breakfast/lunch/dinner/snack based on time), confidence_score (0-1).',
            },
          ],
        },
      ],
      max_tokens: 500,
    }),
  })

  if (!response.ok) {
    throw new Error('OpenRouter API error')
  }

  const data: OpenRouterResponse = await response.json()
  const content = data.choices[0]?.message?.content || '{}'
  
  return JSON.parse(content)
}
```

**Step 2: Create API route**

```typescript
// src/app/api/analyze-meal/route.ts
import { NextResponse } from 'next/server'
import { analyzeFood } from '@/lib/openrouter'
import { supabaseAdmin } from '@/lib/supabase'

export async function POST(request: Request) {
  try {
    const formData = await request.formData()
    const image = formData.get('image') as File
    
    if (!image) {
      return NextResponse.json({ error: 'No image provided' }, { status: 400 })
    }

    const bytes = await image.arrayBuffer()
    const buffer = Buffer.from(bytes)
    const imageBase64 = buffer.toString('base64')

    const analysis = await analyzeFood(imageBase64)

    const { data: imageData, error: uploadError } = await supabaseAdmin.storage
      .from('meal-photos')
      .upload(`${Date.now()}.jpg`, buffer, {
        contentType: 'image/jpeg',
      })

    if (uploadError) {
      console.error('Upload error:', uploadError)
    }

    const { data: urlData } = supabaseAdmin.storage
      .from('meal-photos')
      .getPublicUrl(imageData?.path || '')

    const { data: meal, error: dbError } = await supabaseAdmin
      .from('meals')
      .insert({
        user_id: 'anonymous',
        image_url: urlData.publicUrl || '',
        food_name: analysis.food_name,
        estimated_calories: analysis.calories,
        portion_size: analysis.portion_size,
        meal_type: analysis.meal_type,
        confidence_score: analysis.confidence_score,
        consumed_at: new Date().toISOString(),
      })
      .select()
      .single()

    if (dbError) {
      console.error('DB error:', dbError)
    }

    return NextResponse.json(meal)
  } catch (error) {
    console.error('Error:', error)
    return NextResponse.json({ error: 'Analysis failed' }, { status: 500 })
  }
}
```

**Step 3: Commit**

```bash
git add src/app/api/analyze-meal/route.ts src/lib/openrouter.ts && git commit -m "feat: add meal analysis API endpoint with OpenRouter"
```

---

### Task 7: Create Meals API

**Files:**
- Create: `src/app/api/meals/route.ts`

**Step 1: Create API route**

```typescript
// src/app/api/meals/route.ts
import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const date = searchParams.get('date')
  const limit = parseInt(searchParams.get('limit') || '50')

  let query = supabaseAdmin
    .from('meals')
    .select('*')
    .order('consumed_at', { ascending: false })
    .limit(limit)

  if (date) {
    const startOfDay = new Date(date)
    startOfDay.setHours(0, 0, 0, 0)
    const endOfDay = new Date(date)
    endOfDay.setHours(23, 59, 59, 999)
    
    query = query
      .gte('consumed_at', startOfDay.toISOString())
      .lte('consumed_at', endOfDay.toISOString())
  }

  const { data, error } = await query

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json(data)
}
```

**Step 2: Commit**

```bash
git add src/app/api/meals/route.ts && git commit -m "feat: add meals list API endpoint"
```

---

### Task 8: Create Analytics API

**Files:**
- Create: `src/app/api/analytics/route.ts`

**Step 1: Create API route**

```typescript
// src/app/api/analytics/route.ts
import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const days = parseInt(searchParams.get('days') || '7')

  const startDate = new Date()
  startDate.setDate(startDate.getDate() - days)
  startDate.setHours(0, 0, 0, 0)

  const { data, error } = await supabaseAdmin
    .from('meals')
    .select('*')
    .gte('consumed_at', startDate.toISOString())
    .order('consumed_at', { ascending: true })

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  const dailyTotals: Record<string, number> = {}
  const mealBreakdown: Record<string, Record<string, number>> = {}

  data.forEach((meal) => {
    const date = meal.consumed_at.split('T')[0]
    const calories = meal.actual_calories ?? meal.estimated_calories
    
    dailyTotals[date] = (dailyTotals[date] || 0) + calories
    
    if (!mealBreakdown[date]) {
      mealBreakdown[date] = { breakfast: 0, lunch: 0, dinner: 0, snack: 0 }
    }
    mealBreakdown[date][meal.meal_type] = 
      (mealBreakdown[date][meal.meal_type] || 0) + calories
  })

  const dailyAverage = Object.values(dailyTotals).reduce((a, b) => a + b, 0) / 
    Math.max(Object.keys(dailyTotals).length, 1)

  return NextResponse.json({
    dailyTotals,
    mealBreakdown,
    dailyAverage: Math.round(dailyAverage),
    totalMeals: data.length,
  })
}
```

**Step 2: Commit**

```bash
git add src/app/api/analytics/route.ts && git commit -m "feat: add analytics aggregation API endpoint"
```

---

## Phase 4: Analytics and Settings

### Task 9: Create Analytics Screen

**Files:**
- Create: `src/app/analytics/page.tsx`
- Create: `src/components/CalorieChart.tsx`

**Step 1: Create CalorieChart component**

```tsx
// src/components/CalorieChart.tsx
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
```

**Step 2: Create Analytics page**

```tsx
// src/app/analytics/page.tsx
'use client'

import { useEffect, useState } from 'react'
import CalorieChart from '@/components/CalorieChart'

interface AnalyticsData {
  dailyTotals: Record<string, number>
  mealBreakdown: Record<string, Record<string, number>>
  dailyAverage: number
  totalMeals: number
}

export default function AnalyticsPage() {
  const [data, setData] = useState<AnalyticsData | null>(null)
  const [loading, setLoading] = useState(true)
  const [goal] = useState(2000)

  useEffect(() => {
    async function fetchAnalytics() {
      const res = await fetch('/api/analytics?days=7')
      const result = await res.json()
      setData(result)
      setLoading(false)
    }
    fetchAnalytics()
  }, [])

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Analytics</h1>

      {loading ? (
        <div className="text-center py-8 text-gray-500">Loading...</div>
      ) : data ? (
        <>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white rounded-xl p-4 shadow-sm">
              <p className="text-sm text-gray-500">Daily Average</p>
              <p className="text-2xl font-bold text-gray-900">{data.dailyAverage}</p>
            </div>
            <div className="bg-white rounded-xl p-4 shadow-sm">
              <p className="text-sm text-gray-500">Total Meals</p>
              <p className="text-2xl font-bold text-gray-900">{data.totalMeals}</p>
            </div>
          </div>

          <CalorieChart data={data.dailyTotals} goal={goal} />

          <div className="bg-white rounded-xl p-4 shadow-sm">
            <h3 className="font-semibold text-gray-900 mb-4">Meal Breakdown</h3>
            <div className="space-y-3">
              {['breakfast', 'lunch', 'dinner', 'snack'].map((type) => {
                const total = Object.values(data.mealBreakdown)
                  .reduce((sum, day) => sum + (day[type] || 0), 0)
                return (
                  <div key={type} className="flex justify-between items-center">
                    <span className="capitalize text-gray-700">{type}</span>
                    <span className="font-medium text-gray-900">{total} cal</span>
                  </div>
                )
              })}
            </div>
          </div>
        </>
      ) : (
        <div className="text-center py-8 text-gray-500">
          No data available yet
        </div>
      )}
    </div>
  )
}
```

**Step 3: Commit**

```bash
git add src/app/analytics/page.tsx src/components/CalorieChart.tsx && git commit -m "feat: add analytics screen with charts"
```

---

### Task 10: Create Settings Screen

**Files:**
- Create: `src/app/settings/page.tsx`

**Step 1: Create Settings page**

```tsx
// src/app/settings/page.tsx
'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabase'

export default function SettingsPage() {
  const [goal, setGoal] = useState(2000)
  const [saved, setSaved] = useState(false)

  const handleSaveGoal = async () => {
    await supabase.from('user_settings').upsert({
      user_id: 'anonymous',
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
```

**Step 2: Commit**

```bash
git add src/app/settings/page.tsx && git commit -m "feat: add settings screen"
```

---

## Phase 5: Deployment

### Task 11: Configure Cloudflare Deployment

**Files:**
- Create: `wrangler.toml`
- Create: `.gitignore`

**Step 1: Create wrangler.toml**

```toml
name = "calories-tracker"
compatibility_date = "2024-01-01"

[vars]
NEXT_PUBLIC_SUPABASE_URL = "your_supabase_url"
NEXT_PUBLIC_SUPABASE_ANON_KEY = "your_anon_key"
```

**Step 2: Update .gitignore**

```bash
cat >> .gitignore << 'GITEOF'

# Environment
.env
.env.local
.env.production

# Cloudflare
.wrangler
.dev.vars
GITEOF
```

**Step 3: Commit**

```bash
git add wrangler.toml .gitignore && git commit -m "chore: add Cloudflare configuration"
```

---

### Task 12: Create Supabase Setup SQL

**Files:**
- Create: `supabase/migrations/001_initial_schema.sql`

**Step 1: Create migration**

```sql
-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create meals table
CREATE TABLE meals (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID NOT NULL DEFAULT '00000000-0000-0000-0000-000000000000',
  image_url TEXT,
  food_name TEXT NOT NULL,
  estimated_calories INTEGER NOT NULL,
  actual_calories INTEGER,
  portion_size TEXT,
  confidence_score FLOAT DEFAULT 0.5,
  meal_type TEXT CHECK (meal_type IN ('breakfast', 'lunch', 'dinner', 'snack')) DEFAULT 'snack',
  consumed_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create user_settings table
CREATE TABLE user_settings (
  user_id UUID PRIMARY KEY DEFAULT '00000000-0000-0000-0000-000000000000',
  daily_calorie_goal INTEGER DEFAULT 2000,
  timezone TEXT DEFAULT 'UTC'
);

-- Create storage bucket
INSERT INTO storage.buckets (id, name, public) 
VALUES ('meal-photos', 'meal-photos', true);

-- Create storage policy
CREATE POLICY "Public read access" ON storage.objects
  FOR SELECT USING (bucket_id = 'meal-photos');

CREATE POLICY "Auth upload access" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'meal-photos');

-- Enable RLS
ALTER TABLE meals ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_settings ENABLE ROW LEVEL SECURITY;

-- RLS policies
CREATE POLICY "Public read meals" ON meals FOR SELECT USING (true);
CREATE POLICY "Public insert meals" ON meals FOR INSERT WITH CHECK (true);
CREATE POLICY "Public update meals" ON meals FOR UPDATE USING (true);
CREATE POLICY "Public delete meals" ON meals FOR DELETE USING (true);

CREATE POLICY "Public read settings" ON user_settings FOR SELECT USING (true);
CREATE POLICY "Public update settings" ON user_settings FOR UPDATE USING (true);
```

**Step 2: Commit**

```bash
git add supabase/migrations/001_initial_schema.sql && git commit -m "chore: add Supabase database migration"
```

---

## Final: Push and Deploy

**Step 1: Push to GitHub**

```bash
git remote add origin https://github.com/yourusername/calories-tracker.git
git push -u origin main
```

**Step 2: Connect to Cloudflare Pages**

1. Go to dash.cloudflare.com
2. Select "Pages" then "Create a project"
3. Connect your GitHub repository
4. Configure build settings:
   - Framework preset: Next.js
   - Build command: npm run build
   - Build output directory: .next
5. Add environment variables in settings:
   - `OPENROUTER_API_KEY`
   - `OPENROUTER_MODEL`
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`

**Step 3: Deploy**

Cloudflare will automatically deploy on push to main branch.

---

## Testing Checklist

- Camera captures photo and displays preview
- AI analysis returns food name and calories
- Meal saves to database and appears on dashboard
- Calorie progress bar updates correctly
- Analytics charts display correctly
- Settings save and persist
- Mobile layout renders correctly on iPhone viewport
- Error handling shows appropriate messages
