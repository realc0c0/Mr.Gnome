import React, { useState } from 'react';
import styled from 'styled-components';
import { Mine } from '../types/game';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const MineGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  gap: 16px;
`;

const MineCard = styled.div`
  background: var(--tg-theme-secondary-bg-color);
  border-radius: 12px;
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const MineHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const MineLevel = styled.div`
  font-size: 12px;
  color: var(--tg-theme-hint-color);
`;

const MineProduction = styled.div`
  font-size: 18px;
  font-weight: bold;
`;

const UpgradeButton = styled.button`
  background: var(--tg-theme-button-color);
  color: var(--tg-theme-button-text-color);
  border: none;
  border-radius: 8px;
  padding: 8px;
  cursor: pointer;
  font-size: 14px;

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const Mining: React.FC = () => {
  const [mines, setMines] = useState<Mine[]>([
    {
      id: '1',
      level: 1,
      baseProduction: 1,
      currentProduction: 1,
      upgradePrice: 100,
      lastCollected: new Date()
    }
  ]);

  const handleUpgrade = (mineId: string) => {
    setMines(prev => prev.map(mine => {
      if (mine.id === mineId) {
        return {
          ...mine,
          level: mine.level + 1,
          baseProduction: mine.baseProduction * 1.5,
          currentProduction: mine.currentProduction * 1.5,
          upgradePrice: mine.upgradePrice * 2
        };
      }
      return mine;
    }));
  };

  return (
    <Container>
      <h2>Mining Cards</h2>
      <MineGrid>
        {mines.map(mine => (
          <MineCard key={mine.id}>
            <MineHeader>
              <span>⛏️ Mine #{mine.id}</span>
              <MineLevel>Level {mine.level}</MineLevel>
            </MineHeader>
            <MineProduction>
              {mine.currentProduction.toFixed(1)} GNOME/hr
            </MineProduction>
            <UpgradeButton onClick={() => handleUpgrade(mine.id)}>
              Upgrade ({mine.upgradePrice} GNOME)
            </UpgradeButton>
          </MineCard>
        ))}
      </MineGrid>
    </Container>
  );
};

export default Mining;
