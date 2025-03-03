import React, { useState } from 'react';
import styled from 'styled-components';
import { Asset } from '../types/game';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const WalletCard = styled.div`
  background: var(--tg-theme-secondary-bg-color);
  border-radius: 12px;
  padding: 16px;
`;

const WalletHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
`;

const ConnectButton = styled.button`
  background: var(--tg-theme-button-color);
  color: var(--tg-theme-button-text-color);
  border: none;
  border-radius: 8px;
  padding: 8px 16px;
  cursor: pointer;
`;

const AssetList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const AssetCard = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 8px;
`;

const AssetInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

const AssetIcon = styled.span`
  font-size: 24px;
`;

const AssetDetails = styled.div`
  display: flex;
  flex-direction: column;
`;

const AssetName = styled.div`
  font-weight: bold;
`;

const AssetSymbol = styled.div`
  font-size: 12px;
  color: var(--tg-theme-hint-color);
`;

const AssetValue = styled.div`
  text-align: right;
`;

const Assets: React.FC = () => {
  const [walletConnected, setWalletConnected] = useState(false);
  const [assets] = useState<Asset[]>([
    {
      symbol: 'GNOME',
      name: 'Gnome Token',
      balance: 1000,
      icon: '🎅',
      value: 1000
    },
    {
      symbol: 'TON',
      name: 'Toncoin',
      balance: 0,
      icon: '💎',
      value: 0
    }
  ]);

  const handleConnectWallet = () => {
    // Here we would integrate with TON Connect
    setWalletConnected(true);
  };

  return (
    <Container>
      <WalletCard>
        <WalletHeader>
          <h3>Wallet</h3>
          <ConnectButton onClick={handleConnectWallet}>
            {walletConnected ? 'Connected ✓' : 'Connect Wallet'}
          </ConnectButton>
        </WalletHeader>
        
        <AssetList>
          {assets.map(asset => (
            <AssetCard key={asset.symbol}>
              <AssetInfo>
                <AssetIcon>{asset.icon}</AssetIcon>
                <AssetDetails>
                  <AssetName>{asset.name}</AssetName>
                  <AssetSymbol>{asset.symbol}</AssetSymbol>
                </AssetDetails>
              </AssetInfo>
              <AssetValue>
                <div>{asset.balance.toFixed(2)}</div>
                <div style={{ fontSize: '12px', color: 'var(--tg-theme-hint-color)' }}>
                  ${asset.value.toFixed(2)}
                </div>
              </AssetValue>
            </AssetCard>
          ))}
        </AssetList>
      </WalletCard>
    </Container>
  );
};

export default Assets;
