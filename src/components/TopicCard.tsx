'use client'

import { Topic } from '../store/useAppStore'

interface TopicTitleProps {
  topic: Topic | null
  className?: string
}

interface PhrasesProps {
  topic: Topic | null
  className?: string
}

export const TopicTitle: React.FC<TopicTitleProps> = ({ topic, className = '' }) => {
  if (!topic) {
    return (
      <div className={`bg-white/10 backdrop-blur-sm rounded-xl p-4 ${className}`}>
        <div className="animate-pulse">
          <div className="h-6 bg-white/20 rounded"></div>
        </div>
      </div>
    )
  }

  return (
    <div className={`bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20 ${className}`}>
      <h2 className="text-xl font-bold text-white text-center leading-tight">
        {topic.title}
      </h2>
    </div>
  )
}

export const Phrases: React.FC<PhrasesProps> = ({ topic, className = '' }) => {
  if (!topic) {
    return (
      <div className={`bg-white/10 backdrop-blur-sm rounded-xl p-4 ${className}`}>
        <div className="animate-pulse space-y-3">
          <div className="h-4 bg-white/15 rounded"></div>
          <div className="h-4 bg-white/15 rounded"></div>
          <div className="h-4 bg-white/15 rounded"></div>
        </div>
      </div>
    )
  }

  return (
    <div className={`bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20 ${className}`}>
      <div className="space-y-3">
        {topic.examples.map((example, index) => (
          <div 
            key={index}
            className="bg-white/10 rounded-lg p-3 border border-white/10 min-h-[44px] flex items-center"
          >
            <p className="text-indigo-100 text-sm leading-relaxed">
              "{example}"
            </p>
          </div>
        ))}
      </div>
    </div>
  )
}

// 後方互換性のため、既存のTopicCardも残す
interface TopicCardProps {
  topic: Topic | null
  className?: string
}

export const TopicCard: React.FC<TopicCardProps> = ({ topic, className = '' }) => {
  if (!topic) {
    return (
      <div className={`bg-white/10 backdrop-blur-sm rounded-xl p-4 ${className}`}>
        <div className="animate-pulse space-y-4">
          <div className="h-6 bg-white/20 rounded"></div>
          <div className="space-y-3">
            <div className="h-4 bg-white/15 rounded"></div>
            <div className="h-4 bg-white/15 rounded"></div>
            <div className="h-4 bg-white/15 rounded"></div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className={`bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20 ${className}`}>
      {/* トピックタイトル */}
      <h2 className="text-xl font-bold text-white mb-4 text-center leading-tight">
        {topic.title}
      </h2>
      
      {/* 例文リスト */}
      <div className="space-y-3">
        {topic.examples.map((example, index) => (
          <div 
            key={index}
            className="bg-white/10 rounded-lg p-3 border border-white/10 min-h-[44px] flex items-center"
          >
            <p className="text-indigo-100 text-sm leading-relaxed">
              "{example}"
            </p>
          </div>
        ))}
      </div>
    </div>
  )
} 