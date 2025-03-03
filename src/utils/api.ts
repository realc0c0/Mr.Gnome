import { supabase } from './supabase';

// API endpoints
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

// Check if we're using Supabase URL
const isSupabaseUrl = API_BASE_URL?.includes('supabase.co');

export const api = {
  // Test connection
  async testConnection() {
    if (isSupabaseUrl) {
      const { data, error } = await supabase.from('health_check').select('*');
      if (error) throw error;
      return { status: 'ok', message: 'Connected to Supabase' };
    } else {
      const response = await fetch(`${API_BASE_URL}/health`);
      return response.json();
    }
  },

  // Game related API calls
  async getUserStats(userId: string) {
    if (isSupabaseUrl) {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', userId)
        .single();
      if (error) throw error;
      return data;
    } else {
      const response = await fetch(`${API_BASE_URL}/users/${userId}/stats`);
      return response.json();
    }
  },

  // Add more API methods as needed
};

// Export base URL for other uses
export const getApiBaseUrl = () => API_BASE_URL;
