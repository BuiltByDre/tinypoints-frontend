import { useState } from 'react';
import { supabase } from '../supabaseClient';
import { guestLogin } from '../utils/guestAuth';

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

  // Updated guest login handler using guestLogin utility function
  const handleGuest = async () => {
    setMessage('Logging in as guest...');
    const session = await guestLogin();
    if (session) {
      setMessage('Guest login successful!');
      localStorage.setItem('isGuest', 'true');
      window.location.href = '/dashboard';
    } else {
      setMessage('Failed to login as guest.');
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
