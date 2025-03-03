import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import WebApp from '@twa-dev/sdk';
import { TokenDisplay } from './TokenDisplay';
import { DungeonMap } from './DungeonMap';
import { GameState, Player, Enemy } from '../../types/game';
import { generateDungeon } from '../../utils/dungeonGenerator';
import { useGameState } from '../../hooks/useGameState';

const GameContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: 100vh;
  background: ${({ theme }) => theme.colors.background};
  color: ${({ theme }) => theme.colors.text};
`;

const GameHeader = styled.div`
  padding: 12px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 2px solid ${({ theme }) => theme.colors.border};
`;

const GameContent = styled.div`
  flex: 1;
  overflow: hidden;
  position: relative;
`;

const DungeonGame: React.FC = () => {
  const { gameState, dispatch } = useGameState();
  const [currentDungeon, setCurrentDungeon] = useState(null);

  useEffect(() => {
    // Initialize game with Telegram theme
    WebApp.ready();
    const colors = WebApp.themeParams;
    document.body.style.backgroundColor = colors.bg_color;
    
    // Generate initial dungeon
    const dungeon = generateDungeon({
      width: 15,
      height: 15,
      difficulty: gameState.playerLevel,
      tokenMultiplier: gameState.activeBuffs.tokenBonus || 1
    });
    setCurrentDungeon(dungeon);
  }, []);

  const handleMove = (direction: 'up' | 'down' | 'left' | 'right') => {
    dispatch({ type: 'MOVE_PLAYER', payload: { direction } });
  };

  const handleCombat = (enemy: Enemy) => {
    dispatch({ type: 'START_COMBAT', payload: { enemy } });
  };

  const handleTokenCollection = (amount: number) => {
    dispatch({ type: 'COLLECT_TOKENS', payload: { amount } });
    // Notify Telegram UI of token update
    WebApp.HapticFeedback.impactOccurred('light');
  };

  return (
    <GameContainer>
      <GameHeader>
        <TokenDisplay 
          amount={gameState.tokens} 
          level={gameState.playerLevel}
        />
      </GameHeader>
      <GameContent>
        {currentDungeon && (
          <DungeonMap
            dungeon={currentDungeon}
            player={gameState.player}
            onMove={handleMove}
            onCombat={handleCombat}
            onTokenCollect={handleTokenCollection}
          />
        )}
      </GameContent>
    </GameContainer>
  );
};

export default DungeonGame;
