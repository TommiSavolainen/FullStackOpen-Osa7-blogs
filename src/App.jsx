import { useState, useEffect, useRef, useContext } from 'react'
import Blog from './components/Blog'
import blogService from './services/blogs'
import loginService from './services/login'
import Notification from './components/notification'
import Togglable from './components/Togglable'
import BlogForm from './components/BlogForm'
import { NotificationProvider } from './components/NotificationContext'
import { NotificationContext } from './components/NotificationContext'
import { useQuery, useMutation, QueryClient, QueryClientProvider } from 'react-query'
import { UserContext } from './components/UserContext'
import User from './components/User'
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import UserDetail from './components/UserDetail'
import BlogDetail from './components/BlogDetail'
const App = () => {
  // const [blogs, setBlogs] = useState([])
  const [newBlog, setNewBlog] = useState('')
  const [showAll, setShowAll] = useState(false)
  const [errorMessage, setErrorMessage] = useState(null)
  const [successMessage, setSuccessMessage] = useState(null)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [url, setUrl] = useState('')
  // const [user, setUser] = useState(null)
  const [newBlogVisible, setNewBlogVisible] = useState(false)
  const blogFormRef = useRef()
  const { state, dispatch } = useContext(NotificationContext);
  const { user, dispatchUser } = useContext(UserContext);

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      dispatchUser({ type: 'SET_USER', user });
      blogService.setToken(user.token)
    }
  }, [])

  const fetchBlogs = async () => {
    const response = await blogService.getAll()
    return response.sort((a, b) => b.likes - a.likes)
  }

  const { data: blogs, isError, isLoading, refetch } = useQuery('blogs', fetchBlogs)

  const addBlogMutation = useMutation((blog) => blogService.create(blog), {
    onSuccess: () => {
      refetch()
    },
  })

  const handleLogin = async (event) => {
    event.preventDefault()
    try {
      const user = await loginService.login({
        username, password,
      })
      window.localStorage.setItem(
        'loggedBlogappUser', JSON.stringify(user)
      )
      
      blogService.setToken(user.token)
      dispatchUser({ type: 'SET_USER', user });
      setUsername('')
      setPassword('')
      setShowAll(true)
      dispatch({ type: 'SET_SUCCESS', message: 'login successful' });
      setTimeout(() => {
        dispatch({ type: 'SET_SUCCESS', message: null });
      }, 5000);
    }
    catch (exception) {
      console.log('exception', exception)
      dispatch({ type: 'SET_ERROR', message: 'wrong username or password' });
      setTimeout(() => {
        dispatch({ type: 'SET_ERROR', message: null });
      }, 5000);
    }
  }
  const loginForm = () => (
    <form onSubmit={handleLogin}>
      <div>
        username:
        <input
          type="text"
          value={username}
          name="Username"
          id='username'
          onChange={({ target }) => setUsername(target.value)}
        />
      </div>
      <div>
        password:
        <input
          type="password"
          value={password}
          name="Password"
          id='password'
          onChange={({ target }) => setPassword(target.value)}
        />
      </div>
      <button type="submit" id='login-button'>login</button>
    </form>
  )

  const handleLogout = () => {
    window.localStorage.removeItem('loggedBlogappUser')
    dispatchUser({ type: 'CLEAR_USER' });
  }


  const addBlog = (blogObject) => {
    try {

      blogFormRef.current.toggleVisibility()
      addBlogMutation.mutate(blogObject)
      setTitle('')
      setAuthor('')
      setUrl('')
      dispatch({ type: 'SET_SUCCESS', message: `a new blog ${blogObject.title} by ${blogObject.author} added` });
      setTimeout(() => {
        dispatch({ type: 'SET_SUCCESS', message: null });
      }, 2000);
    }
    catch (exception) {
      console.log('exception', exception)
      dispatch({ type: 'SET_ERROR', message: 'error creating blog' });
      setTimeout(() => {
        dispatch({ type: 'SET_ERROR', message: null });
      }, 5000);
    }
  }


  return (
    <Router>
      <Routes>
        <Route path='/users' element={
        user.user ? (
          <div>
            <h2>blogs</h2>
            <div className='nav'>
            <p><Link to={'/'} >blogs</Link> <Link to={'/users'}>users</Link> {user.user.name} logged-in <button onClick={handleLogout}>logout</button></p>
            </div>
            <User />
          </div>
        ) : (
          loginForm()
        )
          }/>
        <Route path='/users/:id' element={
        user.user ? (
          <div>
            <h2>blogs</h2>
            <div className='nav'>
            <p><Link to={'/'}>blogs</Link> <Link to={'/users'}>users</Link> {user.user.name} logged-in <button onClick={handleLogout}>logout</button></p>
            </div>
            <UserDetail />
          </div>
        ) : (
          loginForm()
        )
          }/>
        <Route path='/blogs/:id' element={<BlogDetail/>} />
        <Route path='/' element={
        <div>
          <h1>Log in to application</h1>
          <Notification message={state.message} />
          {!user.user && loginForm()}
          {user.user && 
            <div>
              <div className='nav'>
              <p><Link to={'/'}>blogs</Link> <Link to={'/users'}>users</Link> {user.user.name} logged-in <button onClick={handleLogout}>logout</button></p>
              </div>
              <Togglable buttonLabel='new blog' ref={blogFormRef}>
                <BlogForm createBlog={addBlog} user={user.user}/>
              </Togglable>
              <h1>Blogs</h1>
              {blogs?.map(blog =>
                <Blog key={blog.id} blog={blog} blogs={blogs} user={user.user} />
              )}
            </div>
          }
        </div>
      }/>
      </Routes>
    </Router>
  )
}

export default App