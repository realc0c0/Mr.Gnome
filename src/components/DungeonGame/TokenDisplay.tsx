import React from 'react';
import styled from 'styled-components';

const TokenContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.1);
`;

const TokenIcon = styled.span`
  font-size: 20px;
`;

const TokenAmount = styled.span`
  font-size: 16px;
  font-weight: bold;
`;

const Level = styled.span`
  font-size: 14px;
  opacity: 0.8;
  margin-left: 12px;
`;

interface TokenDisplayProps {
  amount: number;
  level: number;
}

export const TokenDisplay: React.FC<TokenDisplayProps> = ({ amount, level }) => {
  return (
    <TokenContainer>
      <TokenIcon>💎</TokenIcon>
      <TokenAmount>{amount}</TokenAmount>
      <Level>Level {level}</Level>
    </TokenContainer>
  );
};
