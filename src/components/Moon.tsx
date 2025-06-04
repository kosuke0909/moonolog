'use client'

import { useAppStore } from '../store/useAppStore'
import { useSpeech } from '../lib/useSpeech'

interface MoonProps {
  className?: string
}

export const Moon: React.FC<MoonProps> = ({ className = '' }) => {
  const { isListening, isRecording } = useAppStore()
  const { startListening, stopListening, isSupported, error } = useSpeech()

  const handleMoonClick = () => {
    if (!isSupported) return
    
    if (isListening) {
      stopListening()
    } else {
      startListening()
    }
  }

  return (
    <div className={`relative ${className}`}>
      {/* 月本体 */}
      <button
        onClick={handleMoonClick}
        disabled={!isSupported}
        className={`
          w-48 h-48 rounded-full relative transition-all duration-300 
          ${isListening 
            ? 'bg-gradient-to-br from-yellow-200 via-yellow-300 to-yellow-400 shadow-2xl' 
            : 'bg-gradient-to-br from-gray-200 via-gray-300 to-gray-400'
          }
          ${isSupported ? 'hover:scale-105 cursor-pointer active:scale-95' : 'cursor-not-allowed opacity-50'}
          focus:outline-none focus:ring-4 focus:ring-yellow-300/30
          touch-manipulation
        `}
      >
        {/* 月のクレーター */}
        <div className="absolute top-8 left-12 w-4 h-4 bg-gray-400 rounded-full opacity-30" />
        <div className="absolute top-16 right-8 w-6 h-6 bg-gray-400 rounded-full opacity-20" />
        <div className="absolute bottom-12 left-8 w-3 h-3 bg-gray-400 rounded-full opacity-25" />
        <div className="absolute top-20 left-20 w-2 h-2 bg-gray-400 rounded-full opacity-35" />
        <div className="absolute bottom-16 right-12 w-3 h-3 bg-gray-400 rounded-full opacity-25" />
      </button>
      
      {/* エラーメッセージのみ表示 */}
      {(error || !isSupported) && (
        <div className="absolute -bottom-12 left-1/2 transform -translate-x-1/2 text-center max-w-xs">
          {error && (
            <p className="text-red-300 text-sm">
              {error}
            </p>
          )}
          
          {!isSupported && (
            <p className="text-indigo-200 text-sm">
              音声認識がサポートされていません
            </p>
          )}
        </div>
      )}
    </div>
  )
} 