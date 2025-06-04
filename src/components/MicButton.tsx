'use client'

import { useSpeech } from '../lib/useSpeech'
import { useAppStore } from '../store/useAppStore'

interface MicButtonProps {
  className?: string
}

export const MicButton: React.FC<MicButtonProps> = ({ className = '' }) => {
  const { startListening, stopListening, isSupported, error } = useSpeech()
  const { isListening, isRecording } = useAppStore()

  const handleMicClick = () => {
    if (isListening) {
      stopListening()
    } else {
      startListening()
    }
  }

  if (!isSupported) {
    return (
      <div className={`text-center ${className}`}>
        <div className="bg-white/20 rounded-full p-6 mb-4 cursor-not-allowed">
          <svg 
            className="w-12 h-12 text-white/50" 
            fill="currentColor" 
            viewBox="0 0 20 20"
          >
            <path fillRule="evenodd" d="M13.477 14.89A6 6 0 015.11 6.524l8.367 8.368zm1.414-1.414L6.524 5.11a6 6 0 018.367 8.367zM18 10a8 8 0 11-16 0 8 8 0 0116 0z" clipRule="evenodd" />
          </svg>
        </div>
        <p className="text-sm text-indigo-200">
          音声認識がサポートされていません
        </p>
      </div>
    )
  }

  return (
    <div className={`text-center ${className}`}>
      {/* マイクボタン */}
      <button
        onClick={handleMicClick}
        className={`
          relative rounded-full p-6 transition-all duration-300 shadow-lg
          ${isListening 
            ? 'bg-red-500 hover:bg-red-600 scale-110' 
            : 'bg-blue-500 hover:bg-blue-600 hover:scale-105'
          }
          ${isRecording ? 'animate-pulse' : ''}
          focus:outline-none focus:ring-4 focus:ring-blue-300/50
        `}
      >
        {/* マイクアイコン */}
        <svg 
          className="w-12 h-12 text-white"
          fill="currentColor" 
          viewBox="0 0 20 20"
        >
          <path 
            fillRule="evenodd" 
            d="M7 4a3 3 0 016 0v4a3 3 0 11-6 0V4zm4 10.93A7.001 7.001 0 0017 8a1 1 0 10-2 0A5 5 0 015 8a1 1 0 00-2 0 7.001 7.001 0 006 6.93V17H6a1 1 0 100 2h8a1 1 0 100-2h-3v-2.07z" 
            clipRule="evenodd" 
          />
        </svg>
        
        {/* 録音中の波形エフェクト */}
        {isRecording && (
          <div className="absolute inset-0 rounded-full">
            <div className="absolute inset-0 rounded-full bg-red-400 opacity-30 animate-ping" />
            <div className="absolute inset-2 rounded-full bg-red-300 opacity-40 animate-ping delay-75" />
          </div>
        )}
      </button>
      
      {/* ステータステキスト */}
      <div className="mt-4">
        <p className={`text-lg font-medium transition-colors duration-300 ${
          isListening ? 'text-red-300' : 'text-white'
        }`}>
          {isListening ? '🎤 録音中' : '🎤 タップして話す'}
        </p>
        
        {error && (
          <p className="text-red-300 text-sm mt-2">
            {error}
          </p>
        )}
      </div>
    </div>
  )
} 