import { useState } from 'react';

type SpinWheelProps = {
  totalPoints: number;
  threshold: number;
};

const REWARDS: Record<number, string[]> = {
  1: ['Sticker', 'Extra Play Time', 'Small Treat'],
  2: ['Trip to Park', 'Small Toy', 'Ice Cream'],
  3: ['Movie Night', 'Stay Up Late', 'Game Time'],
};

const SpinWheel = ({ totalPoints, threshold }: SpinWheelProps) => {
  const [result, setResult] = useState<string | null>(null);
  const [isSpinning, setIsSpinning] = useState(false);

  const canSpin = totalPoints >= threshold;

  const playSound = () => {
    const audio = new Audio('/spin.wav');
    audio.play().catch((err) => console.error('Audio play error:', err));
  };

  const spin = () => {
    if (!canSpin) return; // safeguard

    playSound();
    setIsSpinning(true);

    setTimeout(() => {
      const tier = Math.floor(Math.random() * 3) + 1;
      const rewardList = REWARDS[tier];
      const reward = rewardList[Math.floor(Math.random() * rewardList.length)];
      setResult(reward);
      setIsSpinning(false);
    }, 1000);
  };

  return (
    <div style={{ marginTop: '2rem', textAlign: 'center' }}>
      <h3>🎉 Spin the Reward Wheel!</h3>

      {!canSpin && (
        <p style={{ color: 'red' }}>
          You need at least {threshold} points to spin the wheel. Keep going!
        </p>
      )}

      <button onClick={spin} disabled={isSpinning || !canSpin}>
        {isSpinning ? 'Spinning...' : 'Spin'}
      </button>

      {result && (
        <p style={{ marginTop: '1rem' }}>
          You won: <strong>{result}</strong>!
        </p>
      )}
    </div>
  );
};

export default SpinWheel;
