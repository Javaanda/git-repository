import { useState } from 'react'
import axios from 'axios'
import { Link, useNavigate } from 'react-router-dom'

function Login({ onLogin }) {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    
    try {
      const response = await axios.post('http://localhost:8080/api/users/login', {
        username,
        password
      })
      
      // 登录成功，保存token和用户信息
      onLogin(response.data.user, response.data.token)
      navigate('/books')
    } catch (err) {
      setError(err.response?.data?.message || '登录失败，请检查用户名和密码')
    }
  }

  return (
    <div className="min-vh-100 d-flex align-items-center justify-content-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="w-full max-w-md">
        <div className="card shadow-lg border-0 rounded-2xl overflow-hidden">
          <div className="bg-gradient-to-r from-primary to-indigo-600 py-6 px-8">
            <h2 className="text-3xl font-bold text-white text-center mb-2">图书馆管理系统</h2>
            <p className="text-white/80 text-center text-sm">请登录您的账号</p>
          </div>
          <div className="card-body p-8 d-flex flex-column h-100">
            {error && (
              <div className="alert alert-danger border-0 rounded-xl mb-5 shadow-sm">
                <div className="d-flex align-items-center">
                  <svg className="bi bi-exclamation-circle-fill me-2" width="16" height="16" fill="currentColor">
                    <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zM8 4a.905.905 0 0 0-.9.995l.35 3.507a.552.552 0 0 0 1.1 0l.35-3.507A.905.905 0 0 0 8 4zm.002 6a1 1 0 1 0 0 2 1 1 0 0 0 0-2z"/>
                  </svg>
                  <span>{error}</span>
                </div>
              </div>
            )}
            <form onSubmit={handleSubmit} className="d-flex flex-column flex-grow-1">
              <div className="mb-3 flex-grow-1 d-flex flex-column justify-content-center">
                <label htmlFor="username" className="form-label text-sm font-medium text-gray-700 mb-1 block">用户名</label>
                <div className="input-group">
                  <span className="input-group-text bg-gray-100 border-gray-300 rounded-l-lg">
                    <svg className="bi bi-person-fill" width="16" height="16" fill="currentColor">
                      <path d="M3 14s-1 0-1-1 1-4 6-4 6 3 6 4-1 1-1 1H3zm5-6a3 3 0 1 0 0-6 3 3 0 0 0 0 6z"/>
                    </svg>
                  </span>
                  <input
                    type="text"
                    className="form-control border-gray-300 focus:ring-2 focus:ring-primary focus:border-primary rounded-r-lg shadow-sm transition-all"
                    id="username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="请输入用户名"
                    required
                  />
                </div>
              </div>
              <div className="mb-3 flex-grow-1 d-flex flex-column justify-content-center">
                <div className="d-flex justify-content-between align-items-center mb-1">
                  <label htmlFor="password" className="form-label text-sm font-medium text-gray-700">密码</label>
                </div>
                <div className="input-group">
                  <span className="input-group-text bg-gray-100 border-gray-300 rounded-l-lg">
                    <svg className="bi bi-lock-fill" width="16" height="16" fill="currentColor">
                      <path d="M8 1a2 2 0 0 1 2 2v4H6V3a2 2 0 0 1 2-2zm3 6V3a3 3 0 0 0-6 0v4a2 2 0 0 0-2 2v5a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2z"/>
                    </svg>
                  </span>
                  <input
                    type="password"
                    className="form-control border-gray-300 focus:ring-2 focus:ring-primary focus:border-primary rounded-r-lg shadow-sm transition-all"
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="请输入密码"
                    required
                  />
                </div>
              </div>
              <div className="flex-grow-1 d-flex flex-column justify-content-center">
                <button 
                  type="submit" 
                  className="btn btn-primary d-block mx-auto bg-gradient-to-r from-primary to-indigo-600 border-0 rounded-xl py-1 px-12 text-white font-medium shadow-md hover:shadow-lg transition-all"
                >
                  登录系统
                </button>
              </div>
            </form>
            <div className="mt-6 text-center">
              <p className="text-gray-600 text-sm">
                还没有账号？ <Link to="/register" className="text-primary font-medium hover:text-indigo-600 transition-colors">立即注册</Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Login