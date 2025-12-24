export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      venues: {
        Row: {
          id: string
          name: string
          created_at: string
        }
        Insert: {
          id: string
          name: string
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          created_at?: string
        }
      }
      users: {
        Row: {
          id: string
          nickname: string
          instagram_id: string | null
          icon_image_url: string
          ticket_paid: boolean
          created_at: string
        }
        Insert: {
          id?: string
          nickname: string
          instagram_id?: string | null
          icon_image_url: string
          ticket_paid?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          nickname?: string
          instagram_id?: string | null
          icon_image_url?: string
          ticket_paid?: boolean
          created_at?: string
        }
      }
      visit_logs: {
        Row: {
          id: number
          user_id: string
          venue_id: string
          created_at: string
        }
        Insert: {
          id?: number
          user_id: string
          venue_id: string
          created_at?: string
        }
        Update: {
          id?: number
          user_id?: string
          venue_id?: string
          created_at?: string
        }
      }
      photos: {
        Row: {
          id: number
          user_id: string
          image_url: string
          approved: boolean
          created_at: string
        }
        Insert: {
          id?: number
          user_id: string
          image_url: string
          approved?: boolean
          created_at?: string
        }
        Update: {
          id?: number
          user_id?: string
          image_url?: string
          approved?: boolean
          created_at?: string
        }
      }
    }
    Views: {}
    Functions: {}
    Enums: {}
  }
}

// 便利な型エイリアス
export type Venue = Database['public']['Tables']['venues']['Row']
export type User = Database['public']['Tables']['users']['Row']
export type VisitLog = Database['public']['Tables']['visit_logs']['Row']
export type Photo = Database['public']['Tables']['photos']['Row']

// 拡張型
export type UserWithCurrentVenue = User & {
  current_venue_id?: string
  current_venue_name?: string
}

export type VenueWithCount = Venue & {
  current_count: number
}

export type VisitLogWithDetails = VisitLog & {
  user: Pick<User, 'nickname' | 'icon_image_url'>
  venue: Pick<Venue, 'name'>
}

export type PhotoWithUser = Photo & {
  user: Pick<User, 'nickname' | 'instagram_id'>
}

