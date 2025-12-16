import { useState, useEffect } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'

function AddBorrowRecord() {
  const [record, setRecord] = useState({
    bookId: '',
    userId: '',
    borrowDate: new Date().toISOString().split('T')[0],
    dueDate: ''
  })
  const [books, setBooks] = useState([])
  const [users, setUsers] = useState([])
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const navigate = useNavigate()

  // 获取图书列表
  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const token = localStorage.getItem('token')
        const response = await axios.get('http://localhost:8080/api/books', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        })
        
        // 检查响应格式，确保books是数组
        let booksData = []
        if (Array.isArray(response.data)) {
          booksData = response.data
        } else if (response.data && Array.isArray(response.data.books)) {
          booksData = response.data.books
        } else {
          console.error('图书列表响应格式不正确:', response.data)
          booksData = []
        }
        
        // 只显示有库存的图书
        const availableBooks = booksData.filter(book => book.stock > 0)
        setBooks(availableBooks)
      } catch (err) {
        console.error('获取图书列表失败:', err)
        setError('获取图书列表失败')
      }
    }

    fetchBooks()
  }, [])

  // 获取用户列表
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const token = localStorage.getItem('token')
        const response = await axios.get('http://localhost:8080/api/users/', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        })
        // 检查响应格式，确保users是数组
        if (Array.isArray(response.data)) {
          setUsers(response.data)
        } else if (response.data && Array.isArray(response.data.users)) {
          setUsers(response.data.users)
        } else {
          console.error('用户列表响应格式不正确:', response.data)
          setUsers([])
        }
      } catch (err) {
        console.error('获取用户列表失败:', err)
        setError('获取用户列表失败')
      }
    }

    fetchUsers()
  }, [])

  // 处理表单输入变化
  const handleChange = (e) => {
    const { name, value } = e.target
    setRecord({ ...record, [name]: value })
  }

  // 处理表单提交
  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSuccess('')
    
    try {
      // 计算借阅天数
      const borrowDate = new Date(record.borrowDate)
      const dueDate = new Date(record.dueDate)
      const timeDiff = dueDate - borrowDate
      const days = Math.ceil(timeDiff / (1000 * 3600 * 24))
      
      const token = localStorage.getItem('token')
      await axios.post('http://localhost:8080/api/borrow-records/borrow', {
        bookId: record.bookId,
        userId: record.userId,
        days: days
      }, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      
      setSuccess('借阅记录添加成功')
      
      // 跳转到借阅记录列表
      setTimeout(() => {
        navigate('/borrow-records')
      }, 1500)
    } catch (err) {
      console.error('添加借阅记录失败:', err)
      setError(err.response?.data?.message || '添加借阅记录失败')
    }
  }

  return (
    <div className="container-fluid py-5">
      <div className="row">
        <div className="col-12">
          <div className="card shadow-lg border-0 rounded-4 overflow-hidden mb-5 transition-all duration-500 animate-fade-in" style={{ boxShadow: '0 10px 40px rgba(0, 0, 0, 0.1)' }}>
            <div className="card-body bg-gradient-to-br from-white to-blue-50">
              <div className="d-flex justify-content-between align-items-center mb-6">
                <h2 className="fw-bold text-primary display-6">新增借阅记录</h2>
                <button className="btn btn-secondary btn-lg rounded-pill shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1" onClick={() => navigate('/borrow-records')}>
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
                      <label htmlFor="bookId" className="form-label text-sm font-medium text-gray-700 mb-1 block">图书</label>
                      <select
                        className="form-select rounded-pill shadow-sm border-gray-200 focus:ring-2 focus:ring-primary focus:border-primary transition-all"
                        id="bookId"
                        name="bookId"
                        value={record.bookId}
                        onChange={handleChange}
                        required
                      >
                        <option value="">请选择图书</option>
                        {books.map(book => (
                          <option key={book.id} value={book.id}>
                            {book.title} - {book.author} (库存: {book.stock})
                          </option>
                        ))}
                      </select>
                      {books.length === 0 && (
                        <div className="text-muted mt-1">
                          当前没有可借阅的图书
                        </div>
                      )}
                    </div>
                    
                    <div className="mb-4">
                      <label htmlFor="userId" className="form-label text-sm font-medium text-gray-700 mb-1 block">借阅用户</label>
                      <select
                        className="form-select rounded-pill shadow-sm border-gray-200 focus:ring-2 focus:ring-primary focus:border-primary transition-all"
                        id="userId"
                        name="userId"
                        value={record.userId}
                        onChange={handleChange}
                        required
                      >
                        <option value="">请选择用户</option>
                        {users.map(user => (
                          <option key={user.id} value={user.id}>
                            {user.username} ({user.fullName})
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                  
                  <div className="col-md-6">
                    <div className="mb-4">
                      <label htmlFor="borrowDate" className="form-label text-sm font-medium text-gray-700 mb-1 block">借阅日期</label>
                      <input
                        type="date"
                        className="form-control rounded-pill shadow-sm border-gray-200 focus:ring-2 focus:ring-primary focus:border-primary transition-all"
                        id="borrowDate"
                        name="borrowDate"
                        value={record.borrowDate}
                        onChange={handleChange}
                        required
                      />
                    </div>
                    
                    <div className="mb-4">
                      <label htmlFor="dueDate" className="form-label text-sm font-medium text-gray-700 mb-1 block">应还日期</label>
                      <input
                        type="date"
                        className="form-control rounded-pill shadow-sm border-gray-200 focus:ring-2 focus:ring-primary focus:border-primary transition-all"
                        id="dueDate"
                        name="dueDate"
                        value={record.dueDate}
                        onChange={handleChange}
                        required
                        min={record.borrowDate}
                      />
                    </div>
                  </div>
                </div>
                
                <div className="d-flex justify-content-end gap-3 mt-6">
                  <button type="button" className="btn btn-secondary btn-lg rounded-pill shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1" onClick={() => navigate('/borrow-records')}>
                    <i className="bi bi-x-circle me-2"></i> 取消
                  </button>
                  <button type="submit" className="btn btn-primary btn-lg rounded-pill shadow-lg bg-gradient-to-r from-primary to-blue-600 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                    <i className="bi bi-check-circle me-2"></i> 添加借阅记录
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

export default AddBorrowRecord