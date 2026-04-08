'use client'

import { useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import CameraView from '@/components/CameraView'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { ArrowLeft } from 'lucide-react'

export default function CameraPage() {
  const router = useRouter()
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleCapture = useCallback(async (file: File) => {
    setUploading(true)
    setError(null)
    
    const formData = new FormData()
    formData.append('image', file)

    try {
      const res = await fetch('/api/analyze-meal', {
        method: 'POST',
        body: formData,
      })
      
      const data = await res.json()
      
      if (!res.ok) {
        setError(data.error || 'Failed to analyze meal')
        setUploading(false)
        return
      }

      if (!data || !data.id) {
        setError('Invalid response from server')
        setUploading(false)
        return
      }

      router.push('/')
    } catch (err) {
      setError('Network error. Please try again.')
      setUploading(false)
    }
  }, [router])

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between animate-fade-up">
        <h1 className="text-2xl font-bold tracking-tight">Add Meal</h1>
        <Link href="/">
          <Button variant="ghost" size="icon-sm">
            <ArrowLeft className="size-4" />
          </Button>
        </Link>
      </div>

      <div className="animate-fade-up-delay-1">
        <CameraView onCapture={handleCapture} />
      </div>

      {uploading && (
        <Card className="p-6 animate-fade-up-delay-2">
          <div className="flex flex-col items-center justify-center text-center">
            <div className="size-10 rounded-full border-2 border-primary/30 border-t-primary animate-spin mb-3" />
            <p className="text-foreground font-medium">Analyzing your meal...</p>
            <p className="text-sm text-muted-foreground mt-1">This may take a moment</p>
          </div>
        </Card>
      )}

      {error && (
        <Card className="p-6 border-destructive/50 animate-fade-up-delay-2">
          <div className="text-center">
            <p className="text-destructive font-medium">{error}</p>
            <button 
              onClick={() => setError(null)}
              className="mt-2 text-sm text-primary hover:text-primary/80 font-medium"
            >
              Try again
            </button>
          </div>
        </Card>
      )}

      {!uploading && !error && (
        <p className="text-center text-sm text-muted-foreground animate-fade-up-delay-2">
          Point camera at your food and tap the button to capture
        </p>
      )}
    </div>
  )
}