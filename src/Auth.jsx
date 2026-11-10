
import { useState } from 'react'
import { supabase } from './supabaseClient'

function Auth() {
  const [isSignup, setIsSignup] = useState(true)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setMessage('')

    try {
      if (isSignup) {
        const { error } = await supabase.auth.signUp({
          email,
          password
        })

        if (error) throw error

        setMessage(
          'Signup successful! Check your email for confirmation if required.'
        )
      } else {
        const { error } =
          await supabase.auth.signInWithPassword({
            email,
            password
          })

        if (error) throw error

        setMessage('Login successful!')
      }
    } catch (error) {
      setMessage(error.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{
      maxWidth: '400px',
      margin: '60px auto',
      padding: '30px',
      border: '1px solid #ddd',
      borderRadius: '12px'
    }}>
      <h2>SmartMarket AI</h2>

      <h3>{isSignup ? 'Create Account' : 'Welcome Back'}</h3>

      <form onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          style={{ width: '100%', padding: '12px', marginBottom: '15px' }}
        />

        <input
          type="password"
          placeholder="Enter password (minimum 6 characters)"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          minLength={6}
          required
          style={{ width: '100%', padding: '12px', marginBottom: '15px' }}
        />

        <button
          type="submit"
          disabled={loading}
          style={{ width: '100%', padding: '12px', cursor: 'pointer' }}
        >
          {loading
            ? 'Please wait...'
            : isSignup
              ? 'Sign Up'
              : 'Login'}
        </button>
      </form>

      {message && (
        <p style={{ marginTop: '15px' }}>{message}</p>
      )}

      <p>
        {isSignup
          ? 'Already have an account?'
          : "Don't have an account?"}
      </p>

      <button
        onClick={() => {
          setIsSignup(!isSignup)
          setMessage('')
        }}
      >
        {isSignup ? 'Login here' : 'Create an account'}
      </button>
    </div>
  )
}

export default Auth
