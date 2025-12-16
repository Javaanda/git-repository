import { useState, useEffect } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'

function CategoryList() {
  const [categories, setCategories] = useState([])
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [searchTerm, setSearchTerm] = useState('')
  const navigate = useNavigate()

  // 获取分类列表
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const token = localStorage.getItem('token')
        const response = await axios.get('http://localhost:8080/api/categories', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        })
        setCategories(response.data)
      } catch (err) {
        setError('获取分类列表失败')
      }
    }

    fetchCategories()
  }, [success])

  // 搜索功能
  const filteredCategories = categories.filter(category => {
    return (
      category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (category.description && category.description.toLowerCase().includes(searchTerm.toLowerCase()))
    )
  })

  // 处理删除分类
  const handleDeleteCategory = async (id, name) => {
    if (!window.confirm(`确定要删除分类 "${name}" 吗？`)) return
    
    try {
      const token = localStorage.getItem('token')
      await axios.delete(`http://localhost:8080/api/categories/${id}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      setSuccess('分类删除成功')
      
      // 3秒后清除成功消息
      setTimeout(() => {
        setSuccess('')
      }, 3000)
    } catch (err) {
      setError(err.response?.data?.message || '分类删除失败')
    }
  }

  return (
    <div className="container-fluid py-5">
      <div className="row">
        <div className="col-12">
          <div className="card shadow-lg border-0 rounded-4 overflow-hidden mb-5 transition-all duration-500 animate-fade-in" style={{ boxShadow: '0 10px 40px rgba(0, 0, 0, 0.1)' }}>
            <div className="card-body bg-gradient-to-br from-white to-blue-50">
              <div className="d-flex justify-content-between align-items-center mb-6">
                <h2 className="fw-bold text-primary display-6">分类管理</h2>
                <button className="btn btn-primary btn-lg rounded-pill shadow-lg bg-gradient-to-r from-primary to-blue-600 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1" onClick={() => navigate('/categories/add')}>
                  <i className="bi bi-plus-circle me-2"></i> 新增分类
                </button>
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
              
              {/* 搜索栏 */}
              <div className="mb-6">
                <div className="input-group rounded-pill overflow-hidden shadow-sm">
                  <span className="input-group-text bg-white border-0">
                    <i className="bi bi-search text-primary"></i>
                  </span>
                  <input
                    type="text"
                    className="form-control form-control-lg border-0"
                    placeholder="搜索分类（名称、描述）"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                  <button
                    className="btn btn-outline-primary"
                    onClick={() => setSearchTerm('')}
                  >
                    <i className="bi bi-x-lg"></i>
                  </button>
                </div>
              </div>
              
              <div className="table-responsive">
                <table className="table table-hover mb-0">
                  <thead className="table-primary bg-gradient-to-r from-primary to-blue-600">
                    <tr>
                      <th className="py-4 px-6 text-white border-0">#</th>
                      <th className="py-4 px-6 text-white border-0">分类名称</th>
                      <th className="py-4 px-6 text-white border-0">描述</th>
                      <th className="py-4 px-6 text-white border-0">状态</th>
                      <th className="py-4 px-6 text-white border-0">创建时间</th>
                      <th width="120" className="py-4 px-6 text-white border-0">操作</th>
                    </tr>
                  </thead>
                  <tbody className="table-group-divider">
                    {filteredCategories.length === 0 ? (
                      <tr>
                        <td colSpan="6" className="text-center py-12 bg-gradient-to-b from-white to-blue-50">
                          <div className="p-8 transition-all duration-500 hover:scale-105">
                            <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-primary bg-opacity-10 mb-6">
                              <i className="bi bi-tags fs-1 text-primary opacity-90"></i>
                            </div>
                            <p className="fs-5 fw-medium text-gray-700 mb-2">暂无分类数据</p>
                            <p className="text-sm text-gray-500 mb-4">点击上方"新增分类"按钮开始管理您的分类</p>
                            <button className="btn btn-primary rounded-pill shadow-sm hover:shadow-md transition-all duration-200" onClick={() => navigate('/categories/add')}>
                              <i className="bi bi-plus-circle me-2"></i> 添加第一个分类
                            </button>
                          </div>
                        </td>
                      </tr>
                    ) : (
                      filteredCategories.map((category, index) => (
                        <tr key={category.id} className="align-middle transition-all duration-300 hover:bg-blue-50 hover:shadow-md">
                          <td className="py-4 px-6">
                            <span className="badge bg-light text-dark rounded-full px-3 py-1 fw-medium">{index + 1}</span>
                          </td>
                          <td className="py-4 px-6">
                            <div className="fw-semibold text-gray-800">{category.name}</div>
                          </td>
                          <td className="py-4 px-6">
                            <div className="text-gray-700">{category.description || '-'}</div>
                          </td>
                          <td className="py-4 px-6">
                            <span className={`badge ${category.status ? 'bg-success bg-gradient' : 'bg-warning bg-gradient'} rounded-full px-4 py-1.5 fw-semibold transition-all duration-300 hover:shadow-md`}>
                              {category.status ? '启用' : '禁用'}
                            </span>
                          </td>
                          <td className="py-4 px-6">
                            <div className="text-gray-700">{new Date(category.createTime).toLocaleString()}</div>
                          </td>
                          <td className="py-4 px-6">
                            <div className="d-flex gap-2 justify-content-center">
                              <button 
                                className="btn btn-sm btn-primary bg-gradient rounded-pill shadow-sm hover:shadow-md transition-all duration-200"
                                onClick={() => navigate(`/categories/edit/${category.id}`)}
                                title="编辑分类"
                              >
                                <i className="bi bi-pencil me-1"></i> 编辑
                              </button>
                              <button 
                                className="btn btn-sm btn-danger bg-gradient rounded-pill shadow-sm hover:shadow-md transition-all duration-200"
                                onClick={() => handleDeleteCategory(category.id, category.name)}
                                title="删除分类"
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
                    <strong className="text-primary fs-4">{filteredCategories.length}</strong> 
                    <span className="fw-medium">个分类</span>
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

export default CategoryList