import WebApp from '@twa-dev/sdk';
import axios from 'axios';
import { supabase } from '../utils/supabase';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

// Validate Telegram WebApp init data
const validateInitData = async () => {
  try {
    const response = await axios.post(`${API_BASE_URL}/auth/validate`, {
      initData: WebApp.initData
    });
    return response.data;
  } catch (error) {
    console.error('Failed to validate init data:', error);
    throw error;
  }
};

// Initialize user session
const initializeSession = async () => {
  try {
    const validationResult = await validateInitData();
    if (!validationResult.valid) {
      throw new Error('Invalid init data');
    }

    const telegramUser = WebApp.initDataUnsafe.user;
    if (!telegramUser) {
      throw new Error('No user data available');
    }

    // Check if user exists in Supabase
    const { data: existingUser, error: fetchError } = await supabase
      .from('users')
      .select('*')
      .eq('telegram_id', telegramUser.id)
      .single();

    if (fetchError && fetchError.code !== 'PGRST116') { // PGRST116 is "not found"
      throw fetchError;
    }

    if (!existingUser) {
      // Create new user
      const { data: newUser, error: createError } = await supabase
        .from('users')
        .insert({
          telegram_id: telegramUser.id,
          username: telegramUser.username || `user_${telegramUser.id}`,
          referral_code: generateReferralCode(),
          last_login: new Date().toISOString()
        })
        .select()
        .single();

      if (createError) throw createError;
      return newUser;
    } else {
      // Update last login and streak
      const now = new Date();
      const lastLogin = new Date(existingUser.last_login);
      const daysSinceLastLogin = Math.floor((now.getTime() - lastLogin.getTime()) / (1000 * 60 * 60 * 24));
      
      const { data: updatedUser, error: updateError } = await supabase
        .from('users')
        .update({
          last_login: now.toISOString(),
          login_streak: daysSinceLastLogin === 1 
            ? existingUser.login_streak + 1 
            : daysSinceLastLogin > 1 ? 1 : existingUser.login_streak
        })
        .eq('id', existingUser.id)
        .select()
        .single();

      if (updateError) throw updateError;
      return updatedUser;
    }
  } catch (error) {
    console.error('Failed to initialize session:', error);
    throw error;
  }
};

// Generate unique referral code
const generateReferralCode = () => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let code = '';
  for (let i = 0; i < 6; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
};

// Handle MainButton clicks
const setupMainButton = (options: {
  text: string;
  color?: string;
  textColor?: string;
  onClick: () => void;
}) => {
  const { MainButton } = WebApp;
  MainButton.setText(options.text);
  if (options.color) MainButton.setBackgroundColor(options.color);
  if (options.textColor) MainButton.setTextColor(options.textColor);
  MainButton.onClick(options.onClick);
  MainButton.show();

  return () => {
    MainButton.offClick(options.onClick);
    MainButton.hide();
  };
};

// Handle back button
const setupBackButton = (onBack: () => void) => {
  const { BackButton } = WebApp;
  BackButton.onClick(onBack);
  BackButton.show();

  return () => {
    BackButton.offClick(onBack);
    BackButton.hide();
  };
};

// Handle haptic feedback
const hapticFeedback = {
  success: () => WebApp.HapticFeedback.notificationOccurred('success'),
  warning: () => WebApp.HapticFeedback.notificationOccurred('warning'),
  error: () => WebApp.HapticFeedback.notificationOccurred('error'),
  impact: () => WebApp.HapticFeedback.impactOccurred('medium')
};

export const TelegramService = {
  validateInitData,
  initializeSession,
  setupMainButton,
  setupBackButton,
  hapticFeedback
};
