'use server'

import { createClient } from '@/lib/supabase/server'
import type { Database } from '@/types/database'

const DISCORD_CHANNEL_ID = '1451123539662077984'

interface DiscordMessage {
  id: string
  content: string
  author_name: string
  author_avatar: string | null
  created_at: string
}

/**
 * Discordの最新メッセージを取得
 */
export async function getLatestDiscordMessages(limit: number = 5): Promise<DiscordMessage[]> {
  try {
    const supabase = await createClient()

    const { data, error } = await supabase
      .from('discord_messages')
      .select('*')
      .eq('channel_id', DISCORD_CHANNEL_ID)
      .order('created_at', { ascending: false })
      .limit(limit)

    if (error) {
      console.error('Error fetching Discord messages:', error)
      return []
    }

    return (data || []) as DiscordMessage[]
  } catch (error) {
    console.error('getLatestDiscordMessages error:', error)
    return []
  }
}

/**
 * Discord APIから直接メッセージを取得してデータベースに保存
 */
export async function syncDiscordMessages() {
  try {
    const botToken = process.env.DISCORD_BOT_TOKEN
    
    if (!botToken) {
      console.error('DISCORD_BOT_TOKEN is not set')
      return { success: false, error: 'Bot token not configured' }
    }

    const response = await fetch(
      `https://discord.com/api/v10/channels/${DISCORD_CHANNEL_ID}/messages?limit=10`,
      {
        headers: {
          Authorization: `Bot ${botToken}`,
        },
        cache: 'no-store'
      }
    )

    if (!response.ok) {
      console.error('Discord API error:', response.status)
      return { success: false, error: 'Failed to fetch from Discord' }
    }

    const messages = await response.json()
    const supabase = await createClient()

    // メッセージをデータベースに保存（upsert）
    type DiscordMessageInsert = Database['public']['Tables']['discord_messages']['Insert']
    
    for (const msg of messages) {
      const messageData: DiscordMessageInsert = {
        id: msg.id,
        content: msg.content || '（添付ファイル）',
        author_name: msg.author.username,
        author_avatar: msg.author.avatar,
        created_at: msg.timestamp,
        channel_id: DISCORD_CHANNEL_ID
      }
      
      // 型アサーションを使用してTypeScriptの型推論の問題を回避
      const { error } = await (supabase
        .from('discord_messages') as any)
        .upsert(messageData, {
          onConflict: 'id'
        })
      
      if (error) {
        console.error('Error upserting message:', error)
      }
    }

    return { success: true }
  } catch (error) {
    console.error('syncDiscordMessages error:', error)
    return { success: false, error: 'Sync failed' }
  }
}

