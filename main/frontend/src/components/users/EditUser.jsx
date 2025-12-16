import { useState, useEffect } from 'react'
import axios from 'axios'
import { Link, useNavigate, useParams } from 'react-router-dom'

function EditUser() {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    confirmPassword: '',
    email: '',
    fullName: '',
    role: 'ROLE_USER',
    phone: '',
    address: '',
    status: true
  })
  const [errors, setErrors] = useState({})
  const [submitting, setSubmitting] = useState(false)
  const [serverError, setServerError] = useState(null)
  const [loading, setLoading] = useState(true)
  const { id } = useParams()
  const navigate = useNavigate()

  // 获取用户信息
  const fetchUser = async () => {
    setLoading(true)
    try {
      const token = localStorage.getItem('token')
      const response = await axios.get(`http://localhost:8080/api/users/profile/${id}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      const user = response.data
      setFormData({
        username: user.username,
        password: '', // 密码不显示，需要时重新输入
        confirmPassword: '',
        email: user.email,
        fullName: user.fullName,
        role: user.role,
        phone: user.phone || '',
        address: user.address || '',
        status: user.status
      })
      setServerError(null)
    } catch (err) {
      setServerError('获取用户信息失败: ' + (err.response?.data?.message || err.message))
      console.error('获取用户信息失败:', err)
    } finally {
      setLoading(false)
    }
  }

  // 处理表单输入变化
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))
    // 清除对应字段的错误
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev }
        delete newErrors[name]
        return newErrors
      })
    }
  }

  // 表单验证
  const validateForm = () => {
    const newErrors = {}
    
    // 验证用户名
    if (!formData.username.trim()) {
      newErrors.username = '用户名不能为空'
    } else if (formData.username.length < 3 || formData.username.length > 50) {
      newErrors.username = '用户名长度必须在3-50个字符之间'
    }
    
    // 验证密码（如果填写了）
    if (formData.password && formData.password.length < 6) {
      newErrors.password = '密码长度不能少于6个字符'
    }
    
    // 验证确认密码
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = '两次输入的密码不一致'
    }
    
    // 验证邮箱
    if (!formData.email) {
      newErrors.email = '邮箱不能为空'
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!emailRegex.test(formData.email)) {
        newErrors.email = '请输入有效的邮箱地址'
      }
    }
    
    // 验证姓名
    if (!formData.fullName.trim()) {
      newErrors.fullName = '姓名不能为空'
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  // 提交表单
  const handleSubmit = async (e) => {
    e.preventDefault()
    
    // 表单验证
    if (!validateForm()) {
      return
    }
    
    setSubmitting(true)
    setServerError(null)
    
    try {
      const token = localStorage.getItem('token')
      
      // 移除确认密码字段
      const userData = { ...formData }
      delete userData.confirmPassword
      
      // 如果密码为空，不更新密码
      if (!userData.password) {
        delete userData.password
      }
      
      // 发送请求到后端
      const response = await axios.put(`http://localhost:8080/api/users/update/${id}`, userData, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      
      alert('用户更新成功')
      navigate('/users')
    } catch (err) {
      setServerError(err.response?.data?.message || '更新用户失败，请重试')
      console.error('更新用户失败:', err)
    } finally {
      setSubmitting(false)
    }
  }

  useEffect(() => {
    fetchUser()
  }, [id])

  if (loading) {
    return <div className="text-center mt-5">加载用户信息中...</div>
  }

  return (
    <div className="container-fluid py-5">
      <div className="row">
        <div className="col-12">
          <div className="card shadow-lg border-0 rounded-4 overflow-hidden mb-5 transition-all duration-500 animate-fade-in" style={{ boxShadow: '0 10px 40px rgba(0, 0, 0, 0.1)' }}>
            <div className="card-body bg-gradient-to-br from-white to-blue-50">
              <div className="d-flex justify-content-between align-items-center mb-6">
                <h2 className="fw-bold text-primary display-6">编辑用户</h2>
                <Link to="/users" className="btn btn-secondary btn-lg rounded-pill shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                  <i className="bi bi-arrow-left-circle me-2"></i> 返回用户列表
                </Link>
              </div>
              
              {serverError && (
                <div className="alert alert-danger alert-dismissible fade show border-0 rounded-3 shadow-sm mb-4" role="alert">
                  {serverError}
                  <button type="button" className="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
                </div>
              )}
              
              <form onSubmit={handleSubmit}>
                <div className="row g-3">
                  {/* 用户名 */}
                  <div className="col-md-6">
                    <label htmlFor="username" className="form-label text-sm font-medium text-gray-700 mb-1 block">用户名 <span className="text-danger">*</span></label>
                    <input
                      type="text"
                      className={`form-control rounded-pill shadow-sm ${errors.username ? 'is-invalid' : ''}`}
                      id="username"
                      name="username"
                      value={formData.username}
                      onChange={handleChange}
                      placeholder="请输入用户名"
                    />
                    {errors.username && (
                      <div className="invalid-feedback">{errors.username}</div>
                    )}
                  </div>
                  
                  {/* 密码 */}
                  <div className="col-md-6">
                    <label htmlFor="password" className="form-label text-sm font-medium text-gray-700 mb-1 block">密码（不修改请留空）</label>
                    <input
                      type="password"
                      className={`form-control rounded-pill shadow-sm ${errors.password ? 'is-invalid' : ''}`}
                      id="password"
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      placeholder="请输入新密码"
                    />
                    {errors.password && (
                      <div className="invalid-feedback">{errors.password}</div>
                    )}
                  </div>
                  
                  {/* 确认密码 */}
                  <div className="col-md-6">
                    <label htmlFor="confirmPassword" className="form-label text-sm font-medium text-gray-700 mb-1 block">确认密码</label>
                    <input
                      type="password"
                      className={`form-control rounded-pill shadow-sm ${errors.confirmPassword ? 'is-invalid' : ''}`}
                      id="confirmPassword"
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      placeholder="请再次输入新密码"
                    />
                    {errors.confirmPassword && (
                      <div className="invalid-feedback">{errors.confirmPassword}</div>
                    )}
                  </div>
                  
                  {/* 邮箱 */}
                  <div className="col-md-6">
                    <label htmlFor="email" className="form-label text-sm font-medium text-gray-700 mb-1 block">邮箱 <span className="text-danger">*</span></label>
                    <input
                      type="email"
                      className={`form-control rounded-pill shadow-sm ${errors.email ? 'is-invalid' : ''}`}
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="请输入邮箱地址"
                    />
                    {errors.email && (
                      <div className="invalid-feedback">{errors.email}</div>
                    )}
                  </div>
                  
                  {/* 姓名 */}
                  <div className="col-md-6">
                    <label htmlFor="fullName" className="form-label text-sm font-medium text-gray-700 mb-1 block">姓名 <span className="text-danger">*</span></label>
                    <input
                      type="text"
                      className={`form-control rounded-pill shadow-sm ${errors.fullName ? 'is-invalid' : ''}`}
                      id="fullName"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleChange}
                      placeholder="请输入姓名"
                    />
                    {errors.fullName && (
                      <div className="invalid-feedback">{errors.fullName}</div>
                    )}
                  </div>
                  
                  {/* 角色 */}
                  <div className="col-md-6">
                    <label htmlFor="role" className="form-label text-sm font-medium text-gray-700 mb-1 block">角色</label>
                    <select
                      className="form-select rounded-pill shadow-sm"
                      id="role"
                      name="role"
                      value={formData.role}
                      onChange={handleChange}
                    >
                      <option value="ROLE_USER">普通用户</option>
                      <option value="ROLE_ADMIN">管理员</option>
                    </select>
                  </div>
                  
                  {/* 电话 */}
                  <div className="col-md-6">
                    <label htmlFor="phone" className="form-label">电话</label>
                    <input
                      type="tel"
                      className="form-control rounded-pill shadow-sm"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="请输入电话号码"
                    />
                  </div>
                  
                  {/* 状态 */}
                  <div className="col-md-6">
                    <div className="form-check form-switch mt-4">
                      <input
                        className="form-check-input rounded-pill"
                        type="checkbox"
                        id="status"
                        name="status"
                        checked={formData.status}
                        onChange={handleChange}
                      />
                      <label className="form-check-label fw-medium text-gray-700" htmlFor="status">
                        {formData.status ? '启用' : '禁用'}
                      </label>
                    </div>
                  </div>
                  
                  {/* 地址 */}
                  <div className="col-12">
                    <label htmlFor="address" className="form-label">地址</label>
                    <textarea
                      className="form-control rounded-pill shadow-sm"
                      id="address"
                      name="address"
                      value={formData.address}
                      onChange={handleChange}
                      rows="3"
                      placeholder="请输入地址信息"
                    ></textarea>
                  </div>
                </div>
                
                <div className="d-flex justify-content-between mt-6">
                  <button
                    type="button"
                    className="btn btn-secondary rounded-pill shadow-lg hover:shadow-xl transition-all duration-200"
                    onClick={() => navigate('/users')}
                  >
                    取消
                  </button>
                  <button
                    type="submit"
                    className="btn btn-primary btn-lg rounded-pill shadow-lg bg-gradient-to-r from-primary to-blue-600 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
                    disabled={submitting}
                  >
                    {submitting ? (
                      <>
                        <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                        更新中...
                      </>
                    ) : (
                      '更新'
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default EditUser