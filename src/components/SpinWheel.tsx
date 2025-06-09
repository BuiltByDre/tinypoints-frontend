import { useState } from 'react';

export type SpinWheelProps = {
  rewardsAvailable: number;
  pointsUntilReward: number;
  onSpinComplete?: () => void;
};

const rewardOptions = [
  'Ice Cream 🍦',
  'Extra Screen Time 📱',
  'Trip to the Park 🛝',
  'Pick a Movie 🎥',
  'Special Snack 🍪',
  'Stay Up Late 🌙',
  'Sticker 🎖️',
  'Game Time 🎮',
];

export default function SpinWheel({ rewardsAvailable, pointsUntilReward, onSpinComplete }: SpinWheelProps) {
  const [spinning, setSpinning] = useState(false);
  const [lastReward, setLastReward] = useState<string | null>(null);
  const [spinsLeft, setSpinsLeft] = useState(rewardsAvailable);

  const spin = () => {
    if (spinning || spinsLeft <= 0) return;

    setSpinning(true);
    const reward = rewardOptions[Math.floor(Math.random() * rewardOptions.length)];
    setTimeout(() => {
      setLastReward(reward);
      setSpinning(false);
      setSpinsLeft(spinsLeft - 1);
      if (onSpinComplete) onSpinComplete();
    }, 2000);
  };

  return (
    <div style={{ marginBottom: '2rem', padding: '1rem', border: '2px dashed #999', borderRadius: '12px' }}>
      <h2>🎉 Spin the Reward Wheel!</h2>
      <p>Spins available: {spinsLeft}</p>
      <p>Points until next reward: {pointsUntilReward}</p>
      <button onClick={spin} disabled={spinning || spinsLeft <= 0}>
        {spinning ? 'Spinning...' : 'Spin'}
      </button>
      {lastReward && <p style={{ marginTop: '1rem' }}>You won: <strong>{lastReward}</strong></p>}
    </div>
  );
}
