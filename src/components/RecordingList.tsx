'use client'

import { useState, useRef } from 'react'
import { useAppStore, Recording } from '../store/useAppStore'

interface RecordingListProps {
  className?: string
}

export const RecordingList: React.FC<RecordingListProps> = ({ className = '' }) => {
  const { recordings, removeRecording } = useAppStore()
  const [playingId, setPlayingId] = useState<string | null>(null)
  const audioRefs = useRef<{ [key: string]: HTMLAudioElement }>({})

  const handlePlay = (recording: Recording) => {
    // 他の音声を停止
    Object.values(audioRefs.current).forEach(audio => {
      if (!audio.paused) {
        audio.pause()
        audio.currentTime = 0
      }
    })

    if (playingId === recording.id) {
      // 同じ録音を再生中の場合は停止
      setPlayingId(null)
      return
    }

    try {
      // Base64データからBlobURLを作成
      const byteCharacters = atob(recording.audioBase64.split(',')[1])
      const byteNumbers = new Array(byteCharacters.length)
      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i)
      }
      const byteArray = new Uint8Array(byteNumbers)
      const audioBlob = new Blob([byteArray], { type: 'audio/webm' })
      const audioURL = URL.createObjectURL(audioBlob)

      const audio = new Audio(audioURL)
      audioRefs.current[recording.id] = audio

      audio.onplay = () => setPlayingId(recording.id)
      audio.onpause = () => setPlayingId(null)
      audio.onended = () => {
        setPlayingId(null)
        // 再生終了時にURLをクリーンアップ
        URL.revokeObjectURL(audioURL)
      }
      audio.onerror = () => {
        console.error('音声の再生に失敗しました')
        setPlayingId(null)
        URL.revokeObjectURL(audioURL)
      }

      audio.play()
    } catch (error) {
      console.error('音声の再生に失敗しました:', error)
      setPlayingId(null)
    }
  }

  const handlePause = () => {
    if (playingId && audioRefs.current[playingId]) {
      audioRefs.current[playingId].pause()
      setPlayingId(null)
    }
  }

  const handleDelete = (id: string) => {
    // 再生中の場合は停止
    if (playingId === id && audioRefs.current[id]) {
      audioRefs.current[id].pause()
      setPlayingId(null)
    }
    
    removeRecording(id)
  }

  if (recordings.length === 0) {
    return (
      <div className={`bg-white/10 backdrop-blur-sm rounded-xl p-3 border border-white/20 ${className}`}>
        <div className="space-y-2">
          {/* 空の状態表示 */}
          <div className="text-center py-2">
            <p className="text-indigo-200 text-xs">
              📝 録音がありません
            </p>
            <p className="text-indigo-300 text-xs mt-1">
              月をタップして録音しましょう
            </p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className={`bg-white/10 backdrop-blur-sm rounded-xl p-3 border border-white/20 ${className}`}>
      <div className="space-y-2">
        {/* 横スクロール再生ボタン */}
        <div className="flex space-x-2 overflow-x-auto scrollbar-thin scrollbar-thumb-white/20 scrollbar-track-transparent pb-1">
          {recordings.map((recording, index) => (
            <div key={recording.id} className="flex-shrink-0 relative">
              {/* 削除ボタン */}
              <button
                onClick={() => handleDelete(recording.id)}
                className="absolute -top-1 -right-1 z-10 w-5 h-5 bg-red-500 hover:bg-red-600 text-white rounded-full text-xs flex items-center justify-center transition-all duration-200 active:scale-95 shadow-md"
              >
                ✕
              </button>
              
              {/* 再生ボタン */}
              {playingId === recording.id ? (
                <button
                  onClick={handlePause}
                  className="flex items-center justify-center w-10 h-10 bg-orange-500 hover:bg-orange-600 text-white rounded-full transition-all duration-200 active:scale-95 shadow-lg"
                >
                  <span className="text-sm">⏸️</span>
                </button>
              ) : (
                <button
                  onClick={() => handlePlay(recording)}
                  className="flex items-center justify-center w-10 h-10 bg-green-500 hover:bg-green-600 text-white rounded-full transition-all duration-200 active:scale-95 shadow-lg"
                >
                  <span className="text-sm">▶️</span>
                </button>
              )}
              
              {/* 録音番号の小さな表示 */}
              <div className="text-center mt-1">
                <span className="text-indigo-200 text-xs">
                  {recordings.length - index}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}