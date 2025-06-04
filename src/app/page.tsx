'use client'

import { useEffect, useState } from 'react'
import { Moon } from '../components/Moon'
import { TopicTitle, Phrases } from '../components/TopicCard'
import { Footer } from '../components/Footer'
import { useAppStore } from '../store/useAppStore'
import { getTodaysTopic } from '../lib/topics'

interface Star {
  id: number
  top: string
  left: string
  opacity: number
}

export default function Home() {
  const { currentTopic, setCurrentTopic } = useAppStore()
  const [stars, setStars] = useState<Star[]>([])
  const [mounted, setMounted] = useState(false)

  // クライアントサイドでのマウント確認
  useEffect(() => {
    setMounted(true)
  }, [])

  // 星を生成（クライアントサイドのみ）
  useEffect(() => {
    if (mounted) {
      const newStars: Star[] = Array.from({ length: 15 }, (_, i) => ({
        id: i,
        top: `${Math.random() * 100}%`,
        left: `${Math.random() * 100}%`,
        opacity: Math.random() * 0.8 + 0.2,
      }))
      setStars(newStars)
    }
  }, [mounted])

  // アプリ起動時に今日のトピックを読み込み
  useEffect(() => {
    const loadTodaysTopic = async () => {
      const topic = await getTodaysTopic()
      if (topic) {
        setCurrentTopic(topic)
      }
    }
    
    loadTodaysTopic()
  }, [setCurrentTopic])

  if (!mounted) {
    return null
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-900 via-purple-900 to-pink-900">
      {/* 背景の星々 */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {stars.map((star) => (
          <div
            key={star.id}
            className="absolute w-1 h-1 bg-white rounded-full"
            style={{
              top: star.top,
              left: star.left,
              opacity: star.opacity,
            }}
          />
        ))}
      </div>

      <div className="relative z-10 min-h-screen flex flex-col">
        {/* メインコンテンツ */}
        <main className="flex-1 flex flex-col items-center justify-center px-4 py-8 space-y-12">
          {/* トピック */}
          <div className="w-full max-w-sm">
            <TopicTitle topic={currentTopic} />
          </div>
          
          {/* 月 */}
          <div className="flex-shrink-0">
            <Moon />
          </div>
          
          {/* フレーズ */}
          <div className="w-full max-w-sm">
            <Phrases topic={currentTopic} />
          </div>
        </main>

        {/* フッター */}
        <div className="px-4 pb-8">
          <Footer />
        </div>
      </div>
    </div>
  )
}
