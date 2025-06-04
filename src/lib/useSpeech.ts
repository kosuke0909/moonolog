import { useState, useCallback, useRef } from 'react'
import { useAppStore } from '../store/useAppStore'

interface UseSpeechReturn {
  startListening: () => void
  stopListening: () => void
  transcript: string
  isSupported: boolean
  error: string | null
}

export const useSpeech = (): UseSpeechReturn => {
  const [transcript, setTranscript] = useState('')
  const [error, setError] = useState<string | null>(null)
  const recognitionRef = useRef<SpeechRecognition | null>(null)
  
  const { setListening, setRecording, updateStreak } = useAppStore()

  // Web Speech API のサポート確認
  const isSupported = typeof window !== 'undefined' && 
    ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window)

  const startListening = useCallback(() => {
    if (!isSupported) {
      setError('このブラウザは音声認識をサポートしていません')
      return
    }

    try {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
      recognitionRef.current = new SpeechRecognition()
      
      recognitionRef.current.continuous = true
      recognitionRef.current.interimResults = true
      recognitionRef.current.lang = 'en-US'

      recognitionRef.current.onstart = () => {
        setListening(true)
        setRecording(true)
        setError(null)
      }

      recognitionRef.current.onresult = (event) => {
        let finalTranscript = ''
        
        for (let i = event.resultIndex; i < event.results.length; i++) {
          if (event.results[i].isFinal) {
            finalTranscript += event.results[i][0].transcript
          }
        }
        
        if (finalTranscript) {
          setTranscript(finalTranscript)
        }
      }

      recognitionRef.current.onerror = (event) => {
        setError(`音声認識エラー: ${event.error}`)
        setListening(false)
        setRecording(false)
      }

      recognitionRef.current.onend = () => {
        setListening(false)
        setRecording(false)
        // 何か話した場合は習慣記録を更新
        if (transcript.trim()) {
          updateStreak()
        }
      }

      recognitionRef.current.start()
    } catch (err) {
      setError('音声認識の開始に失敗しました')
      setListening(false)
      setRecording(false)
    }
  }, [isSupported, setListening, setRecording, updateStreak, transcript])

  const stopListening = useCallback(() => {
    if (recognitionRef.current) {
      recognitionRef.current.stop()
    }
  }, [])

  return {
    startListening,
    stopListening,
    transcript,
    isSupported,
    error
  }
}

// Web Speech API の型定義
declare global {
  interface Window {
    SpeechRecognition: typeof SpeechRecognition
    webkitSpeechRecognition: typeof SpeechRecognition
  }
} 