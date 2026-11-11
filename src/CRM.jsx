
import { useEffect, useState } from 'react'
import { supabase } from './supabaseClient'

function CRM({ company, user }) {
  const [customers, setCustomers] = useState([])
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [status, setStatus] = useState('New')
  const [notes, setNotes] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')

  useEffect(() => {
    if (company?.id) loadCustomers()
  }, [company?.id])

  async function loadCustomers() {
    const { data, error } = await supabase
      .from('customers')
      .select('*')
      .eq('company_id', company.id)
      .order('created_at', { ascending: false })

    if (error) {
      setMessage(error.message)
      return
    }

    setCustomers(data || [])
  }

  async function addCustomer(e) {
    e.preventDefault()
    setLoading(true)
    setMessage('')

    const { data, error } = await supabase
      .from('customers')
      .insert({
        company_id: company.id,
        created_by: user.id,
        name,
        email,
        phone,
        status,
        notes
      })
      .select()
      .single()

    if (error) {
      setMessage(error.message)
    } else {
      setCustomers(prev => [data, ...prev])
      setName('')
      setEmail('')
      setPhone('')
      setStatus('New')
      setNotes('')
      setMessage('Customer added successfully!')
    }

    setLoading(false)
  }

  async function deleteCustomer(id) {
    const { error } = await supabase
      .from('customers')
      .delete()
      .eq('id', id)
      .eq('company_id', company.id)

    if (error) {
      setMessage(error.message)
      return
    }

    setCustomers(prev => prev.filter(customer => customer.id !== id))
    setMessage('Customer deleted successfully!')
  }

  async function updateStatus(id, newStatus) {
    const { error } = await supabase
      .from('customers')
      .update({ status: newStatus, updated_at: new Date().toISOString() })
      .eq('id', id)
      .eq('company_id', company.id)

    if (error) {
      setMessage(error.message)
      return
    }

    setCustomers(prev =>
      prev.map(customer =>
        customer.id === id
          ? { ...customer, status: newStatus }
          : customer
      )
    )
  }

  return (
    <div style={{ padding: '25px' }}>
      <h1>Customer Management</h1>
      <p>Manage your company customers and leads.</p>

      <h2>Add New Customer</h2>

      <form onSubmit={addCustomer} style={{ display: 'grid', gap: '12px', maxWidth: '450px' }}>
        <input
          placeholder="Customer Name"
          value={name}
          onChange={e => setName(e.target.value)}
          required
        />

        <input
          type="email"
          placeholder="Email Address"
          value={email}
          onChange={e => setEmail(e.target.value)}
        />

        <input
          placeholder="Phone Number"
          value={phone}
          onChange={e => setPhone(e.target.value)}
        />

        <select value={status} onChange={e => setStatus(e.target.value)}>
          <option>New</option>
          <option>Contacted</option>
          <option>Converted</option>
        </select>

        <textarea
          placeholder="Customer Notes"
          value={notes}
          onChange={e => setNotes(e.target.value)}
        />

        <button type="submit" disabled={loading}>
          {loading ? 'Saving...' : 'Add Customer'}
        </button>
      </form>

      {message && <p>{message}</p>}

      <h2>Customer List ({customers.length})</h2>

      {customers.length === 0 && <p>No customers added yet.</p>}

      {customers.map(customer => (
        <div
          key={customer.id}
          style={{
            border: '1px solid #ddd',
            padding: '15px',
            borderRadius: '8px',
            marginBottom: '12px'
          }}
        >
          <h3>{customer.name}</h3>
          <p>Email: {customer.email || '-'}</p>
          <p>Phone: {customer.phone || '-'}</p>
          <p>Notes: {customer.notes || '-'}</p>

          <label>Lead Status: </label>
          <select
            value={customer.status}
            onChange={e => updateStatus(customer.id, e.target.value)}
          >
            <option>New</option>
            <option>Contacted</option>
            <option>Converted</option>
          </select>

          <br /><br />

          <button onClick={() => deleteCustomer(customer.id)}>
            Delete Customer
          </button>
        </div>
      ))}
    </div>
  )
}

export default CRM
