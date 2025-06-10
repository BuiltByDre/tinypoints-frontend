import { useState, type ChangeEvent } from 'react'; // Added 'type' keyword for ChangeEvent
import { supabase } from '../supabaseClient';
import { AuthError } from '@supabase/supabase-js';

// Define the type for the hCaptcha verification response from your backend
interface VerifyCaptchaResponse {
  success: boolean;
  'error-codes'?: string[]; // Optional property for hCaptcha error codes
}

const AuthForm = () => {
  // State variables for form inputs and messages, explicitly typed as strings
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [captchaToken, setCaptchaToken] = useState<string>('');
  const [message, setMessage] = useState<string>('');

  // Get backend URL from environment variables.
  // Use 'import.meta.env.VITE_BACKEND_URL' for Vite projects,
  // or 'process.env.REACT_APP_BACKEND_URL' for Create React App projects.
  // Render will pick this up from your environment variables set in its dashboard.
  const backendUrl = import.meta.env.VITE_BACKEND_URL || process.env.REACT_APP_BACKEND_URL;

  const handleLogin = async () => {
    // Basic validation: ensure backend URL is configured
    if (!backendUrl) {
      setMessage('Backend URL is not configured. Please set REACT_APP_BACKEND_URL (or VITE_BACKEND_URL) in environment variables.');
      return;
    }

    // Basic validation: ensure captcha token is present
    if (!captchaToken) {
      setMessage('Please complete the captcha first.');
      return;
    }

    try {
      // Step 1: Verify hCaptcha token with your backend
      const verifyRes = await fetch(`${backendUrl}/verify-captcha`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token: captchaToken }),
      });

      // Parse the JSON response and cast it to the defined interface
      const verifyData: VerifyCaptchaResponse = await verifyRes.json();

      // Check if the captcha verification was successful
      if (!verifyRes.ok || !verifyData.success) {
        setMessage('Captcha verification failed. Please try again.');
        return;
      }

      // Step 2: Proceed with Supabase authentication after successful captcha verification
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
        // Supabase might have an 'options' field to pass additional data like captchaToken,
        // but it's typically handled by the backend. If your Supabase setup doesn't expect it here,
        // you can remove this 'options' block.
        options: {
          captchaToken, // Include captchaToken in options for Supabase, if needed by your RLS policies or custom logic
        },
      });

      // Update the message based on whether an error occurred
      // Type assertion 'as AuthError' is used to safely access the 'message' property of the error object
      setMessage(error ? (error as AuthError).message : 'Logged in successfully');

      // If no error, redirect to the dashboard
      if (!error) {
        window.location.href = '/dashboard'; // Redirect on successful login
      }
    } catch (err: any) { // Catch block variable type might need 'any' for unknown errors
      console.error('An error occurred during login process:', err);
      setMessage('An unexpected error occurred. Please try again.');
    }
  };

  return (
    <div className="auth-form">
      <input
        type="email"
        placeholder="Email"
        value={email}
        // Type the event object for onChange handler explicitly for TypeScript
        onChange={(e: ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
        className="input"
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        // Type the event object for onChange handler explicitly for TypeScript
        onChange={(e: ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
        className="input"
      />
      {/*
        IMPORTANT: This input for 'Captcha Token' is a placeholder for manual entry.
        In a real application, you would integrate a dedicated hCaptcha component here (e.g., from 'react-hcaptcha').
        Example of how you might use a react-hcaptcha component:
        <HCaptcha
          sitekey="YOUR_HCAPTCHA_SITE_KEY" // Replace with your hCaptcha site key
          onVerify={setCaptchaToken} // hCaptcha will call this with the token on successful verification
        />
      */}
      <input
        type="text"
        placeholder="Captcha Token (for testing/manual entry)"
        value={captchaToken}
        // Type the event object for onChange handler explicitly for TypeScript
        onChange={(e: ChangeEvent<HTMLInputElement>) => setCaptchaToken(e.target.value)}
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
