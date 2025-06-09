import { useEffect, useState } from 'react';
import Dashboard from './components/Dashboard';
import AuthForm from './components/AuthForm';
import { supabase } from './supabaseClient';
import type { User } from '@supabase/supabase-js';

export default function App() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user ?? null);
      setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      const currentUser = session?.user ?? null;

      // Delete guest data on logout
      if (!currentUser && user?.email === 'guest@tinypoints.io') {
        const { data: children } = await supabase.from('children').select('id').eq('user_id', user.id);
        if (children) {
          const childIds = children.map((c) => c.id);
          await supabase.from('behaviors').delete().in('child_id', childIds);
          await supabase.from('children').delete().eq('user_id', user.id);
        }
      }

      setUser(currentUser);
    });

    return () => subscription.unsubscribe();
  }, [user]);

  if (loading) return <p>Loading…</p>;

  return user ? <Dashboard user={user} /> : <AuthForm />;
}
