import React, { useState } from 'react';
import styled from 'styled-components';
import WebApp from '@twa-dev/sdk';
import { User } from '../types/game';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
`;

const ProfileCard = styled.div`
  background: var(--tg-theme-secondary-bg-color);
  border-radius: 12px;
  padding: 20px;
  display: flex;
  align-items: center;
  gap: 16px;
`;

const Avatar = styled.div`
  width: 64px;
  height: 64px;
  border-radius: 50%;
  background: var(--tg-theme-button-color);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 32px;
`;

const ProfileInfo = styled.div`
  flex: 1;
`;

const Username = styled.div`
  font-size: 18px;
  font-weight: bold;
`;

const Stats = styled.div`
  margin-top: 8px;
  display: flex;
  gap: 16px;
  font-size: 14px;
  color: var(--tg-theme-hint-color);
`;

const ReferralCard = styled.div`
  background: var(--tg-theme-secondary-bg-color);
  border-radius: 12px;
  padding: 20px;
`;

const ReferralCode = styled.div`
  background: rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  padding: 12px;
  margin: 12px 0;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const CopyButton = styled.button`
  background: var(--tg-theme-button-color);
  color: var(--tg-theme-button-text-color);
  border: none;
  border-radius: 6px;
  padding: 8px 12px;
  cursor: pointer;
`;

const AchievementGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
  gap: 12px;
`;

const AchievementCard = styled.div<{ unlocked: boolean }>`
  background: var(--tg-theme-secondary-bg-color);
  border-radius: 8px;
  padding: 12px;
  text-align: center;
  opacity: ${props => props.unlocked ? 1 : 0.5};
`;

const Profile: React.FC = () => {
  const [user] = useState<User>({
    id: '1',
    telegramId: 123456,
    username: 'player1',
    referralCode: 'ABC123',
    lastLoginDate: new Date(),
    loginStreak: 5,
    rank: 10,
    totalEarned: 1000
  });

  const [achievements] = useState([
    { id: 1, name: 'First Tap', icon: '👆', unlocked: true },
    { id: 2, name: 'Power Tapper', icon: '💪', unlocked: true },
    { id: 3, name: 'Social Butterfly', icon: '🦋', unlocked: false },
    { id: 4, name: 'Token Master', icon: '👑', unlocked: false },
  ]);

  const handleCopyReferral = () => {
    navigator.clipboard.writeText(user.referralCode);
    WebApp.HapticFeedback.impactOccurred('light');
    WebApp.showPopup({
      title: 'Copied!',
      message: 'Referral code copied to clipboard'
    });
  };

  return (
    <Container>
      <ProfileCard>
        <Avatar>🎅</Avatar>
        <ProfileInfo>
          <Username>{user.username}</Username>
          <Stats>
            <span>Rank #{user.rank}</span>
            <span>•</span>
            <span>{user.loginStreak} day streak</span>
          </Stats>
        </ProfileInfo>
      </ProfileCard>

      <ReferralCard>
        <h3>Referral Program</h3>
        <p>Share your referral code and earn 10% of your friends' earnings!</p>
        <ReferralCode>
          <span>{user.referralCode}</span>
          <CopyButton onClick={handleCopyReferral}>
            Copy
          </CopyButton>
        </ReferralCode>
      </ReferralCard>

      <div>
        <h3>Achievements</h3>
        <AchievementGrid>
          {achievements.map(achievement => (
            <AchievementCard 
              key={achievement.id}
              unlocked={achievement.unlocked}
            >
              <div style={{ fontSize: '32px' }}>{achievement.icon}</div>
              <div>{achievement.name}</div>
            </AchievementCard>
          ))}
        </AchievementGrid>
      </div>
    </Container>
  );
};

export default Profile;
