import { supabase } from '../supabaseClient';

function generateRandomEmail() {
  return `guest_${Math.random().toString(36).substring(2, 10)}@example.com`;
}

function generateRandomPassword() {
  return Math.random().toString(36).slice(-8) + 'A1!'; // Simple strong-ish password
}

export async function guestLogin() {
  const email = generateRandomEmail();
  const password = generateRandomPassword();

  // Sign up guest user
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        guest: true,
        created_at: new Date().toISOString(),
      },
    },
  });

  if (error) {
    console.error('Guest signup error:', error.message);
    return null;
  }

  // Sign in the guest user
  const { session, error: signInError } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (signInError) {
    console.error('Guest signin error:', signInError.message);
    return null;
  }

  // Mark localStorage for guest session
  localStorage.setItem('isGuest', 'true');

  return session;
}
