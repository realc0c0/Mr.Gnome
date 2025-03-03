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
      tasks: {
        Row: {
          id: string
          type: 'youtube' | 'telegram_group' | 'telegram_channel' | 'airdrop'
          title: string
          description: string
          reward: number
          requirements: Json
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          type: 'youtube' | 'telegram_group' | 'telegram_channel' | 'airdrop'
          title: string
          description: string
          reward: number
          requirements: Json
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          type?: 'youtube' | 'telegram_group' | 'telegram_channel' | 'airdrop'
          title?: string
          description?: string
          reward?: number
          requirements?: Json
          created_at?: string
          updated_at?: string
        }
      }
      user_tasks: {
        Row: {
          id: string
          user_id: string
          task_id: string
          completed: boolean
          completed_at: string | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          task_id: string
          completed?: boolean
          completed_at?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          task_id?: string
          completed?: boolean
          completed_at?: string | null
          created_at?: string
        }
      }
      users: {
        Row: {
          id: string
          telegram_id: number
          username: string
          wallet_address: string | null
          referral_code: string
          referred_by: string | null
          last_login: string
          login_streak: number
          rank: number
          total_earned: number
          created_at: string
        }
        Insert: {
          id?: string
          telegram_id: number
          username: string
          wallet_address?: string | null
          referral_code: string
          referred_by?: string | null
          last_login?: string
          login_streak?: number
          rank?: number
          total_earned?: number
          created_at?: string
        }
        Update: {
          id?: string
          telegram_id?: number
          username?: string
          wallet_address?: string | null
          referral_code?: string
          referred_by?: string | null
          last_login?: string
          login_streak?: number
          rank?: number
          total_earned?: number
          created_at?: string
        }
      }
    }
  }
}
