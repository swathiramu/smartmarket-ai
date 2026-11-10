
import { useState } from 'react'
import { supabase } from './supabaseClient'

function CompanySetup({ user, onComplete }) {
  const [companyName, setCompanyName] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')

  async function createCompany(e) {
    e.preventDefault()
    setLoading(true)
    setMessage('')

    try {
      const { error } = await supabase
        .from('companies')
        .insert({
          name: companyName,
          created_by: user.id
        })

      if (error) throw error

      onComplete()
    } catch (error) {
      setMessage(error.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ maxWidth: '400px', margin: '60px auto' }}>
      <h2>Create Your Company</h2>
      <form onSubmit={createCompany}>
        <input
          value={companyName}
          onChange={(e) => setCompanyName(e.target.value)}
          placeholder="Enter company name"
          required
        />
        <button disabled={loading}>
          {loading ? 'Creating...' : 'Create Company'}
        </button>
      </form>
      {message && <p>{message}</p>}
    </div>
  )
}

export default CompanySetup
