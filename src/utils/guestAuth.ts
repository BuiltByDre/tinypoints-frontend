// src/utils/guestAuth.ts
import { supabase } from '../supabaseClient';

export async function guestLogin() {
  const random = Math.random().toString(36).substring(2, 10);
  const guestEmail = `guest+${random}@tinypoints.io`;
  const guestPassword = 'guest1234';

  // Try to sign up the guest user
  const signUpResponse = await supabase.auth.signUp({
    email: guestEmail,
    password: guestPassword,
  });

  // If the error is something other than "already registered"
  if (signUpResponse.error && !signUpResponse.error.message.includes('already registered')) {
    console.error('Signup error:', signUpResponse.error.message);
    return null;
  }

  // Now try to sign in
  const signInResponse = await supabase.auth.signInWithPassword({
    email: guestEmail,
    password: guestPassword,
  });

  if (signInResponse.error) {
    console.error('Sign-in error:', signInResponse.error.message);
    return null;
  }

  const { session } = signInResponse.data;
  return session ?? null;
}
