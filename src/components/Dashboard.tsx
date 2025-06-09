import { useEffect, useState } from 'react';
import type { User } from '@supabase/supabase-js';
import { supabase } from '../supabaseClient';
import RewardTracker from './RewardTracker';
import SpinWheel from './SpinWheel';

type Behavior = {
  id: string;
  child_id: string;
  reason: string;
  points: number;
  type: string;
  created_at: string;
};

type Child = {
  id: string;
  user_id: string;
  name: string;
  created_at: string;
};

type DashboardProps = {
  user: User;
};

export default function Dashboard({ user }: DashboardProps) {
  const [children, setChildren] = useState<Child[]>([]);
  const [selectedChild, setSelectedChild] = useState<string>('');
  const [childName, setChildName] = useState('');
  const [behaviors, setBehaviors] = useState<Behavior[]>([]);
  const [newBehavior, setNewBehavior] = useState({ reason: '', points: 0, type: 'positive' });

  useEffect(() => {
    fetchChildren();
  }, [user]);

  const fetchChildren = async () => {
    const { data } = await supabase.from('children').select('*').eq('user_id', user.id);
    if (data) setChildren(data);
  };

  const addChild = async () => {
    if (!childName.trim()) return;
    await supabase.from('children').insert([{ name: childName, user_id: user.id }]);
    setChildName('');
    fetchChildren();
  };

  const deleteChild = async (id: string) => {
    await supabase.from('children').delete().eq('id', id);
    setChildren(children.filter(c => c.id !== id));
    if (selectedChild === id) {
      setSelectedChild('');
      setBehaviors([]);
    }
  };

  const logBehavior = async () => {
    if (!selectedChild || !newBehavior.reason || newBehavior.points === 0) return;

    await supabase.from('behaviors').insert([
      {
        child_id: selectedChild,
        reason: newBehavior.reason,
        points: newBehavior.points,
        type: newBehavior.type,
      },
    ]);
    fetchBehaviors(selectedChild);
    setNewBehavior({ reason: '', points: 0, type: 'positive' });
  };

  const fetchBehaviors = async (childId: string) => {
    const { data } = await supabase.from('behaviors').select('*').eq('child_id', childId);
    if (data) setBehaviors(data);
  };

  const deleteBehavior = async (id: string) => {
    await supabase.from('behaviors').delete().eq('id', id);
    if (selectedChild) fetchBehaviors(selectedChild);
  };

  const deleteUser = async () => {
    await supabase.auth.signOut();
    await supabase.from('children').delete().eq('user_id', user.id);
    setChildren([]);
    setSelectedChild('');
    setBehaviors([]);
  };

  const totalPoints = behaviors.reduce((sum, b) => sum + b.points, 0);
  const threshold = 100;

  // Number of full rewards earned
  const rewardsAvailable = Math.floor(totalPoints / threshold);

  // Progress into current tier
  const progressInTier = totalPoints % threshold;

  // Points until next reward (0 if rewards available)
  const pointsUntilReward = rewardsAvailable > 0 ? 0 : threshold - progressInTier;

  return (
    <div style={{ padding: '2rem' }}>
      <SpinWheel rewardsAvailable={rewardsAvailable} pointsUntilReward={pointsUntilReward} />

      <RewardTracker behaviors={behaviors} threshold={threshold} />

      <h2>Welcome, {user.email}</h2>

      <h3>Add a Child</h3>
      <input
        type="text"
        value={childName}
        onChange={(e) => setChildName(e.target.value)}
        placeholder="Child's name"
      />
      <button onClick={addChild}>Add Child</button>

      <h3>Your Children</h3>
      <ul>
        {children.map((child) => (
          <li key={child.id}>
            {child.name}{' '}
            <button
              onClick={() => {
                setSelectedChild(child.id);
                fetchBehaviors(child.id);
              }}
            >
              View Behaviors
            </button>{' '}
            <button onClick={() => deleteChild(child.id)}>Delete Child</button>
          </li>
        ))}
      </ul>

      {selectedChild && (
        <>
          <h3>Log Behavior</h3>
          <input
            type="text"
            value={newBehavior.reason}
            onChange={(e) => setNewBehavior({ ...newBehavior, reason: e.target.value })}
            placeholder="Reason"
          />
          <input
            type="number"
            value={Math.abs(newBehavior.points)}
            onChange={(e) => {
              let val = Number(e.target.value);
              val = newBehavior.type === 'negative' ? -Math.abs(val) : Math.abs(val);
              setNewBehavior({ ...newBehavior, points: val });
            }}
            placeholder="Points"
          />
          <select
            value={newBehavior.type}
            onChange={(e) => {
              const newType = e.target.value;
              let adjustedPoints = newBehavior.points;
              adjustedPoints = newType === 'negative' ? -Math.abs(adjustedPoints) : Math.abs(adjustedPoints);
              setNewBehavior({ ...newBehavior, type: newType, points: adjustedPoints });
            }}
          >
            <option value="positive">Positive</option>
            <option value="negative">Negative</option>
          </select>
          <button onClick={logBehavior}>Log Behavior</button>

          <h3>Behaviors</h3>
          <ul>
            {behaviors.map((b) => (
              <li key={b.id}>
                {b.type} – {b.points} points – {b.reason} – {new Date(b.created_at).toLocaleString()}
                <button onClick={() => deleteBehavior(b.id)}>Delete Behavior</button>
              </li>
            ))}
          </ul>
          <p>Total Points: {totalPoints} | Rewards Available: {rewardsAvailable}</p>
          <p>Reward Progress: {totalPoints} / {threshold}</p>
          <p>Points until next reward: {pointsUntilReward}</p>
        </>
      )}

      <button style={{ marginTop: '4rem', backgroundColor: 'red', color: 'white' }} onClick={deleteUser}>
        Delete User Account
      </button>
    </div>
  );
}
