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
