import { Topic } from '../store/useAppStore'

// トピックデータを読み込み
export const loadTopics = async (): Promise<Topic[]> => {
  try {
    const response = await fetch('/topics.json')
    const data = await response.json()
    return data.topics
  } catch (error) {
    console.error('トピックの読み込みに失敗しました:', error)
    return []
  }
}

// 今日のトピックを取得（日付ベースで一意）
export const getTodaysTopic = async (): Promise<Topic | null> => {
  const topics = await loadTopics()
  if (topics.length === 0) return null
  
  // 日付を基にしたシード値でトピックを選択
  const today = new Date()
  const seed = today.getFullYear() * 10000 + (today.getMonth() + 1) * 100 + today.getDate()
  const topicIndex = seed % topics.length
  
  return topics[topicIndex]
}

// ランダムトピックを取得
export const getRandomTopic = async (): Promise<Topic | null> => {
  const topics = await loadTopics()
  if (topics.length === 0) return null
  
  const randomIndex = Math.floor(Math.random() * topics.length)
  return topics[randomIndex]
} 