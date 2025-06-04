import { useState, useCallback, useRef } from 'react'
import { useAppStore } from '../store/useAppStore'

// Web Speech API の型定義
interface SpeechRecognitionErrorEvent extends Event {
  error: string
  message?: string
}

interface SpeechRecognitionEvent extends Event {
  resultIndex: number
  results: SpeechRecognitionResultList
}

interface SpeechRecognitionResultList {
  length: number
  item(index: number): SpeechRecognitionResult
  [index: number]: SpeechRecognitionResult
}

interface SpeechRecognitionResult {
  isFinal: boolean
  length: number
  item(index: number): SpeechRecognitionAlternative
  [index: number]: SpeechRecognitionAlternative
}

interface SpeechRecognitionAlternative {
  transcript: string
  confidence: number
}

interface SpeechRecognition extends EventTarget {
  continuous: boolean
  interimResults: boolean
  lang: string
  start(): void
  stop(): void
  onstart: ((this: SpeechRecognition, ev: Event) => any) | null
  onend: ((this: SpeechRecognition, ev: Event) => any) | null
  onresult: ((this: SpeechRecognition, ev: SpeechRecognitionEvent) => any) | null
  onerror: ((this: SpeechRecognition, ev: SpeechRecognitionErrorEvent) => any) | null
}

interface SpeechRecognitionConstructor {
  new (): SpeechRecognition
}

declare global {
  interface Window {
    SpeechRecognition?: SpeechRecognitionConstructor
    webkitSpeechRecognition?: SpeechRecognitionConstructor
  }
}

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
      const SpeechRecognitionClass = window.SpeechRecognition || window.webkitSpeechRecognition
      if (!SpeechRecognitionClass) {
        setError('音声認識が利用できません')
        return
      }
      
      recognitionRef.current = new SpeechRecognitionClass()
      
      recognitionRef.current.continuous = true
      recognitionRef.current.interimResults = true
      recognitionRef.current.lang = 'en-US'

      recognitionRef.current.onstart = () => {
        setListening(true)
        setRecording(true)
        setError(null)
      }

      recognitionRef.current.onresult = (event: SpeechRecognitionEvent) => {
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

      recognitionRef.current.onerror = (event: SpeechRecognitionErrorEvent) => {
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