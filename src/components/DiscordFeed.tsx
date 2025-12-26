"use client"

import { useEffect, useState, useRef } from "react"
import { getLatestDiscordMessages, syncDiscordMessages } from "@/actions/discord"

interface DiscordMessage {
  id: string
  content: string
  author_name: string
  author_avatar: string | null
  created_at: string
}

export function DiscordFeed() {
  const [messages, setMessages] = useState<DiscordMessage[]>([])
  const [loading, setLoading] = useState(true)
  const scrollContainerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const fetchMessages = async () => {
      // まずDiscord APIから最新データを取得
      await syncDiscordMessages()
      
      // データベースからメッセージを取得
      const data = await getLatestDiscordMessages(5)
      // 時系列順（古い順）にソートして、新しいメッセージが下に来るようにする
      const sortedData = [...data].sort((a, b) => 
        new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
      )
      setMessages(sortedData)
      setLoading(false)
    }

    fetchMessages()
    
    // 15秒ごとに更新
    const interval = setInterval(fetchMessages, 15000)
    return () => clearInterval(interval)
  }, [])

  // メッセージが更新されたら自動的にスクロールを下に移動
  useEffect(() => {
    if (scrollContainerRef.current && messages.length > 0) {
      scrollContainerRef.current.scrollTop = scrollContainerRef.current.scrollHeight
    }
  }, [messages])

  if (loading) {
    return (
      <div className="text-center py-4">
        <div className="text-gray-400 text-sm">読み込み中...</div>
      </div>
    )
  }

  if (messages.length === 0) {
    return (
      <div className="text-center py-4">
        <div className="text-gray-400 text-sm">まだメッセージがありません</div>
      </div>
    )
  }

  return (
    <div 
      ref={scrollContainerRef}
      className="space-y-3 max-h-96 overflow-y-auto"
    >
      {messages.map((msg) => (
        <div key={msg.id} className="glass-effect rounded-lg p-3 hover:bg-white/5 transition">
          <div className="flex items-start gap-3">
            {/* ユーザーアバター */}
            <div className="flex-shrink-0">
              {msg.author_avatar ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={`https://cdn.discordapp.com/avatars/${msg.author_avatar}`}
                  alt={msg.author_name}
                  className="w-8 h-8 rounded-full"
                />
              ) : (
                <div className="w-8 h-8 rounded-full bg-indigo-500 flex items-center justify-center text-white text-sm font-bold">
                  {msg.author_name[0].toUpperCase()}
                </div>
              )}
            </div>

            {/* メッセージ内容 */}
            <div className="flex-1 min-w-0">
              <div className="flex items-baseline gap-2 mb-1">
                <span className="font-semibold text-white text-sm">
                  {msg.author_name}
                </span>
                <span className="text-xs text-gray-500">
                  {new Date(msg.created_at).toLocaleTimeString('ja-JP', {
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </span>
              </div>
              <p className="text-gray-300 text-sm break-words whitespace-pre-wrap">
                {msg.content}
              </p>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}



