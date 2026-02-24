"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Camera, CheckCircle2, XCircle, RefreshCw } from "lucide-react"

interface FacialRecognitionProps {
  onCapture: (imageData: string) => void
  onCancel: () => void
  mode?: "register" | "verify"
  storedFaceData?: string
}

export function FacialRecognition({ onCapture, onCancel, mode = "register", storedFaceData }: FacialRecognitionProps) {
  const [stream, setStream] = useState<MediaStream | null>(null)
  const [capturedImage, setCapturedImage] = useState<string | null>(null)
  const [isCapturing, setIsCapturing] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [verificationResult, setVerificationResult] = useState<"success" | "failed" | null>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    startCamera()
    return () => {
      stopCamera()
    }
  }, [])

  const startCamera = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "user", width: 640, height: 480 },
      })
      setStream(mediaStream)
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream
      }
      setError(null)
    } catch (err) {
      setError("Não foi possível acessar a câmera. Verifique as permissões.")
      console.error("Camera access error:", err)
    }
  }

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach((track) => track.stop())
      setStream(null)
    }
  }

  const capturePhoto = () => {
    if (!videoRef.current || !canvasRef.current) return

    setIsCapturing(true)
    const video = videoRef.current
    const canvas = canvasRef.current
    const context = canvas.getContext("2d")

    if (context) {
      canvas.width = video.videoWidth
      canvas.height = video.videoHeight
      context.drawImage(video, 0, 0, canvas.width, canvas.height)

      const imageData = canvas.toDataURL("image/jpeg", 0.8)
      setCapturedImage(imageData)

      // Simulate face detection/verification
      setTimeout(() => {
        if (mode === "verify" && storedFaceData) {
          // Simulate face verification (in production, this would use actual face recognition)
          const isMatch = Math.random() > 0.2 // 80% success rate for demo
          setVerificationResult(isMatch ? "success" : "failed")
          if (isMatch) {
            setTimeout(() => {
              onCapture(imageData)
            }, 1500)
          }
        } else {
          // Registration mode - just capture
          setVerificationResult("success")
        }
        setIsCapturing(false)
      }, 1500)
    }
  }

  const retakePhoto = () => {
    setCapturedImage(null)
    setVerificationResult(null)
    setIsCapturing(false)
  }

  const confirmCapture = () => {
    if (capturedImage) {
      onCapture(capturedImage)
    }
  }

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <div className="flex justify-center">
          <div className="w-16 h-16 bg-gradient-to-br from-purple-600 to-pink-600 rounded-xl flex items-center justify-center">
            <Camera className="w-8 h-8 text-white" />
          </div>
        </div>
        <h3 className="text-xl font-bold text-gray-900">
          {mode === "register" ? "Reconhecimento Facial" : "Verificação Facial"}
        </h3>
        <p className="text-sm text-gray-600">
          {mode === "register"
            ? "Posicione seu rosto no centro da câmera para capturar sua foto"
            : "Posicione seu rosto para verificar sua identidade"}
        </p>
      </div>

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-3">
          <XCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
          <p className="text-sm text-red-600">{error}</p>
        </div>
      )}

      <div className="relative bg-gray-900 rounded-xl overflow-hidden aspect-[4/3]">
        {!capturedImage ? (
          <>
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className="w-full h-full object-cover"
              onLoadedMetadata={() => {
                if (videoRef.current) {
                  videoRef.current.play()
                }
              }}
            />
            {/* Face guide overlay */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="relative w-64 h-80">
                <div className="absolute inset-0 border-4 border-white/50 rounded-full" />
                <div className="absolute inset-0 border-4 border-transparent border-t-purple-500 border-l-purple-500 rounded-full animate-pulse" />
              </div>
            </div>
            {/* Instructions overlay */}
            <div className="absolute bottom-4 left-0 right-0 text-center">
              <p className="text-white text-sm font-medium bg-black/50 backdrop-blur-sm px-4 py-2 rounded-full inline-block">
                Centralize seu rosto no círculo
              </p>
            </div>
          </>
        ) : (
          <div className="relative w-full h-full">
            <img src={capturedImage || "/placeholder.svg"} alt="Captured face" className="w-full h-full object-cover" />
            {isCapturing && (
              <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                <div className="text-center space-y-3">
                  <RefreshCw className="w-12 h-12 text-white animate-spin mx-auto" />
                  <p className="text-white font-medium">
                    {mode === "verify" ? "Verificando identidade..." : "Processando imagem..."}
                  </p>
                </div>
              </div>
            )}
            {verificationResult === "success" && (
              <div className="absolute inset-0 bg-green-500/20 flex items-center justify-center">
                <div className="text-center space-y-3">
                  <CheckCircle2 className="w-16 h-16 text-green-500 mx-auto" />
                  <p className="text-white font-bold text-lg bg-green-600 px-6 py-2 rounded-full">
                    {mode === "verify" ? "Identidade Verificada!" : "Foto Capturada!"}
                  </p>
                </div>
              </div>
            )}
            {verificationResult === "failed" && (
              <div className="absolute inset-0 bg-red-500/20 flex items-center justify-center">
                <div className="text-center space-y-3">
                  <XCircle className="w-16 h-16 text-red-500 mx-auto" />
                  <p className="text-white font-bold text-lg bg-red-600 px-6 py-2 rounded-full">Verificação Falhou</p>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      <canvas ref={canvasRef} className="hidden" />

      <div className="flex gap-3">
        {!capturedImage ? (
          <>
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              className="flex-1 bg-transparent"
              disabled={isCapturing}
            >
              Cancelar
            </Button>
            <Button
              type="button"
              onClick={capturePhoto}
              className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white"
              disabled={!stream || isCapturing}
            >
              <Camera className="w-4 h-4 mr-2" />
              Capturar Foto
            </Button>
          </>
        ) : (
          <>
            {verificationResult === "failed" ? (
              <>
                <Button
                  type="button"
                  variant="outline"
                  onClick={onCancel}
                  className="flex-1 bg-transparent"
                  disabled={isCapturing}
                >
                  Cancelar
                </Button>
                <Button
                  type="button"
                  onClick={retakePhoto}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
                  disabled={isCapturing}
                >
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Tentar Novamente
                </Button>
              </>
            ) : verificationResult === "success" && mode === "register" ? (
              <>
                <Button
                  type="button"
                  variant="outline"
                  onClick={retakePhoto}
                  className="flex-1 bg-transparent"
                  disabled={isCapturing}
                >
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Tirar Outra
                </Button>
                <Button
                  type="button"
                  onClick={confirmCapture}
                  className="flex-1 bg-green-600 hover:bg-green-700 text-white"
                  disabled={isCapturing}
                >
                  <CheckCircle2 className="w-4 h-4 mr-2" />
                  Confirmar
                </Button>
              </>
            ) : null}
          </>
        )}
      </div>

      {mode === "register" && (
        <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-xs text-blue-800 text-center">
            <strong>Dica:</strong> Certifique-se de estar em um local bem iluminado e olhe diretamente para a câmera
          </p>
        </div>
      )}
    </div>
  )
}
