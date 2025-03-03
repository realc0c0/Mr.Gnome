import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { GameState } from '../types/game';
import { TelegramService } from '../services/telegram';
import { supabase } from '../utils/supabase';
import WebApp from '@twa-dev/sdk';
import { handleError, throwAppError, errorCodes } from '../utils/errorHandler';
import { rateLimiter, rateLimits, cache } from '../utils/rateLimit';

interface GameContextType {
  gameState: GameState | null;
  loading: boolean;
  error: string | null;
  updateGameState: (updates: Partial<GameState>) => Promise<void>;
  refreshGame: () => Promise<void>;
}

const GameContext = createContext<GameContextType | undefined>(undefined);

export const GameProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [gameState, setGameState] = useState<GameState | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const initializeGame = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      // Check cache first
      const cachedState = cache.get<GameState>('gameState');
      if (cachedState) {
        setGameState(cachedState);
        setLoading(false);
        return;
      }

      // Initialize Telegram session
      const user = await TelegramService.initializeSession();

      // Fetch user's game state
      const { data: gameData, error: gameError } = await supabase
        .from('users')
        .select(`
          *,
          assets:user_assets(*),
          boosters:user_boosters(*),
          mines:user_mines(*)
        `)
        .eq('id', user.id)
        .single();

      if (gameError) {
        throwAppError(errorCodes.INIT_FAILED, 'Failed to load game data');
      }

      const newGameState = {
        user: {
          id: gameData.id,
          telegramId: gameData.telegram_id,
          username: gameData.username,
          walletAddress: gameData.wallet_address,
          referralCode: gameData.referral_code,
          referredBy: gameData.referred_by,
          lastLoginDate: new Date(gameData.last_login),
          loginStreak: gameData.login_streak,
          rank: gameData.rank,
          totalEarned: gameData.total_earned
        },
        assets: gameData.assets || [],
        boosters: gameData.boosters || [],
        mines: gameData.mines || [],
        tasks: [],
        tapPower: calculateTapPower(gameData),
        lastTapTime: new Date(),
        spinAvailable: isSpinAvailable(gameData.last_spin),
        lastSpinTime: gameData.last_spin ? new Date(gameData.last_spin) : new Date()
      };

      setGameState(newGameState);
      cache.set('gameState', newGameState, 60000); // Cache for 1 minute

      // Show welcome message for new users
      if (!gameData.wallet_address) {
        WebApp.showPopup({
          title: 'Welcome to Mr.Gnome! 🎅',
          message: 'Connect your TON wallet to start earning tokens!'
        });
      }

    } catch (err) {
      handleError(err);
      setError('Failed to initialize game');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    initializeGame();
    setupRealtimeSubscription();
  }, []);

  const setupRealtimeSubscription = () => {
    const userSubscription = supabase
      .channel('game_state_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'users',
          filter: `telegram_id=eq.${WebApp.initDataUnsafe.user.id}`
        },
        () => {
          initializeGame();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(userSubscription);
    };
  };

  const calculateTapPower = (userData: any) => {
    let power = 1;
    // Add multipliers from boosters, rank, etc.
    power *= 1 + (userData.rank * 0.1);
    power *= userData.boosters?.reduce((acc: number, b: any) => acc + b.multiplier, 1) || 1;
    return power;
  };

  const isSpinAvailable = (lastSpin: string | null) => {
    if (!lastSpin) return true;
    const now = new Date();
    const lastSpinDate = new Date(lastSpin);
    return now.getDate() !== lastSpinDate.getDate();
  };

  const updateGameState = useCallback(async (updates: Partial<GameState>) => {
    try {
      if (!gameState) return;

      // Check rate limiting for certain actions
      if (updates.lastTapTime && !rateLimiter.check('tap', rateLimits.tap)) {
        throwAppError(errorCodes.RATE_LIMIT_EXCEEDED, 'Tapping too fast! Please slow down.');
      }

      // Update local state
      const newState = { ...gameState, ...updates };
      setGameState(newState);
      cache.set('gameState', newState, 60000);

      // Update database
      const { error } = await supabase
        .from('users')
        .update({
          total_earned: updates.user?.totalEarned,
          rank: updates.user?.rank,
          // Add other fields as needed
        })
        .eq('telegram_id', WebApp.initDataUnsafe.user.id);

      if (error) {
        throwAppError(errorCodes.NETWORK_ERROR, 'Failed to save progress');
      }
    } catch (err) {
      handleError(err);
      // Revert local state on error
      initializeGame();
    }
  }, [gameState, initializeGame]);

  return (
    <GameContext.Provider 
      value={{ 
        gameState, 
        loading, 
        error,
        updateGameState,
        refreshGame: initializeGame
      }}
    >
      {children}
    </GameContext.Provider>
  );
};

export const useGame = () => {
  const context = useContext(GameContext);
  if (context === undefined) {
    throw new Error('useGame must be used within a GameProvider');
  }
  return context;
};
