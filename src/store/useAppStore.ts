import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'

export interface Topic {
  id: number
  title: string
  description: string
  examples: string[]
}

export interface Recording {
  id: string
  audioBase64: string
  timestamp: number
  duration: number
  topicTitle: string
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
  
  // 録音データ
  recordings: Recording[]
  
  // デバッグモード
  isDebugMode: boolean
  
  // アクション
  setListening: (listening: boolean) => void
  setRecording: (recording: boolean) => void
  setCurrentTopic: (topic: Topic) => void
  updateStreak: () => void
  resetStreak: () => void
  setHasHydrated: (hasHydrated: boolean) => void
  
  // 録音データのアクション
  addRecording: (audioBase64: string, duration: number) => void
  removeRecording: (id: string) => void
  clearAllRecordings: () => void
  
  // デバッグモードのアクション
  toggleDebugMode: () => void
  setDebugMode: (debugMode: boolean) => void
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
      recordings: [],
      isDebugMode: false,

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
      
      setHasHydrated: (hasHydrated: boolean) => set({ hasHydrated }),
      
      // 録音データのアクション
      addRecording: (audioBase64: string, duration: number) => {
        const { recordings, currentTopic } = get()
        const newRecording: Recording = {
          id: Date.now().toString(),
          audioBase64,
          timestamp: Date.now(),
          duration,
          topicTitle: currentTopic?.title || 'Unknown Topic'
        }
        
        // 最大5個まで保存（古いものから削除）
        const updatedRecordings = [newRecording, ...recordings].slice(0, 5)
        
        set({ recordings: updatedRecordings })
      },
      
      removeRecording: (id: string) => {
        const { recordings } = get()
        const updatedRecordings = recordings.filter(recording => recording.id !== id)
        set({ recordings: updatedRecordings })
      },
      
      clearAllRecordings: () => set({ recordings: [] }),
      
      // デバッグモードのアクション
      toggleDebugMode: () => set({ isDebugMode: !get().isDebugMode }),
      
      setDebugMode: (debugMode: boolean) => set({ isDebugMode: debugMode })
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
        totalSessions: state.totalSessions,
        recordings: state.recordings
      }),
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true)
      }
    }
  )
) 