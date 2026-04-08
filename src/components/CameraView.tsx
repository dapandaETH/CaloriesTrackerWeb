'use client'

import { useRef, useState, useCallback } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Camera } from 'lucide-react'

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
    <Card className="overflow-hidden">
      <div className="relative h-[60vh] bg-black">
        {!stream && !error && (
          <div className="absolute inset-0 flex items-center justify-center">
            <Button onClick={startCamera} size="lg" className="gap-2">
              <Camera className="size-5" />
              Start Camera
            </Button>
          </div>
        )}
        
        {error && (
          <div className="absolute inset-0 flex items-center justify-center text-white text-center p-6">
            <div>
              <p className="text-lg font-medium">{error}</p>
              <Button onClick={startCamera} variant="outline" className="mt-4">
                Retry
              </Button>
            </div>
          </div>
        )}

        <video
          ref={videoRef}
          autoPlay
          playsInline
          className={`size-full object-cover ${!stream ? 'hidden' : ''}`}
        />

        {stream && (
          <button
            onClick={capturePhoto}
            className="absolute bottom-6 left-1/2 -translate-x-1/2 size-16 rounded-full bg-white ring-4 ring-primary/30 transition-transform hover:scale-105 active:scale-95"
          />
        )}
      </div>
    </Card>
  )
}