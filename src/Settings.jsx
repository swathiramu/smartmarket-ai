
import { useState } from 'react'
import { supabase } from './supabaseClient'

function Settings({ user, company }) {
  const [activeTab, setActiveTab] = useState('Profile')
  const [name, setName] = useState(
    user?.user_metadata?.full_name || ''
  )
  const [password, setPassword] = useState('')
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)

  const [darkMode, setDarkMode] = useState(false)
  const [emailNotifications, setEmailNotifications] = useState(true)
  const [appNotifications, setAppNotifications] = useState(true)

  const tabs = [
    'Profile',
    'Company',
    'Appearance',
    'Notifications',
    'Security'
  ]

  const saveProfile = async () => {
    setLoading(true)
    setMessage('')

    const { error } = await supabase.auth.updateUser({
      data: { full_name: name }
    })

    setMessage(error ? error.message : 'Profile updated successfully!')
    setLoading(false)
  }

  const changePassword = async () => {
    if (password.length < 6) {
      setMessage('Password must contain at least 6 characters.')
      return
    }

    setLoading(true)

    const { error } = await supabase.auth.updateUser({
      password
    })

    setMessage(error ? error.message : 'Password changed successfully!')
    setPassword('')
    setLoading(false)
  }

  const logout = async () => {
    const { error } = await supabase.auth.signOut()
    if (error) setMessage(error.message)
  }

  return (
    <section className="settings-page">
      <h2>Settings</h2>
      <p>Manage your account and application preferences.</p>

      <div className="settings-layout">
        <div className="settings-tabs">
          {tabs.map(tab => (
            <button
              key={tab}
              className={activeTab === tab ? 'selected' : ''}
              onClick={() => {
                setActiveTab(tab)
                setMessage('')
              }}
            >
              {tab}
            </button>
          ))}
        </div>

        <div className="settings-content">
          {activeTab === 'Profile' && (
            <div>
              <h3>Profile Settings</h3>

              <label>Full Name</label>
              <input
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="Enter your name"
              />

              <label>Email Address</label>
              <input
                value={user?.email || ''}
                readOnly
              />

              <button onClick={saveProfile} disabled={loading}>
                {loading ? 'Saving...' : 'Save Profile'}
              </button>
            </div>
          )}

          {activeTab === 'Company' && (
            <div>
              <h3>Company Settings</h3>

              <label>Company Name</label>
              <input
                value={company?.name || ''}
                readOnly
              />

              <p>Company details are currently view-only.</p>
            </div>
          )}

          {activeTab === 'Appearance' && (
            <div>
              <h3>Appearance Settings</h3>

              <label className="settings-toggle">
                <span>Dark Mode</span>
                <input
                  type="checkbox"
                  checked={darkMode}
                  onChange={e => setDarkMode(e.target.checked)}
                />
              </label>

              <p>Theme selection will be applied in the next step.</p>
            </div>
          )}

          {activeTab === 'Notifications' && (
            <div>
              <h3>Notification Preferences</h3>

              <label className="settings-toggle">
                <span>Email Notifications</span>
                <input
                  type="checkbox"
                  checked={emailNotifications}
                  onChange={e => setEmailNotifications(e.target.checked)}
                />
              </label>

              <label className="settings-toggle">
                <span>App Notifications</span>
                <input
                  type="checkbox"
                  checked={appNotifications}
                  onChange={e => setAppNotifications(e.target.checked)}
                />
              </label>

              <p>These preferences are currently temporary.</p>
            </div>
          )}

          {activeTab === 'Security' && (
            <div>
              <h3>Security Settings</h3>

              <label>New Password</label>
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="Enter new password"
              />

              <button onClick={changePassword} disabled={loading}>
                {loading ? 'Updating...' : 'Change Password'}
              </button>

              <hr />

              <button className="logout-button" onClick={logout}>
                Logout
              </button>
            </div>
          )}

          {message && (
            <p className="settings-message">{message}</p>
          )}
        </div>
      </div>
    </section>
  )
}

export default Settings
