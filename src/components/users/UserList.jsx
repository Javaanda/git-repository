import { useState, useEffect } from 'react'
import axios from 'axios'
import { Link, useNavigate } from 'react-router-dom'

function UserList() {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState('')
  const navigate = useNavigate()

  // 获取所有用户
  const fetchUsers = async () => {
    setLoading(true)
    try {
      const token = localStorage.getItem('token')
      const response = await axios.get('http://localhost:8080/api/users/', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      setUsers(response.data)
      setError(null)
      setSuccess('')
    } catch (err) {
      setError('获取用户列表失败: ' + (err.response?.data?.message || err.message))
      setSuccess('')
      console.error('获取用户列表失败:', err)
    } finally {
      setLoading(false)
    }
  }

  // 删除用户
  const handleDelete = async (userId) => {
    if (window.confirm('确定要删除这个用户吗？')) {
      try {
        const token = localStorage.getItem('token')
        await axios.delete(`http://localhost:8080/api/users/delete/${userId}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        })
        // 重新获取用户列表
        fetchUsers()
        setSuccess('用户删除成功')
        
        // 3秒后清除成功消息
        setTimeout(() => {
          setSuccess('')
        }, 3000)
      } catch (err) {
        setError('删除用户失败: ' + (err.response?.data?.message || err.message))
        console.error('删除用户失败:', err)
      }
    }
  }

  // 更新用户状态
  const handleStatusChange = async (userId, newStatus) => {
    try {
      const token = localStorage.getItem('token')
      // 先获取用户信息
      const userResponse = await axios.get(`http://localhost:8080/api/users/profile/${userId}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      
      const user = userResponse.data
      user.status = newStatus
      
      // 更新用户信息
      await axios.put(`http://localhost:8080/api/users/update/${userId}`, user, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      
      // 重新获取用户列表
      fetchUsers()
      setSuccess('用户状态更新成功')
      
      // 3秒后清除成功消息
      setTimeout(() => {
        setSuccess('')
      }, 3000)
    } catch (err) {
      setError('更新用户状态失败: ' + (err.response?.data?.message || err.message))
      console.error('更新用户状态失败:', err)
    }
  }

  useEffect(() => {
    fetchUsers()
  }, [])

  if (loading) {
    return <div className="text-center mt-5">加载用户列表中...</div>
  }

  return (
    <div className="container-fluid py-5">
      <div className="row">
        <div className="col-12">
          <div className="card shadow-lg border-0 rounded-4 overflow-hidden mb-5 transition-all duration-500 animate-fade-in" style={{ boxShadow: '0 10px 40px rgba(0, 0, 0, 0.1)' }}>
            <div className="card-body bg-gradient-to-br from-white to-blue-50">
              <div className="d-flex justify-content-between align-items-center mb-6">
                <h2 className="fw-bold text-primary display-6">用户管理</h2>
                <Link to="/users/add" className="btn btn-primary btn-lg rounded-pill shadow-lg bg-gradient-to-r from-primary to-blue-600 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                  <i className="bi bi-plus-circle me-2"></i> 新增用户
                </Link>
              </div>
              
              {error && (
                <div className="alert alert-danger alert-dismissible fade show border-0 rounded-3 shadow-sm mb-4" role="alert">
                  {error}
                  <button type="button" className="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
                </div>
              )}
              {success && (
                <div className="alert alert-success alert-dismissible fade show border-0 rounded-3 shadow-sm mb-4" role="alert">
                  {success}
                  <button type="button" className="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
                </div>
              )}
              
              <div className="table-responsive">
                <table className="table table-hover mb-0">
                  <thead className="table-primary bg-gradient-to-r from-primary to-blue-600">
                    <tr>
                      <th className="py-4 px-6 text-white border-0">ID</th>
                      <th className="py-4 px-6 text-white border-0">用户名</th>
                      <th className="py-4 px-6 text-white border-0">邮箱</th>
                      <th className="py-4 px-6 text-white border-0">姓名</th>
                      <th className="py-4 px-6 text-white border-0">角色</th>
                      <th className="py-4 px-6 text-white border-0">电话</th>
                      <th className="py-4 px-6 text-white border-0">状态</th>
                      <th className="py-4 px-6 text-white border-0">创建时间</th>
                      <th width="120" className="py-4 px-6 text-white border-0">操作</th>
                    </tr>
                  </thead>
                  <tbody className="table-group-divider">
                    {users.length === 0 ? (
                      <tr>
                        <td colSpan="9" className="text-center py-12 bg-gradient-to-b from-white to-blue-50">
                          <div className="p-8 transition-all duration-500 hover:scale-105">
                            <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-primary bg-opacity-10 mb-6">
                              <i className="bi bi-people fs-1 text-primary opacity-90"></i>
                            </div>
                            <p className="fs-5 fw-medium text-gray-700 mb-2">暂无用户数据</p>
                            <p className="text-sm text-gray-500 mb-4">点击上方"新增用户"按钮开始管理您的用户</p>
                            <Link to="/users/add" className="btn btn-primary rounded-pill shadow-sm hover:shadow-md transition-all duration-200">
                              <i className="bi bi-plus-circle me-2"></i> 添加第一个用户
                            </Link>
                          </div>
                        </td>
                      </tr>
                    ) : (
                      users.map(user => (
                        <tr key={user.id} className="align-middle transition-all duration-300 hover:bg-blue-50 hover:shadow-md">
                          <td className="py-4 px-6">
                            <span className="badge bg-light text-dark rounded-full px-3 py-1 fw-medium">{user.id}</span>
                          </td>
                          <td className="py-4 px-6">
                            <div className="fw-semibold text-gray-800">{user.username}</div>
                          </td>
                          <td className="py-4 px-6">
                            <div className="text-gray-700">{user.email}</div>
                          </td>
                          <td className="py-4 px-6">
                            <div className="text-gray-700">{user.fullName}</div>
                          </td>
                          <td className="py-4 px-6">
                            <span className={`badge bg-gradient rounded-full px-4 py-1.5 fw-semibold transition-all duration-300 hover:shadow-md ${user.role === 'ROLE_ADMIN' ? 'bg-primary' : 'bg-secondary'}`}>
                              {user.role === 'ROLE_ADMIN' ? '管理员' : '普通用户'}
                            </span>
                          </td>
                          <td className="py-4 px-6">
                            <div className="text-gray-700">{user.phone || '-'}</div>
                          </td>
                          <td className="py-4 px-6">
                            <button
                              className={`btn btn-sm bg-gradient rounded-pill shadow-sm hover:shadow-md transition-all duration-200 ${user.status ? 'btn-success' : 'btn-danger'}`}
                              onClick={() => handleStatusChange(user.id, !user.status)}
                            >
                              {user.status ? '启用' : '禁用'}
                            </button>
                          </td>
                          <td className="py-4 px-6">
                            <div className="text-gray-700">{new Date(user.createTime).toLocaleString()}</div>
                          </td>
                          <td className="py-4 px-6">
                            <div className="d-flex gap-2 justify-content-center">
                              <Link
                                to={`/users/edit/${user.id}`}
                                className="btn btn-sm btn-primary bg-gradient rounded-pill shadow-sm hover:shadow-md transition-all duration-200"
                                title="编辑用户"
                              >
                                <i className="bi bi-pencil me-1"></i> 编辑
                              </Link>
                              <button
                                className="btn btn-sm btn-danger bg-gradient rounded-pill shadow-sm hover:shadow-md transition-all duration-200"
                                onClick={() => handleDelete(user.id)}
                                title="删除用户"
                              >
                                <i className="bi bi-trash me-1"></i> 删除
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
              
              {/* 统计信息 */}
              <div className="mt-6 p-4 bg-gradient-to-r from-white to-blue-50 rounded-4 shadow-sm transition-all duration-300 hover:shadow-md animate-fade-in">
                <div className="d-flex justify-content-between align-items-center flex-wrap gap-3">
                  <div className="text-gray-700">
                    <span className="fw-medium">共</span> 
                    <strong className="text-primary fs-4">{users.length}</strong> 
                    <span className="fw-medium">个用户</span>
                  </div>
                  <div className="text-sm text-gray-500">
                    上次更新: {new Date().toLocaleString()}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default UserList