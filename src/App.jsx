
import { useState } from 'react'
import './App.css'

function App() {
  const [page, setPage] = useState('Dashboard')

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

  // SEO Tools
  const [keyword, setKeyword] = useState('')
  const [seoTips, setSeoTips] = useState('')

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

  function addPost() {
    if (!postText.trim() || !postDate) {
      alert('Please enter your post and choose a date.')
      return
    }

    setPosts([
      ...posts,
      {
        id: Date.now(),
        text: postText,
        platform: postPlatform,
        date: postDate
      }
    ])

    setPostText('')
    setPostDate('')
  }

  function deletePost(id) {
    setPosts(posts.filter(post => post.id !== id))
  }

  function generateSeoTips() {
    if (!keyword.trim()) {
      setSeoTips('Please enter a keyword first.')
      return
    }

    setSeoTips(
      `SEO suggestions for "${keyword}":

1. Include this keyword in your page title.
2. Use it naturally in your page description.
3. Add it to a relevant heading.
4. Write useful content related to this keyword.
5. Use the keyword naturally in your image descriptions.
6. Add links to related pages on your website.
7. Make sure your website works well on mobile devices.`
    )
  }

  const platformCounts = {
    Instagram: posts.filter(post => post.platform === 'Instagram').length,
    Facebook: posts.filter(post => post.platform === 'Facebook').length,
    LinkedIn: posts.filter(post => post.platform === 'LinkedIn').length
  }

  return (
    <div className="app">
      <header>
        <h1>🚀 SmartMarket AI</h1>
        <nav>
          {['Dashboard', 'AI Content Creator', 'Social Media Planner', 'SEO Tools', 'Analytics', 'Settings'].map(item => (
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
                <h3>🔍 SEO Tools</h3>
                <p>Get suggestions to improve website visibility.</p>
                <button onClick={() => setPage('SEO Tools')}>Get Started</button>
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
            <select value={postPlatform} onChange={e => setPostPlatform(e.target.value)}>
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

            <button onClick={addPost}>Save Planned Post</button>

            <div className="result">
              <h3>Your Planned Posts ({posts.length})</h3>

              {posts.length === 0 ? (
                <p>No planned posts yet. Create your first post above!</p>
              ) : (
                posts.map(post => (
                  <div className="post-card" key={post.id}>
                    <h4>{post.platform} — {post.date}</h4>
                    <p>{post.text}</p>
                    <button onClick={() => deletePost(post.id)}>Delete Post</button>
                  </div>
                ))
              )}
            </div>
          </section>
        )}

        {page === 'SEO Tools' && (
          <section className="creator">
            <h2>🔍 SEO Tools</h2>
            <p>Improve your website visibility with SEO suggestions.</p>

            <label>Enter your target keyword</label>
            <input
              value={keyword}
              onChange={e => setKeyword(e.target.value)}
              placeholder="Example: fashion shop in Coimbatore"
            />

            <button onClick={generateSeoTips}>Generate SEO Suggestions</button>

            {seoTips && (
              <div className="result">
                <h3>Your SEO Suggestions</h3>
                <p style={{ whiteSpace: 'pre-line' }}>{seoTips}</p>
              </div>
            )}
          </section>
        )}

        
{page === 'Analytics' && (
  <section className="analytics">
    <h2>📊 Marketing Analytics</h2>
    <p>Track your social media planning activity in one place.</p>

    {/* Statistics Cards */}
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

    {/* Platform Performance */}
    <div className="analytics-panel">
      <h3>📈 Platform Performance</h3>
      <p>Distribution of your planned social media posts.</p>

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

    {/* Monthly Performance */}
    <div className="analytics-panel">
      <h3>📅 Monthly Planned Posts</h3>
      <p>Number of posts planned for each month.</p>

      <div className="monthly-chart">
        {['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
          'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'].map((month, index) => {
            const count = posts.filter(post => {
              const date = new Date(post.date + 'T00:00:00')
              return date.getMonth() === index
            }).length

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

    {/* Recent Posts */}
    <div className="analytics-panel">
      <h3>📋 Recent Planned Posts</h3>

      {posts.length === 0 ? (
        <p>No planned posts available. Add posts in Social Media Planner to see analytics.</p>
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
      Note: These statistics show your planned posts only.
      Real likes, reach, comments and engagement require social media account connections.
    </p>
  </section>
)}


        {page === 'Settings' && (
          <section>
            <h2>⚙️ Settings</h2>
            <p>Settings options will be added here soon.</p>
          </section>
        )}
      </main>
    </div>
  )
}

export default App
