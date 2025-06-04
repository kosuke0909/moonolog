import { useEffect } from 'react'
import { useAppStore } from '../store/useAppStore'

interface UseStreakReturn {
  streak: number
  totalSessions: number
  isCompletedToday: boolean
  markAsCompleted: () => void
  resetStreak: () => void
}

export const useStreak = (): UseStreakReturn => {
  const { 
    streak, 
    totalSessions, 
    lastSpokenDate, 
    updateStreak, 
    resetStreak,
    hasHydrated
  } = useAppStore()

  // 今日完了したかどうかを判定（Hydration後のみ）
  const isCompletedToday = hasHydrated && lastSpokenDate === new Date().toDateString()

  // セッション完了をマーク
  const markAsCompleted = () => {
    updateStreak()
  }

  // 連続記録が途切れていないかチェック（Hydration後のみ）
  useEffect(() => {
    if (hasHydrated && lastSpokenDate) {
      const lastDate = new Date(lastSpokenDate)
      const today = new Date()
      const daysDiff = Math.floor((today.getTime() - lastDate.getTime()) / (1000 * 60 * 60 * 24))
      
      // 2日以上空いた場合は連続記録をリセット
      if (daysDiff > 1) {
        resetStreak()
      }
    }
  }, [hasHydrated, lastSpokenDate, resetStreak])

  return {
    streak: hasHydrated ? streak : 0,
    totalSessions: hasHydrated ? totalSessions : 0,
    isCompletedToday,
    markAsCompleted,
    resetStreak
  }
} 