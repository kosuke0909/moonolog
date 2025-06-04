'use client'

import { useSpeech } from '../lib/useSpeech'
import { useAppStore } from '../store/useAppStore'

interface RecordingDebugProps {
  className?: string
}

export const RecordingDebug: React.FC<RecordingDebugProps> = ({ className = '' }) => {
  const { isListening, isRecording } = useAppStore()
  const { transcript, error, isSupported } = useSpeech()

  return (
    <div className={`bg-black/20 backdrop-blur-sm rounded-xl p-4 border border-white/10 ${className}`}>
      <div className="space-y-3">
        <h3 className="text-white font-semibold text-sm">🎤 録音デバッグ情報</h3>
        
        {/* サポート状況 */}
        <div className="flex items-center space-x-2">
          <span className="text-gray-300 text-xs">サポート:</span>
          <span className={`text-xs px-2 py-1 rounded ${
            isSupported 
              ? 'bg-green-500/20 text-green-300' 
              : 'bg-red-500/20 text-red-300'
          }`}>
            {isSupported ? '✓ 対応' : '✗ 非対応'}
          </span>
        </div>

        {/* 録音状態 */}
        <div className="flex items-center space-x-2">
          <span className="text-gray-300 text-xs">状態:</span>
          <span className={`text-xs px-2 py-1 rounded ${
            isListening 
              ? 'bg-yellow-500/20 text-yellow-300' 
              : 'bg-gray-500/20 text-gray-300'
          }`}>
            {isListening ? '🎙️ 録音中' : '⏸️ 停止中'}
          </span>
        </div>

        {/* エラー表示 */}
        {error && (
          <div className="bg-red-500/10 border border-red-500/20 rounded p-2">
            <span className="text-red-300 text-xs">❌ {error}</span>
          </div>
        )}

        {/* transcript表示 */}
        <div className="space-y-1">
          <span className="text-gray-300 text-xs">認識結果:</span>
          <div className="bg-white/5 rounded p-2 min-h-[40px] border border-white/10">
            {transcript ? (
              <p className="text-white text-xs leading-relaxed">"{transcript}"</p>
            ) : (
              <p className="text-gray-400 text-xs italic">まだ音声が認識されていません</p>
            )}
          </div>
        </div>

        {/* リアルタイム更新インジケーター */}
        {isListening && (
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
            <span className="text-gray-300 text-xs">リアルタイム認識中...</span>
          </div>
        )}
      </div>
    </div>
  )
} 