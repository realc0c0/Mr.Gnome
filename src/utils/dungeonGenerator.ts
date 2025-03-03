import { Dungeon, DungeonTile, Enemy, Item, TokenSigil } from '../types/game';

interface DungeonConfig {
  width: number;
  height: number;
  difficulty: number;
  tokenMultiplier: number;
}

const TOKEN_SIGILS: TokenSigil[] = [
  {
    type: 'DOUBLE_REWARDS',
    multiplier: 2,
    effect: {
      description: 'Double all token rewards, but enemies are stronger',
      onActivate: (gameState) => {
        gameState.activeBuffs.tokenBonus *= 2;
        // Increase enemy strength in dungeon generation
      },
      onDeactivate: (gameState) => {
        gameState.activeBuffs.tokenBonus /= 2;
      }
    }
  },
  {
    type: 'CURSED_TOKENS',
    multiplier: 1.5,
    effect: {
      description: 'Increased token drops, but each token deals 1 damage',
      onActivate: (gameState) => {
        gameState.activeBuffs.tokenBonus *= 1.5;
      },
      onDeactivate: (gameState) => {
        gameState.activeBuffs.tokenBonus /= 1.5;
      }
    }
  }
];

type EnemyType = 'GOBLIN' | 'SKELETON' | 'MIMIC' | 'CURSED_MERCHANT';

const generateEnemies = (config: DungeonConfig): Enemy[] => {
  const enemyCount = Math.floor(config.width * config.height * 0.15);
  const enemies: Enemy[] = [];

  for (let i = 0; i < enemyCount; i++) {
    const enemy: Enemy = {
      type: ['GOBLIN', 'SKELETON', 'MIMIC', 'CURSED_MERCHANT'][Math.floor(Math.random() * 4)] as EnemyType,
      x: Math.floor(Math.random() * config.width),
      y: Math.floor(Math.random() * config.height),
      health: 10 + config.difficulty * 2,
      attack: 5 + config.difficulty,
      defense: 2 + Math.floor(config.difficulty / 2),
      tokenReward: Math.floor(
        (5 + Math.random() * 10) * config.tokenMultiplier
      ),
      expReward: 10 + config.difficulty * 5
    };
    enemies.push(enemy);
  }

  return enemies;
};

const generateItems = (config: DungeonConfig): Item[] => {
  const itemCount = Math.floor(config.width * config.height * 0.1);
  const items: Item[] = [];

  // Item generation logic here...
  return items;
};

export const generateDungeon = (config: DungeonConfig): Dungeon => {
  const tiles: DungeonTile[][] = Array(config.height)
    .fill(null)
    .map(() =>
      Array(config.width).fill(null).map(() => ({
        type: 'FLOOR',
        discovered: false
      }))
    );

  // Generate maze using recursive backtracking
  const generateMaze = (x: number, y: number) => {
    const directions = [
      [0, -2], // North
      [2, 0],  // East
      [0, 2],  // South
      [-2, 0]  // West
    ];
    
    directions.sort(() => Math.random() - 0.5);

    for (const [dx, dy] of directions) {
      const newX = x + dx;
      const newY = y + dy;

      if (
        newX > 0 && newX < config.width - 1 &&
        newY > 0 && newY < config.height - 1 &&
        tiles[newY][newX].type === 'WALL'
      ) {
        tiles[y + dy/2][x + dx/2].type = 'FLOOR';
        tiles[newY][newX].type = 'FLOOR';
        generateMaze(newX, newY);
      }
    }
  };

  // Initialize with walls
  for (let y = 0; y < config.height; y++) {
    for (let x = 0; x < config.width; x++) {
      tiles[y][x].type = 'WALL';
    }
  }

  // Generate maze from center
  const startX = Math.floor(config.width / 2);
  const startY = Math.floor(config.height / 2);
  tiles[startY][startX].type = 'FLOOR';
  generateMaze(startX, startY);

  // Place entrance and exit
  tiles[0][1].type = 'ENTRANCE';
  tiles[config.height - 1][config.width - 2].type = 'EXIT';

  // Place special rooms
  const specialRooms = ['SHOP', 'FORGE', 'SHRINE'];
  specialRooms.forEach(room => {
    let placed = false;
    while (!placed) {
      const x = Math.floor(Math.random() * (config.width - 2)) + 1;
      const y = Math.floor(Math.random() * (config.height - 2)) + 1;
      if (tiles[y][x].type === 'FLOOR') {
        tiles[y][x].type = room as any;
        placed = true;
      }
    }
  });

  // Place enemies
  const enemies = generateEnemies(config);
  enemies.forEach(enemy => {
    if (tiles[enemy.y][enemy.x].type === 'FLOOR') {
      tiles[enemy.y][enemy.x].enemy = enemy;
    }
  });

  // Place items
  const items = generateItems(config);
  items.forEach(item => {
    let placed = false;
    while (!placed) {
      const x = Math.floor(Math.random() * config.width);
      const y = Math.floor(Math.random() * config.height);
      if (
        tiles[y][x].type === 'FLOOR' &&
        !tiles[y][x].enemy &&
        !tiles[y][x].item
      ) {
        tiles[y][x].item = item;
        placed = true;
      }
    }
  });

  // Add token pickups
  for (let y = 0; y < config.height; y++) {
    for (let x = 0; x < config.width; x++) {
      if (
        tiles[y][x].type === 'FLOOR' &&
        !tiles[y][x].enemy &&
        !tiles[y][x].item &&
        Math.random() < 0.2
      ) {
        tiles[y][x].tokens = Math.floor(
          (1 + Math.random() * 5) * config.tokenMultiplier
        );
      }
    }
  }

  return {
    tiles,
    width: config.width,
    height: config.height,
    level: config.difficulty,
    tokenSigil: Math.random() < 0.3 
      ? TOKEN_SIGILS[Math.floor(Math.random() * TOKEN_SIGILS.length)]
      : undefined
  };
};
