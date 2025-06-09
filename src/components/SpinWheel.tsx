import { useState } from 'react';

const REWARDS = {
  1: ['Extra 15 minutes of screen time', 'Favorite snack', 'Sticker'],
  2: ['Choose dinner', 'Small toy', 'Game time'],
  3: ['Trip to park', 'New book', 'Movie night'],
};

type SpinWheelProps = {
  rewardsAvailable: number;
  pointsUntilReward: number;
};

const SpinWheel = ({ rewardsAvailable, pointsUntilReward }: SpinWheelProps) => {
  const [isSpinning, setIsSpinning] = useState(false);
  const [result, setResult] = useState<string | null>(null);

  const playSound = () => {
    // Add your sound effect here if desired
  };

  const canSpin = rewardsAvailable > 0;

  const spin = () => {
    if (!canSpin) return;

    playSound();
    setIsSpinning(true);

    setTimeout(() => {
      // Limit max tier to 3, fallback to 1 if somehow 0
      const tier = Math.min(Math.max(rewardsAvailable, 1), 3);

      const rewardList = REWARDS[tier];
      const reward = rewardList[Math.floor(Math.random() * rewardList.length)];

      setResult(reward);
      setIsSpinning(false);
    }, 1000);
  };

  return (
    <div style={{ marginTop: '2rem', textAlign: 'center' }}>
      <h3>🎉 Spin the Reward Wheel!</h3>
      <button onClick={spin} disabled={isSpinning || !canSpin}>
        {isSpinning ? 'Spinning...' : 'Spin'}
      </button>

      {!canSpin && <p style={{ color: 'gray' }}>Earn {pointsUntilReward} more points to spin!</p>}

      {result && (
        <p style={{ marginTop: '1rem' }}>
          You won: <strong>{result}</strong>!
        </p>
      )}

      <div style={{ marginTop: '1rem' }}>
        <strong>Reward Progress</strong>
        <br />
        {rewardsAvailable * 100} / 100 points
      </div>
    </div>
  );
};

export default SpinWheel;
