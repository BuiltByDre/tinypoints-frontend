import { useState } from 'react';

const REWARDS: Record<number, string[]> = {
  1: ['Extra 15 minutes of screen time', 'Favorite snack', 'Sticker'],
  2: ['Choose dinner', 'Small toy', 'Game time'],
  3: ['Trip to park', 'New book', 'Movie night'],
};

type SpinWheelProps = {
  rewardsAvailable: number;
  pointsUntilReward: number;
  onSpinComplete: () => void;
};

const SpinWheel = ({ rewardsAvailable, pointsUntilReward, onSpinComplete }: SpinWheelProps) => {
  const [isSpinning, setIsSpinning] = useState(false);
  const [result, setResult] = useState<string | null>(null);

  const canSpin = rewardsAvailable > 0 && !isSpinning;

  const spin = () => {
    if (!canSpin) return;

    setIsSpinning(true);

    setTimeout(() => {
      const tier = Math.min(Math.max(rewardsAvailable, 1), 3);
      const rewardList = REWARDS[tier];
      const reward = rewardList[Math.floor(Math.random() * rewardList.length)];

      setResult(reward);
      setIsSpinning(false);
      onSpinComplete(); // Deduct 100 points after spin
    }, 1000);
  };

  return (
    <div style={{ marginTop: '2rem', textAlign: 'center' }}>
      <h3>🎉 Spin the Reward Wheel!</h3>
      <button onClick={spin} disabled={!canSpin}>
        {isSpinning ? 'Spinning...' : 'Spin'}
      </button>

      {!canSpin && (
        <p style={{ color: 'gray' }}>
          Earn {pointsUntilReward} more points to spin!
        </p>
      )}

      {result && (
        <p style={{ marginTop: '1rem' }}>
          You won: <strong>{result}</strong>!
        </p>
      )}
    </div>
  );
};

export default SpinWheel;
