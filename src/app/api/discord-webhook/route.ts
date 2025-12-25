import { createClient } from '@/lib/supabase/server'
import type { Database } from '@/types/database'
import { NextResponse } from 'next/server'

/**
 * Discord Webhookを受け取るエンドポイント
 * Discordのチャンネルで新しいメッセージが投稿されたときに呼ばれる
 */
export async function POST(request: Request) {
  try {
    const body = await request.json()

    // Discordからのメッセージデータを取得
    const { id, content, author, timestamp, channel_id } = body

    // Bot自身のメッセージは無視
    if (author.bot) {
      return NextResponse.json({ success: true, message: 'Bot message ignored' })
    }

    const supabase = await createClient()

    // メッセージをデータベースに保存
    type DiscordMessageInsert = Database['public']['Tables']['discord_messages']['Insert']
    
    const messageData: DiscordMessageInsert = {
      id,
      content: content || '（添付ファイル）',
      author_name: author.username,
      author_avatar: author.avatar,
      created_at: timestamp,
      channel_id
    }

    // 型アサーションを使用してTypeScriptの型推論の問題を回避
    const { error } = await (supabase
      .from('discord_messages') as any)
      .insert(messageData)

    if (error) {
      console.error('Error saving Discord message:', error)
      return NextResponse.json({ success: false, error: error.message }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Discord webhook error:', error)
    return NextResponse.json({ success: false, error: 'Internal error' }, { status: 500 })
  }
}

