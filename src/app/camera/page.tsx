'use client'

import { useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import CameraView from '@/components/CameraView'
import Link from 'next/link'

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
      
      if (res.ok) {
        router.push('/')
      } else {
        setError(data.error || 'Failed to analyze meal')
        setUploading(false)
      }
    } catch (err) {
      setError('Network error. Please try again.')
      setUploading(false)
    }
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

      {error && (
        <div className="text-center py-4">
          <p className="text-red-600">{error}</p>
          <button 
            onClick={() => setError(null)}
            className="mt-2 text-sm text-blue-600 underline"
          >
            Try again
          </button>
        </div>
      )}

      {!uploading && !error && (
        <p className="text-center text-sm text-gray-500">
          Point camera at your food and tap the button to capture
        </p>
      )}
    </div>
  )
}
