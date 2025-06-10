import { useState } from 'react';
import { supabase } from '../supabaseClient';

const AuthForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [captchaToken, setCaptchaToken] = useState('');
  const [message, setMessage] = useState('');

  const handleLogin = async () => {
    if (!captchaToken) {
      setMessage('Please complete the captcha first.');
      return;
    }

    try {
      const verifyRes = await fetch('/verify-captcha', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token: captchaToken }),
      });

      const verifyData = await verifyRes.json();

      if (!verifyRes.ok || !verifyData.success) {
        setMessage('Captcha verification failed. Please try again.');
        return;
      }

      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
        options: {
          captchaToken,
        },
      });

      setMessage(error ? error.message : 'Logged in successfully');

      if (!error) {
        window.location.href = '/dashboard';
      }
    } catch (err) {
      console.error(err);
      setMessage('An unexpected error occurred. Please try again.');
    }
  };

  return (
    <div className="auth-form">
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={e => setEmail(e.target.value)}
        className="input"
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={e => setPassword(e.target.value)}
        className="input"
      />
      {/* Replace with your actual captcha component or script */}
      <input
        type="text"
        placeholder="Captcha Token"
        value={captchaToken}
        onChange={e => setCaptchaToken(e.target.value)}
        className="input"
      />
      <button onClick={handleLogin} className="btn">
        Login
      </button>
      {message && <p>{message}</p>}
    </div>
  );
};

export default AuthForm;
