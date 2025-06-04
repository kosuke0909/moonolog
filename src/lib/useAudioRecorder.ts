import { useState, useCallback, useRef } from 'react'

interface UseAudioRecorderReturn {
  startRecording: () => Promise<void>
  stopRecording: () => void
  playRecording: () => void
  pauseRecording: () => void
  isRecording: boolean
  isPlaying: boolean
  audioURL: string | null
  audioBase64: string | null
  recordingDuration: number
  error: string | null
  isSupported: boolean
}

export const useAudioRecorder = (): UseAudioRecorderReturn => {
  const [isRecording, setIsRecording] = useState(false)
  const [isPlaying, setIsPlaying] = useState(false)
  const [audioURL, setAudioURL] = useState<string | null>(null)
  const [audioBase64, setAudioBase64] = useState<string | null>(null)
  const [recordingDuration, setRecordingDuration] = useState(0)
  const [error, setError] = useState<string | null>(null)
  
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const audioChunksRef = useRef<Blob[]>([])
  const timerRef = useRef<NodeJS.Timeout | null>(null)

  // MediaRecorder API のサポート確認
  const isSupported = typeof window !== 'undefined' && 
    'MediaRecorder' in window && 
    navigator.mediaDevices && 
    typeof navigator.mediaDevices.getUserMedia === 'function'

  // BlobをBase64に変換する関数
  const blobToBase64 = (blob: Blob): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = () => {
        const result = reader.result as string
        resolve(result)
      }
      reader.onerror = reject
      reader.readAsDataURL(blob)
    })
  }

  const startRecording = useCallback(async () => {
    if (!isSupported) {
      setError('このブラウザは音声録音をサポートしていません')
      return
    }

    try {
      // 既存の録音データをクリア
      audioChunksRef.current = []
      setAudioURL(null)
      setAudioBase64(null)
      setRecordingDuration(0)
      setError(null)

      // マイクへのアクセス許可を取得
      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          sampleRate: 44100,
        } 
      })

      // MediaRecorderを作成
      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: 'audio/webm;codecs=opus'
      })
      mediaRecorderRef.current = mediaRecorder

      // 録音データを収集
      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data)
        }
      }

      // 録音停止時の処理
      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' })
        const url = URL.createObjectURL(audioBlob)
        setAudioURL(url)
        
        // Base64に変換
        try {
          const base64Data = await blobToBase64(audioBlob)
          setAudioBase64(base64Data)
        } catch (err) {
          console.error('Base64変換に失敗しました:', err)
        }
        
        // ストリームを停止
        stream.getTracks().forEach(track => track.stop())
        setIsRecording(false)
        
        // タイマーを停止
        if (timerRef.current) {
          clearInterval(timerRef.current)
          timerRef.current = null
        }
      }

      // 録音開始
      mediaRecorder.start(100) // 100msごとにデータを収集
      setIsRecording(true)

      // 録音時間をカウント
      const startTime = Date.now()
      timerRef.current = setInterval(() => {
        const elapsed = Math.floor((Date.now() - startTime) / 1000)
        setRecordingDuration(elapsed)
      }, 1000)

    } catch (err) {
      setError('マイクへのアクセスが拒否されました')
      setIsRecording(false)
    }
  }, [isSupported])

  const stopRecording = useCallback(() => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop()
    }
  }, [isRecording])

  const playRecording = useCallback(() => {
    if (!audioURL) {
      setError('再生する音声がありません')
      return
    }

    try {
      // 既存のオーディオを停止
      if (audioRef.current) {
        audioRef.current.pause()
        audioRef.current.currentTime = 0
      }

      // 新しいオーディオ要素を作成
      const audio = new Audio(audioURL)
      audioRef.current = audio

      audio.onplay = () => setIsPlaying(true)
      audio.onpause = () => setIsPlaying(false)
      audio.onended = () => setIsPlaying(false)
      audio.onerror = () => {
        setError('音声の再生に失敗しました')
        setIsPlaying(false)
      }

      audio.play()
    } catch (err) {
      setError('音声の再生に失敗しました')
      setIsPlaying(false)
    }
  }, [audioURL])

  const pauseRecording = useCallback(() => {
    if (audioRef.current && isPlaying) {
      audioRef.current.pause()
    }
  }, [isPlaying])

  return {
    startRecording,
    stopRecording,
    playRecording,
    pauseRecording,
    isRecording,
    isPlaying,
    audioURL,
    audioBase64,
    recordingDuration,
    error,
    isSupported
  }
} 