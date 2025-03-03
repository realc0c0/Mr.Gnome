import React from 'react';
import styled from 'styled-components';
import { Player, Enemy, DungeonTile } from '../../types/game';

type TileType = 'wall' | 'floor' | 'shop' | 'forge' | 'shrine' | 'token';

const MapContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(15, 1fr);
  gap: 2px;
  padding: 16px;
  max-width: 100%;
  aspect-ratio: 1;
`;

const Tile = styled.div<{ type: TileType }>`
  aspect-ratio: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
  background: ${({ type }) => {
    switch (type) {
      case 'wall': return '#333';
      case 'floor': return '#222';
      case 'shop': return '#553';
      case 'forge': return '#533';
      case 'shrine': return '#335';
      case 'token': return '#2C2';
      default: return '#222';
    }
  }};
  cursor: ${({ type }) => type === 'floor' || type === 'token' ? 'pointer' : 'default'};
`;

interface DungeonMapProps {
  dungeon: {
    tiles: DungeonTile[][];
    enemies: Enemy[];
    tokens: { x: number; y: number; amount: number }[];
  };
  player: Player;
  onMove: (direction: 'up' | 'down' | 'left' | 'right') => void;
  onCombat: (enemy: Enemy) => void;
  onTokenCollect: (amount: number) => void;
}

export const DungeonMap: React.FC<DungeonMapProps> = ({
  dungeon,
  player,
  onMove,
  onCombat,
  onTokenCollect
}) => {
  if (!dungeon) return null;

  const handleTileClick = (x: number, y: number) => {
    const dx = x - player.x;
    const dy = y - player.y;
    
    // Only allow moving one tile at a time
    if (Math.abs(dx) + Math.abs(dy) !== 1) return;
    
    // Check if tile is walkable
    if (dungeon.tiles[y][x].type === 'wall') return;

    // Check for enemies
    const enemy = dungeon.enemies.find(e => e.x === x && e.y === y);
    if (enemy) {
      onCombat(enemy);
      return;
    }

    // Check for tokens
    const token = dungeon.tokens.find(t => t.x === x && t.y === y);
    if (token) {
      onTokenCollect(token.amount);
    }

    // Move player
    if (dx === 1) onMove('right');
    else if (dx === -1) onMove('left');
    else if (dy === 1) onMove('down');
    else if (dy === -1) onMove('up');
  };

  return (
    <MapContainer>
      {dungeon.tiles.map((row, y) =>
        row.map((tile, x) => {
          const enemy = dungeon.enemies.find(e => e.x === x && e.y === y);
          const token = dungeon.tokens.find(t => t.x === x && t.y === y);
          const isPlayer = player.x === x && player.y === y;

          return (
            <Tile
              key={`${x}-${y}`}
              type={tile.type as TileType}
              onClick={() => handleTileClick(x, y)}
            >
              {isPlayer ? '🧙‍♂️' :
               enemy ? '👾' :
               token ? '💎' :
               tile.type === 'shop' ? '🏪' :
               tile.type === 'forge' ? '⚒️' :
               tile.type === 'shrine' ? '🏛️' :
               tile.type === 'token' ? '💎' : ''}
            </Tile>
          );
        })
      )}
    </MapContainer>
  );
};
