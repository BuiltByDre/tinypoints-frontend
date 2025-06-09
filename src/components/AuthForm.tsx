import { useState } from 'react'
import { supabase } from '../supabaseClient'

export default function AuthForm() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [message, setMessage] = useState('')

  const handleLogin = async () => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })
    setMessage(error ? error.message : 'Logged in successfully')
  }

  const handleRegister = async () => {
    const { error } = await supabase.auth.signUp({
      email,
      password,
    })
    setMessage(error ? error.message : 'Registered successfully. Check your email.')
  }

  const handleGuest = async () => {
    const { error } = await supabase.auth.signInWithPassword({
      email: 'guest@tinypoints.io',
      password: 'guest1234',
    })
    setMessage(error ? error.message : 'Guest login successful!')
  }

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
      <button onClick={handleRegister} style={{ marginLeft: 10 }}>Register</button>
      <div style={{ marginTop: 20 }}>
        <button onClick={handleGuest}>Continue as Guest</button>
      </div>
      {message && <p style={{ marginTop: 20 }}>{message}</p>}
    </div>
  )
}
