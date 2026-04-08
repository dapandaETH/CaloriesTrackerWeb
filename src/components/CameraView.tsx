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
