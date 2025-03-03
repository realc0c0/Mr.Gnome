import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import styled from 'styled-components';

const NavContainer = styled.nav`
  display: flex;
  justify-content: space-around;
  align-items: center;
  padding: 12px;
  background: var(--tg-theme-secondary-bg-color);
  border-top: 1px solid var(--tg-theme-hint-color);
`;

const NavItem = styled.button<{ active: boolean }>`
  display: flex;
  flex-direction: column;
  align-items: center;
  background: none;
  border: none;
  color: ${props => props.active ? 'var(--tg-theme-button-color)' : 'var(--tg-theme-hint-color)'};
  font-size: 12px;
  cursor: pointer;
  padding: 8px;
  transition: color 0.2s;

  &:hover {
    color: var(--tg-theme-button-color);
  }
`;

const Icon = styled.span`
  font-size: 24px;
  margin-bottom: 4px;
`;

const Navigation: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const navItems = [
    { path: '/', label: 'Home', icon: '🏠' },
    { path: '/tasks', label: 'Tasks', icon: '📋' },
    { path: '/mining', label: 'Mining', icon: '⛏️' },
    { path: '/assets', label: 'Assets', icon: '💰' },
    { path: '/profile', label: 'Profile', icon: '👤' },
  ];

  return (
    <NavContainer>
      {navItems.map(item => (
        <NavItem
          key={item.path}
          active={location.pathname === item.path}
          onClick={() => navigate(item.path)}
        >
          <Icon>{item.icon}</Icon>
          {item.label}
        </NavItem>
      ))}
    </NavContainer>
  );
};

export default Navigation;
