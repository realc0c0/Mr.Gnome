import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import styled, { ThemeProvider } from 'styled-components';
import { GameProvider } from './contexts/GameContext';
import Navigation from './components/Navigation';
import Home from './pages/Home';
import Tasks from './pages/Tasks';
import Mining from './pages/Mining';
import Assets from './pages/Assets';
import Profile from './pages/Profile';
import ErrorBoundary from './components/ErrorBoundary';
import LoadingScreen from './components/LoadingScreen';

const AppContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: 100vh;
  background: var(--tg-theme-bg-color);
  color: var(--tg-theme-text-color);
  overflow: hidden;
`;

const ContentContainer = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 16px;
  -webkit-overflow-scrolling: touch;
`;

const App: React.FC = () => {
  return (
    <ErrorBoundary>
      <ThemeProvider theme={{}}>
        <GameProvider>
          <Router>
            <AppContainer>
              <ContentContainer>
                <React.Suspense fallback={<LoadingScreen />}>
                  <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/tasks" element={<Tasks />} />
                    <Route path="/mining" element={<Mining />} />
                    <Route path="/assets" element={<Assets />} />
                    <Route path="/profile" element={<Profile />} />
                    <Route path="*" element={<Navigate to="/" replace />} />
                  </Routes>
                </React.Suspense>
              </ContentContainer>
              <Navigation />
            </AppContainer>
          </Router>
        </GameProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
};

export default App;
