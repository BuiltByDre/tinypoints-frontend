const handleLogin = async () => {
  if (!captchaToken) {
    setMessage('Please complete the captcha first.');
    return;
  }

  // Verify captcha token on backend
  const verifyRes = await fetch('http://localhost:5000/verify-captcha', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ token: captchaToken }),
  });

  const verifyData = await verifyRes.json();

  if (!verifyRes.ok || !verifyData.success) {
    setMessage('Captcha verification failed. Please try again.');
    return;
  }

  // Proceed with login if captcha verified
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
};
