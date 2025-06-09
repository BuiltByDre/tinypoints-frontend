import { useState, useRef } from 'react';
import HCaptcha from '@hcaptcha/react-hcaptcha';
import { supabase } from '../supabaseClient';

const SITE_KEY = 'bf645a8c-c2de-4edc-adc8-1de4002c3a60'; // replace with your actual site key

const AuthForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [captchaToken, setCaptchaToken] = useState<string | null>(null);

  // Use React.RefObject for better typing
  const hcaptchaRef = useRef<HCaptcha>(null);

  const handleLogin = async () => {
    if (!captchaToken) {
      setMessage('Please complete the captcha first.');
      return;
    }

    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setMessage(error ? error.message : 'Logged in successfully');
    if (!error) window.location.href = '/dashboard';
  };

  const handleRegister = async () => {
    if (!captchaToken) {
      setMessage('Please complete the captcha first.');
      return;
    }

    const { error } = await supabase.auth.signUp({ email, password });
    setMessage(error ? error.message : 'Registered successfully. Check your email.');
  };

  const handleGuest = async () => {
    const random = Math.random().toString(36).slice(2, 10);
    const guestEmail = `guest+${random}@tinypoints.io`;
    const guestPassword = 'guest1234';

    const { error: signUpError } = await supabase.auth.signUp({
      email: guestEmail,
      password: guestPassword,
    });

    if (signUpError && !signUpError.message.includes('already registered')) {
      setMessage(signUpError.message);
      return;
    }

    const { error: loginError } = await supabase.auth.signInWithPassword({
      email: guestEmail,
      password: guestPassword,
    });

    if (loginError) {
      setMessage(loginError.message);
    } else {
      localStorage.setItem('isGuest', 'true');
      setMessage('Guest login successful!');
      window.location.href = '/dashboard';
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

      <HCaptcha
        sitekey={SITE_KEY}
        onVerify={(token: string) => {
          setCaptchaToken(token);
          setMessage('');
        }}
        onExpire={() => setCaptchaToken(null)}
        ref={hcaptchaRef}
      />

      <button onClick={handleLogin} disabled={!captchaToken} style={{ marginTop: 10 }}>
        Login
      </button>
      <button onClick={handleRegister} style={{ marginLeft: 10 }} disabled={!captchaToken}>
        Register
      </button>

      <div style={{ marginTop: 20 }}>
        <button onClick={handleGuest}>Continue as Guest</button>
      </div>

      {message && <p style={{ marginTop: 20 }}>{message}</p>}
    </div>
  );
};

export default AuthForm;
