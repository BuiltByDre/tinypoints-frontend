import { useState, useEffect, useRef } from 'react';

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

const segmentCount = rewardOptions.length;
const segmentAngle = 360 / segmentCount;

export default function SpinWheel({ rewardsAvailable, pointsUntilReward, onSpinComplete }: SpinWheelProps) {
  const [spinning, setSpinning] = useState(false);
  const [lastReward, setLastReward] = useState<string | null>(null);
  const [spinsLeft, setSpinsLeft] = useState(rewardsAvailable);
  const wheelRef = useRef<HTMLDivElement>(null);

  const spinSoundRef = useRef<HTMLAudioElement | null>(null);
  const rewardSoundRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    setSpinsLeft(rewardsAvailable);
  }, [rewardsAvailable]);

  const spin = () => {
    if (spinning || spinsLeft <= 0) return;

    setSpinning(true);
    setLastReward(null);

    const winningIndex = Math.floor(Math.random() * segmentCount);
    const spins = 5;
    const stopAngle = 360 * spins + (360 - winningIndex * segmentAngle - segmentAngle / 2);

    if (spinSoundRef.current) {
      spinSoundRef.current.currentTime = 0;
      spinSoundRef.current.play();
    }

    if (wheelRef.current) {
      wheelRef.current.style.transition = 'transform 5s cubic-bezier(0.33, 1, 0.68, 1)';
      wheelRef.current.style.transform = `rotate(${stopAngle}deg)`;
    }

    setTimeout(() => {
      if (spinSoundRef.current) {
        spinSoundRef.current.pause();
        spinSoundRef.current.currentTime = 0;
      }

      const reward = rewardOptions[winningIndex];
      setLastReward(reward);
      setSpinning(false);
      setSpinsLeft(spinsLeft - 1);

      if (rewardSoundRef.current) {
        rewardSoundRef.current.currentTime = 0;
        rewardSoundRef.current.play();
      }

      if (onSpinComplete) onSpinComplete();
    }, 5000);
  };

  const resetWheel = () => {
    if (wheelRef.current) {
      wheelRef.current.style.transition = 'none';
      wheelRef.current.style.transform = 'rotate(0deg)';
    }
  };

  useEffect(() => {
    if (!spinning) {
      resetWheel();
    }
  }, [spinsLeft, spinning]);

  return (
    <div
      style={{
        marginBottom: '2rem',
        padding: '1rem',
        border: '2px dashed #999',
        borderRadius: '12px',
        textAlign: 'center',
        userSelect: 'none',
      }}
    >
      <h2>🎉 Spin the Reward Wheel!</h2>
      <p>Spins available: {spinsLeft}</p>
      <p>Points until next reward: {pointsUntilReward}</p>

      <div
        ref={wheelRef}
        style={{
          margin: '1rem auto',
          width: 300,
          height: 300,
          borderRadius: '50%',
          border: '8px solid #333',
          position: 'relative',
          overflow: 'hidden',
          boxShadow: '0 0 10px rgba(0,0,0,0.2)',
          cursor: spinning || spinsLeft <= 0 ? 'not-allowed' : 'pointer',
        }}
        onClick={spin}
        aria-disabled={spinning || spinsLeft <= 0}
      >
        {rewardOptions.map((reward, i) => {
          const rotation = i * segmentAngle;
          return (
            <div
              key={reward}
              style={{
                position: 'absolute',
                width: '50%',
                height: '50%',
                top: '50%',
                left: '50%',
                transformOrigin: '0% 0%',
                transform: `rotate(${rotation}deg) skewY(${90 - segmentAngle}deg)`,
                backgroundColor: i % 2 === 0 ? '#f0a500' : '#f7d488',
                border: '1px solid #ddd',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'flex-start',
                paddingLeft: '15px',
                fontWeight: 'bold',
                fontSize: 14,
                userSelect: 'none',
              }}
            >
              <span
                style={{
                  transform: `skewY(-${90 - segmentAngle}deg) rotate(${segmentAngle / 2}deg)`,
                }}
              >
                {reward}
              </span>
            </div>
          );
        })}

        <div
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            width: 50,
            height: 50,
            backgroundColor: '#333',
            borderRadius: '50%',
            transform: 'translate(-50%, -50%)',
            boxShadow: 'inset 0 0 10px #000',
            pointerEvents: 'none',
          }}
        />
      </div>

      <button
        onClick={spin}
        disabled={spinning || spinsLeft <= 0}
        style={{
          padding: '0.5rem 1.5rem',
          fontSize: 18,
          cursor: spinning || spinsLeft <= 0 ? 'not-allowed' : 'pointer',
          marginTop: '1rem',
        }}
      >
        {spinning ? 'Spinning...' : 'Spin'}
      </button>

      {lastReward && (
        <p style={{ marginTop: '1rem', fontWeight: 'bold', fontSize: 18 }}>
          You won: <span style={{ color: '#d9534f' }}>{lastReward}</span>
        </p>
      )}

      {/* Audio elements */}
      <audio ref={spinSoundRef} src="/spin-sound.mp3" preload="auto" />
      <audio ref={rewardSoundRef} src="/reward-sound.mp3" preload="auto" />
    </div>
  );
}
