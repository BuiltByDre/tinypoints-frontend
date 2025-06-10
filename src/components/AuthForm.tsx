import { useState } from 'react';
import { supabase } from '../supabaseClient';

export default function AuthForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');

  const handleLogin = async () => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setMessage(error ? error.message : 'Logged in successfully');
  };

  const handleRegister = async () => {
    const { error } = await supabase.auth.signUp({ email, password });
    setMessage(error ? error.message : 'Registered successfully. Check your email.');
  };

  const handleGuest = async () => {
    const random = Math.random().toString(36).slice(2, 10);
    const guestEmail = `guest+${random}@tinypoints.io`;
    const guestPassword = 'guest1234';

    const { error } = await supabase.auth.signUp({
      email: guestEmail,
      password: guestPassword,
    });

    if (error && !error.message.includes('already registered')) {
      setMessage(error.message);
    } else {
      const { error: loginError } = await supabase.auth.signInWithPassword({
        email: guestEmail,
        password: guestPassword,
      });
      setMessage(loginError ? loginError.message : 'Guest login successful!');
      localStorage.setItem('isGuest', 'true');
    }
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>TinyPoints Login/Register</h2>
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        style={{ display: 'block', marginBottom: 10 }}
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        style={{ display: 'block', marginBottom: 10 }}
      />
      <button onClick={handleLogin}>Login</button>
      <button onClick={handleRegister} style={{ marginLeft: 10 }}>
        Register
      </button>
      <div style={{ marginTop: 20 }}>
        <button onClick={handleGuest}>Continue as Guest</button>
      </div>
      {message && <p style={{ marginTop: 20 }}>{message}</p>}
    </div>
  );
}
