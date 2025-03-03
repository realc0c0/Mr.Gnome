import React from 'react';
import styled, { keyframes } from 'styled-components';

const spin = keyframes`
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
`;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  background: var(--tg-theme-bg-color);
  color: var(--tg-theme-text-color);
`;

const Spinner = styled.div`
  width: 48px;
  height: 48px;
  border: 4px solid var(--tg-theme-button-color);
  border-top-color: transparent;
  border-radius: 50%;
  animation: ${spin} 1s linear infinite;
  margin-bottom: 16px;
`;

const LoadingText = styled.div`
  font-size: 16px;
  color: var(--tg-theme-hint-color);
`;

const LoadingScreen: React.FC = () => {
  return (
    <Container>
      <Spinner />
      <LoadingText>Loading Mr.Gnome...</LoadingText>
    </Container>
  );
};

export default LoadingScreen;
