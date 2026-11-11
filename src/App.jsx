
import { useEffect, useState } from 'react'
import './App.css'
import { supabase } from './supabaseClient'
import Auth from './Auth'
import CompanySetup from './CompanySetup'
import CRM from './CRM'

function App() {
  const [page, setPage] = useState('Dashboard')

  // Authentication
  const [session, setSession] = useState(null)
  const [authLoading, setAuthLoading] = useState(true)

  // Company
  const [company, setCompany] = useState(null)
  const [companyLoading, setCompanyLoading] = useState(false)
  const [companyError, setCompanyError] = useState('')

  // AI Content Creator
  const [business, setBusiness] = useState('')
  const [product, setProduct] = useState('')
  const [platform, setPlatform] = useState('Instagram')
  const [content, setContent] = useState('')

  // Social Media Planner
  const [posts, setPosts] = useState([])
  const [postText, setPostText] = useState('')
  const [postPlatform, setPostPlatform] = useState('Instagram')
  const [postDate, setPostDate] = useState('')
  const [postsLoading, setPostsLoading] = useState(false)
  const [postMessage, setPostMessage] = useState('')

 
const [keyword, setKeyword] = useState('')
const [seoTips, setSeoTips] = useState('')

  // Check login session
  useEffect(() => {
    let mounted = true

    async function checkSession() {
      const { data, error } = await supabase.auth.getSession()

      if (!mounted) return

      if (error) {
        console.error(error.message)
      }

      setSession(data?.session ?? null)
      setAuthLoading(false)
    }

    checkSession()

    const {
      data: { subscription }
    } = supabase.auth.onAuthStateChange((_event, newSession) => {
      setSession(newSession)
    })

    return () => {
      mounted = false
      subscription.unsubscribe()
    }
  }, [])

  // Load logged-in user's company
  useEffect(() => {
    let active = true

    async function loadCompany() {
      if (!session?.user) {
        setCompany(null)
        setCompanyLoading(false)
        return
      }

      setCompany(null)
      setCompanyError('')
      setCompanyLoading(true)

      const { data, error } = await supabase
        .from('companies')
        .select('id, name')
        .order('created_at', { ascending: true })
        .limit(1)
        .maybeSingle()

      if (!active) return

      if (error) {
        setCompanyError(error.message)
      } else {
        setCompany(data)
      }

      setCompanyLoading(false)
    }

    loadCompany()

    return () => {
      active = false
    }
  }, [session?.user?.id])

  // Load company posts from Supabase
  useEffect(() => {
    let active = true

    async function loadPosts() {
      if (!company?.id) {
        setPosts([])
        return
      }

      setPostsLoading(true)
      setPostMessage('')

      const { data, error } = await supabase
        .from('social_posts')
        .select('id, content, platform, planned_at')
        .eq('company_id', company.id)
        .order('planned_at', { ascending: true })

      if (!active) return

      if (error) {
        setPostMessage('Could not load posts: ' + error.message)
      } else {
        const formattedPosts = (data || []).map(post => ({
          id: post.id,
          text: post.content,
          platform: post.platform.charAt(0).toUpperCase() + post.platform.slice(1),
          date: post.planned_at.slice(0, 10)
        }))

        setPosts(formattedPosts)
      }

      setPostsLoading(false)
    }

    loadPosts()

    return () => {
      active = false
    }
  }, [company?.id])

  // Generate promotional content
  function generateContent() {
    if (!business.trim() || !product.trim()) {
      setContent('Please enter your business name and product.')
      return
    }

    setContent(
      `✨ Discover ${product} at ${business}!

Looking for something special? We have just what you need.

📩 Contact us today to learn more!

#${product.replace(/\s+/g, '')} #${business.replace(/\s+/g, '')} #SpecialOffer`
    )
  }

  // Save post to Supabase
  async function addPost() {
    if (!postText.trim() || !postDate) {
      setPostMessage('Please enter your post and choose a date.')
      return
    }

    if (!company?.id || !session?.user?.id) {
      setPostMessage('Please login and create a company first.')
      return
    }

    setPostsLoading(true)
    setPostMessage('')

    const { data, error } = await supabase
      .from('social_posts')
      .insert({
        company_id: company.id,
        created_by: session.user.id,
        platform: postPlatform.toLowerCase(),
        content: postText.trim(),
        planned_at: `${postDate}T12:00:00+00:00`,
        status: 'planned'
      })
      .select('id, content, platform, planned_at')
      .single()

    if (error) {
      setPostMessage('Could not save post: ' + error.message)
    } else {
      const newPost = {
        id: data.id,
        text: data.content,
        platform: data.platform.charAt(0).toUpperCase() + data.platform.slice(1),
        date: data.planned_at.slice(0, 10)
      }

      setPosts(previous => [...previous, newPost])
      setPostText('')
      setPostDate('')
      setPostMessage('Post saved successfully!')
    }

    setPostsLoading(false)
  }

  // Delete post from Supabase
  async function deletePost(id) {
    const { error } = await supabase
      .from('social_posts')
      .delete()
      .eq('id', id)
      .eq('company_id', company.id)

    if (error) {
      setPostMessage('Could not delete post: ' + error.message)
      return
    }

    setPosts(previous => previous.filter(post => post.id !== id))
    setPostMessage('Post deleted successfully.')
  }


  // Analytics
  const platformCounts = {
    Instagram: posts.filter(post => post.platform === 'Instagram').length,
    Facebook: posts.filter(post => post.platform === 'Facebook').length,
    LinkedIn: posts.filter(post => post.platform === 'LinkedIn').length
  }

  // Loading and authentication screens
  if (authLoading) {
    return <p>Loading SmartMarket AI...</p>
  }

  if (!session) {
    return <Auth />
  }

  if (companyLoading) {
    return <p>Loading your company...</p>
  }

  if (companyError) {
    return <section><p>Company loading error: {companyError}</p></section>
  }

  if (!company) {
    return (
      <CompanySetup
        user={session.user}
        onComplete={async () => {
          const { data, error } = await supabase
            .from('companies')
            .select('id, name')
            .order('created_at', { ascending: true })
            .limit(1)
            .maybeSingle()

          if (error) {
            setCompanyError(error.message)
          } else {
            setCompany(data)
          }
        }}
      />
    )
  }

  return (
    <div className="app">
      <header>
        <h1>🚀 SmartMarket AI</h1>
        <p>Company: {company.name}</p>

        <nav>
          {[
            'Dashboard',
            'AI Content Creator',
            'Social Media Planner',
            'CRM',
            'Analytics',
            'Settings'
          ].map(item => (
            <button
              key={item}
              onClick={() => setPage(item)}
              className={page === item ? 'active' : ''}
            >
              {item}
            </button>
          ))}
        </nav>
      </header>

      <main>
        {page === 'Dashboard' && (
          <section>
            <h2>Welcome to SmartMarket AI 👋</h2>
            <p>Your simple AI-powered digital marketing assistant.</p>

            <div className="dashboard-cards">
              <div className="card">
                <h3>✍️ AI Content Creator</h3>
                <p>Create promotional content for your business.</p>
                <button onClick={() => setPage('AI Content Creator')}>Get Started</button>
              </div>

              <div className="card">
                <h3>📅 Social Media Planner</h3>
                <p>Organize your upcoming social media posts.</p>
                <button onClick={() => setPage('Social Media Planner')}>Get Started</button>
              </div>
              <div className="card">
                <h3>👥 Customer Management</h3>
                <p>Manage customers, leads and follow-ups.</p>
                <button onClick={() => setPage('CRM')}>Manage Customers
                </button>
                </div>


              <div className="card">
                <h3>📊 Analytics</h3>
                <p>View your marketing activity in one place.</p>
                <button onClick={() => setPage('Analytics')}>View Analytics</button>
              </div>
            </div>
          </section>
        )}

        {page === 'AI Content Creator' && (
          <section className="creator">
            <h2>✍️ AI Content Creator</h2>
            <p>Create promotional content for your business.</p>

            <label>Business name</label>
            <input
              value={business}
              onChange={e => setBusiness(e.target.value)}
              placeholder="Enter your business name"
            />

            <label>Product or service</label>
            <input
              value={product}
              onChange={e => setProduct(e.target.value)}
              placeholder="Enter your product"
            />

            <label>Select platform</label>
            <select value={platform} onChange={e => setPlatform(e.target.value)}>
              <option>Instagram</option>
              <option>Facebook</option>
              <option>LinkedIn</option>
            </select>

            <button onClick={generateContent}>Generate Content</button>

            {content && (
              <div className="result">
                <h3>Your {platform} Content</h3>
                <p>{content}</p>
              </div>
            )}
          </section>
        )}

        {page === 'Social Media Planner' && (
          <section className="creator">
            <h2>📅 Social Media Planner</h2>
            <p>Plan your upcoming social media posts.</p>

            <label>Write your post</label>
            <textarea
              value={postText}
              onChange={e => setPostText(e.target.value)}
              placeholder="Write your social media post..."
            />

            <label>Select platform</label>
            <select
              value={postPlatform}
              onChange={e => setPostPlatform(e.target.value)}
            >
              <option>Instagram</option>
              <option>Facebook</option>
              <option>LinkedIn</option>
            </select>

            <label>Choose posting date</label>
            <input
              type="date"
              value={postDate}
              onChange={e => setPostDate(e.target.value)}
            />

            <button onClick={addPost} disabled={postsLoading}>
              {postsLoading ? 'Please wait...' : 'Save Planned Post'}
            </button>

            {postMessage && <p>{postMessage}</p>}

            <div className="result">
              <h3>Your Planned Posts ({posts.length})</h3>

              {postsLoading ? (
                <p>Loading posts...</p>
              ) : posts.length === 0 ? (
                <p>No planned posts yet. Create your first post above!</p>
              ) : (
                posts.map(post => (
                  <div className="post-card" key={post.id}>
                    <h4>{post.platform} — {post.date}</h4>
                    <p>{post.text}</p>
                    <button onClick={() => deletePost(post.id)}>
                      Delete Post
                    </button>
                  </div>
                ))
              )}
            </div>
          </section>
        )}

        {page === 'CRM' && (
  <CRM company={company} user={session.user} />
)}
        {page === 'Analytics' && (
          <section className="analytics">
            <h2>📊 Marketing Analytics</h2>
            <p>Track your social media planning activity.</p>

            <div className="analytics-cards">
              <div className="analytics-card">
                <span>📝</span>
                <h3>Total Planned Posts</h3>
                <h2>{posts.length}</h2>
                <p>All saved posts</p>
              </div>

              <div className="analytics-card">
                <span>📸</span>
                <h3>Instagram Posts</h3>
                <h2>{platformCounts.Instagram}</h2>
                <p>Instagram plans</p>
              </div>

              <div className="analytics-card">
                <span>📘</span>
                <h3>Facebook Posts</h3>
                <h2>{platformCounts.Facebook}</h2>
                <p>Facebook plans</p>
              </div>

              <div className="analytics-card">
                <span>💼</span>
                <h3>LinkedIn Posts</h3>
                <h2>{platformCounts.LinkedIn}</h2>
                <p>LinkedIn plans</p>
              </div>
            </div>

            <div className="analytics-panel">
              <h3>📈 Platform Performance</h3>
              <p>Distribution of your planned posts.</p>

              {Object.entries(platformCounts).map(([name, count]) => (
                <div className="analytics-progress" key={name}>
                  <div className="progress-heading">
                    <span>{name}</span>
                    <strong>{count} posts</strong>
                  </div>

                  <div className="progress-track">
                    <div
                      className="progress-fill"
                      style={{
                        width: `${posts.length ? (count / posts.length) * 100 : 0}%`
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>

            <div className="analytics-panel">
              <h3>📅 Monthly Planned Posts</h3>

              <div className="monthly-chart">
                {[
                  'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
                  'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
                ].map((month, index) => {
                  const count = posts.filter(post =>
                    new Date(post.date + 'T00:00:00').getMonth() === index
                  ).length

                  const maxCount = Math.max(
                    1,
                    ...Array.from({ length: 12 }, (_, i) =>
                      posts.filter(post =>
                        new Date(post.date + 'T00:00:00').getMonth() === i
                      ).length
                    )
                  )

                  return (
                    <div className="month-column" key={month}>
                      <strong>{count}</strong>
                      <div className="month-bar-area">
                        <div
                          className="month-bar"
                          style={{
                            height: `${count ? (count / maxCount) * 100 : 0}%`
                          }}
                        />
                      </div>
                      <span>{month}</span>
                    </div>
                  )
                })}
              </div>
            </div>

            <div className="analytics-panel">
              <h3>📋 Recent Planned Posts</h3>

              {posts.length === 0 ? (
                <p>No planned posts available.</p>
              ) : (
                [...posts].reverse().slice(0, 5).map(post => (
                  <div className="analytics-post" key={post.id}>
                    <div>
                      <strong>{post.platform}</strong>
                      <p>{post.text}</p>
                    </div>
                    <span>{post.date}</span>
                  </div>
                ))
              )}
            </div>

            <p className="analytics-note">
              These statistics show planned posts only.
              Real likes, reach, comments and engagement require social media account connections.
            </p>
          </section>
        )}

        {page === 'Settings' && (
          <section>
            <h2>⚙️ Settings</h2>
            <p>Company: {company.name}</p>
            <p>Logged in as: {session.user.email}</p>
            <button
              onClick={async () => {
                const { error } = await supabase.auth.signOut()
                if (error) alert(error.message)
              }}
            >
              Logout
            </button>
          </section>
        )}
      </main>
    </div>
  )
}

export default App
