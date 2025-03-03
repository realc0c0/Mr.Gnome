import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import WebApp from '@twa-dev/sdk';
import { useGame } from '../contexts/GameContext';
import { TelegramService } from '../services/telegram';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 24px;
`;

const TapButton = styled.button<{ isActive: boolean }>`
  width: 200px;
  height: 200px;
  border-radius: 50%;
  border: none;
  background: ${props => props.isActive ? 'var(--tg-theme-button-color)' : 'var(--tg-theme-hint-color)'};
  color: var(--tg-theme-button-text-color);
  font-size: 24px;
  cursor: pointer;
  transition: transform 0.1s, background-color 0.3s;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 8px;

  &:active {
    transform: scale(0.95);
  }
`;

const StatsContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;
  width: 100%;
  max-width: 400px;
`;

const StatCard = styled.div`
  background: var(--tg-theme-secondary-bg-color);
  padding: 16px;
  border-radius: 12px;
  text-align: center;
`;

const StatValue = styled.div`
  font-size: 24px;
  font-weight: bold;
  color: var(--tg-theme-text-color);
`;

const StatLabel = styled.div`
  font-size: 14px;
  color: var(--tg-theme-hint-color);
`;

const BoostersList = styled.div`
  display: flex;
  gap: 12px;
  overflow-x: auto;
  padding: 8px;
  width: 100%;
`;

const BoosterCard = styled.div<{ active: boolean }>`
  background: ${props => props.active ? 'var(--tg-theme-button-color)' : 'var(--tg-theme-secondary-bg-color)'};
  padding: 12px;
  border-radius: 8px;
  min-width: 100px;
  text-align: center;
`;

const Home: React.FC = () => {
  const { gameState, loading, updateGameState } = useGame();
  const [canTap, setCanTap] = useState(true);

  useEffect(() => {
    // Set up Telegram main button
    const cleanup = TelegramService.setupMainButton({
      text: 'CONNECT WALLET',
      onClick: () => {
        // Implement TON Connect integration
        WebApp.showAlert('TON wallet connection coming soon!');
      }
    });

    return cleanup;
  }, []);

  const handleTap = async () => {
    if (!canTap || !gameState) return;

    setCanTap(false);
    const reward = gameState.tapPower * (1 + gameState.boosters.reduce((acc, b) => acc + b.multiplier, 0));
    
    TelegramService.hapticFeedback.impact();
    
    try {
      await updateGameState({
        ...gameState,
        user: {
          ...gameState.user,
          totalEarned: gameState.user.totalEarned + reward
        },
        assets: gameState.assets.map(asset => 
          asset.symbol === 'GNOME' ? 
          { ...asset, balance: asset.balance + reward } : 
          asset
        ),
        lastTapTime: new Date()
      });
    } catch (error) {
      TelegramService.hapticFeedback.error();
      WebApp.showAlert('Failed to update progress. Please try again.');
    }

    setTimeout(() => setCanTap(true), 1000);
  };

  if (loading || !gameState) {
    return <div>Loading game...</div>;
  }

  return (
    <Container>
      <TapButton 
        isActive={canTap}
        onClick={handleTap}
      >
        <span style={{ fontSize: '48px' }}>🎅</span>
        {canTap ? 'TAP!' : 'Wait...'}
      </TapButton>

      <StatsContainer>
        <StatCard>
          <StatValue>{gameState.assets[0].balance.toFixed(2)}</StatValue>
          <StatLabel>$GNOME Tokens</StatLabel>
        </StatCard>
        <StatCard>
          <StatValue>{gameState.tapPower.toFixed(1)}x</StatValue>
          <StatLabel>Tap Power</StatLabel>
        </StatCard>
      </StatsContainer>

      <BoostersList>
        {gameState.boosters.map(booster => (
          <BoosterCard key={booster.id} active={!!booster.expiresAt}>
            <div>{booster.name}</div>
            <div>{booster.multiplier}x</div>
          </BoosterCard>
        ))}
      </BoostersList>
    </Container>
  );
};

export default Home;
