import { useState, useEffect } from 'react'
import axios from 'axios'
import { useParams, useNavigate } from 'react-router-dom'

function EditCategory() {
  const { id } = useParams()
  const [category, setCategory] = useState({
    name: '',
    description: '',
    status: true
  })
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const navigate = useNavigate()

  // 获取分类信息
  useEffect(() => {
    const fetchCategory = async () => {
      try {
        const token = localStorage.getItem('token')
        const response = await axios.get(`http://localhost:8080/api/categories/${id}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        })
        setCategory(response.data)
      } catch (err) {
        setError('获取分类信息失败')
      }
    }

    fetchCategory()
  }, [id])

  // 处理表单输入变化
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setCategory({ ...category, [name]: type === 'checkbox' ? checked : value })
  }

  // 处理表单提交
  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSuccess('')
    
    try {
      const token = localStorage.getItem('token')
      await axios.put(`http://localhost:8080/api/categories/${id}`, category, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      
      setSuccess('分类更新成功')
      
      // 跳转到分类列表
      setTimeout(() => {
        navigate('/categories')
      }, 1500)
    } catch (err) {
      setError(err.response?.data?.message || '更新分类失败')
    }
  }

  return (
    <div className="container-fluid py-5">
      <div className="row">
        <div className="col-12">
          <div className="card shadow-lg border-0 rounded-4 overflow-hidden mb-5 transition-all duration-500 animate-fade-in" style={{ boxShadow: '0 10px 40px rgba(0, 0, 0, 0.1)' }}>
            <div className="card-body bg-gradient-to-br from-white to-blue-50">
              <div className="d-flex justify-content-between align-items-center mb-6">
                <h2 className="fw-bold text-primary display-6">编辑分类</h2>
                <button className="btn btn-secondary btn-lg rounded-pill shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1" onClick={() => navigate('/categories')}>
                  <i className="bi bi-arrow-left-circle me-2"></i> 返回列表
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
              
              <form onSubmit={handleSubmit}>
                <div className="row">
                  <div className="col-md-6">
                    <div className="mb-4">
                      <label htmlFor="name" className="form-label text-sm font-medium text-gray-700 mb-1 block">分类名称</label>
                      <input
                        type="text"
                        className="form-control rounded-pill shadow-sm border-gray-200 focus:ring-2 focus:ring-primary focus:border-primary transition-all"
                        id="name"
                        name="name"
                        value={category.name}
                        onChange={handleChange}
                        required
                      />
                    </div>
                    
                    <div className="mb-4">
                      <label htmlFor="description" className="form-label text-sm font-medium text-gray-700 mb-1 block">分类描述</label>
                      <textarea
                        className="form-control rounded-xl shadow-sm border-gray-200 focus:ring-2 focus:ring-primary focus:border-primary transition-all"
                        id="description"
                        name="description"
                        value={category.description}
                        onChange={handleChange}
                        rows="4"
                      ></textarea>
                    </div>
                    
                    <div className="mb-4 form-check">
                      <input
                        type="checkbox"
                        className="form-check-input rounded shadow-sm border-gray-200 focus:ring-2 focus:ring-primary focus:border-primary transition-all"
                        id="status"
                        name="status"
                        checked={category.status}
                        onChange={handleChange}
                      />
                      <label className="form-check-label fw-medium text-gray-700" htmlFor="status">启用分类</label>
                    </div>
                  </div>
                </div>
                
                <div className="d-flex justify-content-end gap-3 mt-6">
                  <button type="button" className="btn btn-secondary btn-lg rounded-pill shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1" onClick={() => navigate('/categories')}>
                    <i className="bi bi-x-circle me-2"></i> 取消
                  </button>
                  <button type="submit" className="btn btn-primary btn-lg rounded-pill shadow-lg bg-gradient-to-r from-primary to-blue-600 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                    <i className="bi bi-check-circle me-2"></i> 更新分类
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

export default EditCategory