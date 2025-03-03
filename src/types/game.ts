export interface Position {
  x: number;
  y: number;
}

export interface Player extends Position {
  health: number;
  maxHealth: number;
  attack: number;
  defense: number;
  inventory: Item[];
  equippedItems: EquippedItems;
  experience: number;
  level: number;
}

export interface Enemy extends Position {
  type: EnemyType;
  health: number;
  attack: number;
  defense: number;
  tokenReward: number;
  expReward: number;
}

export interface Item {
  id: string;
  name: string;
  type: ItemType;
  rarity: ItemRarity;
  stats: ItemStats;
  tokenValue: number;
}

export interface DungeonTile {
  type: TileType;
  enemy?: Enemy;
  item?: Item;
  tokens?: number;
  discovered: boolean;
}

export interface Dungeon {
  tiles: DungeonTile[][];
  enemies: Enemy[];
  tokens: { x: number; y: number; amount: number }[];
  width: number;
  height: number;
  level: number;
  tokenSigil?: TokenSigil;
}

export interface TokenSigil {
  type: TokenSigilType;
  multiplier: number;
  effect: TokenSigilEffect;
}

export type TokenSigilType = 
  | 'DOUBLE_REWARDS'
  | 'HALF_HEALTH'
  | 'RANDOM_TELEPORT'
  | 'CURSED_TOKENS'
  | 'BLESSED_TOKENS';

export type TokenSigilEffect = {
  description: string;
  onActivate: (gameState: GameState) => void;
  onDeactivate: (gameState: GameState) => void;
};

export type TileType = 
  | 'FLOOR'
  | 'WALL'
  | 'ENTRANCE'
  | 'EXIT'
  | 'SHOP'
  | 'FORGE'
  | 'SHRINE';

export type EnemyType = 
  | 'GOBLIN'
  | 'SKELETON'
  | 'MIMIC'
  | 'CURSED_MERCHANT'
  | 'TOKEN_GOLEM';

export type ItemType = 
  | 'WEAPON'
  | 'ARMOR'
  | 'ACCESSORY'
  | 'CONSUMABLE'
  | 'TOKEN_MODIFIER';

export type ItemRarity = 
  | 'COMMON'
  | 'UNCOMMON'
  | 'RARE'
  | 'EPIC'
  | 'LEGENDARY';

export interface ItemStats {
  attack?: number;
  defense?: number;
  health?: number;
  tokenBonus?: number;
}

export interface EquippedItems {
  weapon?: Item;
  armor?: Item;
  accessory?: Item;
}

export interface User {
  id: string;
  telegramId: number;
  username: string;
  walletAddress?: string;
  referralCode: string;
  referredBy?: string;
  lastLoginDate: Date;
  loginStreak: number;
  rank: number;
  totalEarned: number;
}

export interface Asset {
  symbol: string;
  name: string;
  balance: number;
  icon: string;
  value: number;
}

export interface Booster {
  id: string;
  name: string;
  multiplier: number;
  duration: number;
  expiresAt?: Date;
  price: number;
}

export interface Mine {
  id: string;
  level: number;
  baseProduction: number;
  currentProduction: number;
  upgradePrice: number;
  lastCollected: Date;
}

export interface Task {
  id: string;
  type: 'youtube' | 'telegram_group' | 'telegram_channel' | 'airdrop';
  title: string;
  description: string;
  reward: number;
  completed: boolean;
  requirements: {
    url?: string;
    duration?: number;
    groupId?: string;
    channelId?: string;
  };
}

export interface GameState {
  playerLevel: number;
  activeBuffs: any;
  tokens: number;
  player: Player;
  user: User;
  assets: Asset[];
  boosters: Booster[];
  mines: Mine[];
  tasks: Task[];
  tapPower: number;
  lastTapTime: Date;
  spinAvailable: boolean;
  lastSpinTime: Date;
  currentDungeon?: Dungeon;
}
