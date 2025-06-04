import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'

export interface Topic {
  id: number
  title: string
  description: string
  examples: string[]
}

interface AppStore {
  // 録音状態
  isListening: boolean
  isRecording: boolean
  
  // 習慣記録
  streak: number
  lastSpokenDate: string | null
  totalSessions: number
  
  // 現在のトピック
  currentTopic: Topic | null
  
  // Hydration状態
  hasHydrated: boolean
  
  // アクション
  setListening: (listening: boolean) => void
  setRecording: (recording: boolean) => void
  setCurrentTopic: (topic: Topic) => void
  updateStreak: () => void
  resetStreak: () => void
  setHasHydrated: (hasHydrated: boolean) => void
}

export const useAppStore = create<AppStore>()(
  persist(
    (set, get) => ({
      // 初期状態
      isListening: false,
      isRecording: false,
      streak: 0,
      lastSpokenDate: null,
      totalSessions: 0,
      currentTopic: null,
      hasHydrated: false,

      // アクション
      setListening: (listening: boolean) => set({ isListening: listening }),
      
      setRecording: (recording: boolean) => set({ isRecording: recording }),
      
      setCurrentTopic: (topic: Topic) => set({ currentTopic: topic }),
      
      updateStreak: () => {
        const today = new Date().toDateString()
        const { lastSpokenDate, streak, totalSessions } = get()
        
        if (lastSpokenDate !== today) {
          const yesterday = new Date()
          yesterday.setDate(yesterday.getDate() - 1)
          
          const newStreak = lastSpokenDate === yesterday.toDateString() 
            ? streak + 1 
            : 1
            
          set({
            streak: newStreak,
            lastSpokenDate: today,
            totalSessions: totalSessions + 1
          })
        }
      },
      
      resetStreak: () => set({ 
        streak: 0, 
        lastSpokenDate: null, 
        totalSessions: 0 
      }),
      
      setHasHydrated: (hasHydrated: boolean) => set({ hasHydrated })
    }),
    {
      name: 'moonolog-storage',
      storage: createJSONStorage(() => {
        if (typeof window !== 'undefined') {
          return localStorage
        }
        return {
          getItem: () => null,
          setItem: () => {},
          removeItem: () => {}
        }
      }),
      partialize: (state) => ({
        streak: state.streak,
        lastSpokenDate: state.lastSpokenDate,
        totalSessions: state.totalSessions
      }),
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true)
      }
    }
  )
) 