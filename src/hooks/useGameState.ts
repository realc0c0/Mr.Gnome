import { useReducer, useEffect } from 'react';
import { GameState, Player, Enemy, Item } from '../types/game';

type GameAction =
  | { type: 'MOVE_PLAYER'; payload: { direction: 'up' | 'down' | 'left' | 'right' } }
  | { type: 'START_COMBAT'; payload: { enemy: Enemy } }
  | { type: 'COLLECT_TOKENS'; payload: { amount: number } }
  | { type: 'USE_ITEM'; payload: { item: Item } }
  | { type: 'LEVEL_UP' }
  | { type: 'APPLY_BUFF'; payload: { buff: keyof GameState['activeBuffs']; value: number } };

const initialState: GameState = {
  player: {
    x: 1,
    y: 1,
    health: 100,
    maxHealth: 100,
    attack: 10,
    defense: 5,
    inventory: [],
    equippedItems: {},
    experience: 0,
    level: 1
  },
  tokens: 0,
  playerLevel: 1,
  activeBuffs: {
    tokenBonus: 1,
    attackBonus: 0,
    defenseBonus: 0
  },
  user: { id: '', telegramId: 0, username: '', referralCode: '', lastLoginDate: new Date(), loginStreak: 0, rank: 0, totalEarned: 0 },
  assets: [],
  boosters: [],
  mines: [],
  tasks: [],
  tapPower: 1,
  lastTapTime: new Date(),
  spinAvailable: true,
  lastSpinTime: new Date()
};

const gameReducer = (state: GameState, action: GameAction): GameState => {
  switch (action.type) {
    case 'MOVE_PLAYER': {
      const { direction } = action.payload;
      const { x, y } = state.player;
      let newX = x;
      let newY = y;

      switch (direction) {
        case 'up':
          newY = Math.max(0, y - 1);
          break;
        case 'down':
          newY = Math.min((state.currentDungeon?.height || 0) - 1, y + 1);
          break;
        case 'left':
          newX = Math.max(0, x - 1);
          break;
        case 'right':
          newX = Math.min((state.currentDungeon?.width || 0) - 1, x + 1);
          break;
      }

      // Check if move is valid (not a wall)
      if (state.currentDungeon?.tiles[newY][newX].type !== 'WALL') {
        return {
          ...state,
          player: {
            ...state.player,
            x: newX,
            y: newY
          }
        };
      }
      return state;
    }

    case 'START_COMBAT': {
      const { enemy } = action.payload;
      // Combat logic here...
      return state;
    }

    case 'COLLECT_TOKENS': {
      const { amount } = action.payload;
      return {
        ...state,
        tokens: state.tokens + Math.floor(amount * state.activeBuffs.tokenBonus)
      };
    }

    case 'USE_ITEM': {
      const { item } = action.payload;
      // Item usage logic here...
      return state;
    }

    case 'LEVEL_UP': {
      const newLevel = state.playerLevel + 1;
      return {
        ...state,
        playerLevel: newLevel,
        player: {
          ...state.player,
          maxHealth: state.player.maxHealth + 10,
          health: state.player.maxHealth + 10,
          attack: state.player.attack + 2,
          defense: state.player.defense + 1,
          level: newLevel
        }
      };
    }

    case 'APPLY_BUFF': {
      const { buff, value } = action.payload;
      return {
        ...state,
        activeBuffs: {
          ...state.activeBuffs,
          [buff]: state.activeBuffs[buff] + value
        }
      };
    }

    default:
      return state;
  }
};

export const useGameState = () => {
  const [state, dispatch] = useReducer(gameReducer, initialState);

  // Load saved state from localStorage on mount
  useEffect(() => {
    const savedState = localStorage.getItem('gameState');
    if (savedState) {
      try {
        const parsed = JSON.parse(savedState);
        Object.assign(initialState, parsed);
      } catch (e) {
        console.error('Failed to load saved game state:', e);
      }
    }
  }, []);

  // Save state to localStorage on changes
  useEffect(() => {
    localStorage.setItem('gameState', JSON.stringify(state));
  }, [state]);

  return { gameState: state, dispatch };
};
