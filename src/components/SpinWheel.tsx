import { useState } from 'react';

const REWARDS: Record<number, string[]> = {
  1: ['Sticker', 'Extra Play Time', 'Small Treat'],
  2: ['Trip to Park', 'Small Toy', 'Ice Cream'],
  3: ['Movie Night', 'Stay Up Late', 'Game Time'],
};

type SpinWheelProps = {
  totalPoints: number;
  threshold: number;
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
    if (!canSpin) return;

    playSound();
    setIsSpinning(true);

    setTimeout(() => {
      // Determine reward tier based on how many thresholds are met
      // For simplicity, assume tier 1 if threshold met once,
      // tier 2 if threshold met twice, tier 3 if thrice or more

      // Calculate how many full thresholds completed:
      const fullTiers = Math.floor(totalPoints / threshold);
      let tier = 1;
      if (fullTiers === 1) tier = 1;
      else if (fullTiers === 2) tier = 2;
      else if (fullTiers >= 3) tier = 3;

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

      {!canSpin && <p style={{ color: 'gray' }}>Earn {threshold - totalPoints} more points to spin!</p>}

      {result && (
        <p style={{ marginTop: '1rem' }}>
          You won: <strong>{result}</strong>!
        </p>
      )}
    </div>
  );
};

export default SpinWheel;
