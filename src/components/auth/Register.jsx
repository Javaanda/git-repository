import { useState } from 'react'
import axios from 'axios'
import { Link, useNavigate } from 'react-router-dom'

function Register() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [email, setEmail] = useState('')
  const [fullName, setFullName] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSuccess('')
    
    try {
      const response = await axios.post('http://localhost:8080/api/users/register', {
        username,
        password,
        email,
        fullName
      })
      
      setSuccess('注册成功！请登录')
      // 注册成功后跳转到登录页面
      setTimeout(() => {
        navigate('/login')
      }, 2000)
    } catch (err) {
      setError(err.response?.data?.error || '注册失败，请检查输入信息')
    }
  }

  return (
    <div className="min-vh-100 d-flex align-items-center justify-content-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="w-full max-w-md">
        <div className="card shadow-lg border-0 rounded-2xl overflow-hidden">
          <div className="bg-gradient-to-r from-primary to-indigo-600 py-6 px-8">
            <h2 className="text-3xl font-bold text-white text-center mb-2">图书馆管理系统</h2>
            <p className="text-white/80 text-center text-sm">创建新账号</p>
          </div>
          <div className="card-body p-8">
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
            {success && (
              <div className="alert alert-success border-0 rounded-xl mb-5 shadow-sm">
                <div className="d-flex align-items-center">
                  <svg className="bi bi-check-circle-fill me-2" width="16" height="16" fill="currentColor">
                    <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zm-3.97-3.03a.75.75 0 0 0-1.08.022L7.477 9.417 5.384 7.323a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-.01-1.05z"/>
                  </svg>
                  <span>{success}</span>
                </div>
              </div>
            )}
            <form onSubmit={handleSubmit}>
              <div className="mb-5">
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
              <div className="mb-5">
                <label htmlFor="password" className="form-label text-sm font-medium text-gray-700 mb-1 block">密码</label>
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
              <div className="mb-5">
                <label htmlFor="email" className="form-label text-sm font-medium text-gray-700 mb-1 block">邮箱</label>
                <div className="input-group">
                  <span className="input-group-text bg-gray-100 border-gray-300 rounded-l-lg">
                    <svg className="bi bi-envelope-fill" width="16" height="16" fill="currentColor">
                      <path d="M.05 3.555A2 2 0 0 1 2 2h12a2 2 0 0 1 1.95 1.555L8 8.414.05 3.555ZM0 4.697v7.104l5.803-3.558L0 4.697ZM6.761 8.83l-6.57 4.026A2 2 0 0 0 2 14h12a2 2 0 0 0 1.808-1.144l-6.57-4.026L8 9.586l-1.239-.757Zm3.436-.586L16 11.801V4.697l-5.803 3.558Z"/>
                    </svg>
                  </span>
                  <input
                    type="email"
                    className="form-control border-gray-300 focus:ring-2 focus:ring-primary focus:border-primary rounded-r-lg shadow-sm transition-all"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="请输入邮箱"
                    required
                  />
                </div>
              </div>
              <div className="mb-6">
                <label htmlFor="fullName" className="form-label text-sm font-medium text-gray-700 mb-1 block">姓名</label>
                <div className="input-group">
                  <span className="input-group-text bg-gray-100 border-gray-300 rounded-l-lg">
                    <svg className="bi bi-person-lines-fill" width="16" height="16" fill="currentColor">
                      <path d="M6 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm-5 6s-1 0-1-1 1-4 6-4 6 3 6 4-1 1-1 1H1zM11 3.5a.5.5 0 0 1 .5-.5h4a.5.5 0 0 1 0 1h-4a.5.5 0 0 1-.5-.5zm.5 2.5a.5.5 0 0 0 0 1h4a.5.5 0 0 0 0-1h-4zm2 3a.5.5 0 0 0 0 1h2a.5.5 0 0 0 0-1h-2zm0 3a.5.5 0 0 0 0 1h2a.5.5 0 0 0 0-1h-2z"/>
                    </svg>
                  </span>
                  <input
                    type="text"
                    className="form-control border-gray-300 focus:ring-2 focus:ring-primary focus:border-primary rounded-r-lg shadow-sm transition-all"
                    id="fullName"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="请输入姓名"
                    required
                  />
                </div>
              </div>
              <button 
                type="submit" 
                className="w-full btn btn-primary bg-gradient-to-r from-primary to-indigo-600 border-0 rounded-xl py-3 px-6 text-white font-medium shadow-md hover:shadow-lg transition-all"
              >
                注册账号
              </button>
            </form>
            <div className="mt-6 text-center">
              <p className="text-gray-600 text-sm">
                已有账号？ <Link to="/login" className="text-primary font-medium hover:text-indigo-600 transition-colors">立即登录</Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Register