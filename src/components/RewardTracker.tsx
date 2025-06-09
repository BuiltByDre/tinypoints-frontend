// RewardTracker.tsx
import React from 'react';

interface RewardTrackerProps {
  behaviors: {
    points: number;
    type: string;
  }[];
  threshold: number;
}

const RewardTracker: React.FC<RewardTrackerProps> = ({ behaviors, threshold }) => {
  const totalPoints = behaviors.reduce((sum, b) => sum + b.points, 0);
  const progress = Math.min((totalPoints / threshold) * 100, 100);

  return (
    <div>
      <h3>Reward Progress</h3>
      <div style={{ background: '#eee', width: '100%', height: '20px', borderRadius: '5px' }}>
        <div
          style={{
            background: 'limegreen',
            width: `${progress}%`,
            height: '100%',
            borderRadius: '5px',
          }}
        />
      </div>
      <p>{totalPoints} / {threshold} points</p>
    </div>
  );
};

export default RewardTracker;
