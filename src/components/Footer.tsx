'use client'

import { useStreak } from '../lib/useStreak'
import { useAppStore } from '../store/useAppStore'

interface FooterProps {
  className?: string
}

export const Footer: React.FC<FooterProps> = ({ className = '' }) => {
  const { streak, totalSessions, isCompletedToday } = useStreak()
  const hasHydrated = useAppStore((state) => state.hasHydrated)

  // Hydration前は初期値を表示
  const displayStreak = hasHydrated ? streak : 0
  const displayTotalSessions = hasHydrated ? totalSessions : 0
  const displayIsCompleted = hasHydrated ? isCompletedToday : false

  return (
    <footer className={`text-center ${className}`}>
      <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
        {/* 習慣記録 */}
        <div className="flex justify-center items-center space-x-6">
          <div className="text-center">
            <div className="text-xl font-bold text-white mb-1">
              {displayStreak}
            </div>
            <div className="text-xs text-indigo-200">
              連続日数
            </div>
          </div>
          
          <div className={`w-2.5 h-2.5 rounded-full ${
            displayIsCompleted ? 'bg-green-400' : 'bg-white/30'
          }`} />
          
          <div className="text-center">
            <div className="text-xl font-bold text-white mb-1">
              {displayTotalSessions}
            </div>
            <div className="text-xs text-indigo-200">
              総回数
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
} 