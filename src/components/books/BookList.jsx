import { useState, useEffect } from 'react'
import axios from 'axios'
import { Link, useLocation } from 'react-router-dom'

function BookList() {
  const [books, setBooks] = useState([])
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const location = useLocation()

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
        setBooks(response.data)
      } catch (err) {
        setError('获取图书列表失败')
      } finally {
        setLoading(false)
      }
    }

    fetchBooks()
  }, [location.pathname])

  // 搜索功能
  const filteredBooks = books.filter(book => {
    const searchLower = searchTerm.toLowerCase()
    const title = book.title || ''
    const author = book.author || ''
    const isbn = book.isbn || ''
    const categoryText = book.categoryName || book.category?.name || ''
    
    return (
      title.toLowerCase().includes(searchLower) ||
      author.toLowerCase().includes(searchLower) ||
      isbn.includes(searchTerm) ||
      categoryText.toLowerCase().includes(searchLower)
    )
  })

  // 删除图书
  const handleDelete = async (id) => {
    if (window.confirm('确定要删除这本书吗？')) {
      try {
        const token = localStorage.getItem('token')
        await axios.delete(`http://localhost:8080/api/books/${id}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        })
        setBooks(books.filter(book => book.id !== id))
      } catch (err) {
        setError('删除图书失败')
      }
    }
  }

  if (loading) {
    return (
      <div className="container-fluid py-5">
        <div className="row">
          <div className="col-12 d-flex flex-column align-items-center justify-content-center py-12">
            <div className="spinner-border text-primary" style={{ width: '5rem', height: '5rem' }} role="status">
              <span className="visually-hidden">加载中...</span>
            </div>
            <p className="mt-4 fs-5 text-gray-600">正在加载图书数据...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container-fluid py-5">
      <div className="row">
        <div className="col-12">
          <div className="card shadow-lg border-0 rounded-4 overflow-hidden mb-5 transition-all duration-500 animate-fade-in" style={{ boxShadow: '0 10px 40px rgba(0, 0, 0, 0.1)' }}>
            <div className="card-body bg-gradient-to-br from-white to-blue-50">
              <div className="d-flex justify-content-between align-items-center mb-6">
                <h2 className="fw-bold text-primary display-6">图书管理</h2>
                <Link to="/books/add" className="btn btn-primary btn-lg rounded-pill shadow-lg bg-gradient-to-r from-primary to-blue-600 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                  <i className="bi bi-plus-circle me-2"></i> 添加图书
                </Link>
              </div>
              
              {error && (
                <div className="alert alert-danger alert-dismissible fade show border-0 rounded-3 shadow-sm mb-4" role="alert">
                  {error}
                  <button type="button" className="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
                </div>
              )}
              
              {/* 搜索栏 */}
              <div className="mb-6">
                <div className="input-group shadow-lg rounded-5 overflow-hidden transition-all duration-300 hover:shadow-xl">
                  <span className="input-group-text bg-white border-0 px-4">
                    <i className="bi bi-search text-primary fs-5"></i>
                  </span>
                  <input
                    type="text"
                    className="form-control form-control-lg border-0 py-3 px-4 bg-white"
                    placeholder="搜索图书（标题、作者、ISBN、分类）"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    style={{ boxShadow: 'inset 0 1px 3px rgba(0, 0, 0, 0.05)' }}
                  />
                  {searchTerm && (
                    <button
                      className="btn btn-outline-primary border-0 bg-white text-primary fw-medium px-4 hover:bg-primary hover:text-white transition-all duration-200"
                      onClick={() => setSearchTerm('')}
                    >
                      <i className="bi bi-x-circle me-1"></i> 清除
                    </button>
                  )}
                </div>
              
              <div className="table-responsive">
                  <table className="table table-hover mb-0">
                    <thead className="table-primary bg-gradient-to-r from-primary to-blue-600">
                      <tr>
                        <th className="py-4 px-6 text-white border-0">ID</th>
                        <th className="py-4 px-6 text-white border-0">封面</th>
                        <th className="py-4 px-6 text-white border-0">标题</th>
                        <th className="py-4 px-6 text-white border-0">作者</th>
                        <th className="py-4 px-6 text-white border-0">ISBN</th>
                        <th className="py-4 px-6 text-white border-0">分类</th>
                        <th className="py-4 px-6 text-white border-0">价格</th>
                        <th className="py-4 px-6 text-white border-0">库存</th>
                        <th className="py-4 px-6 text-white border-0">状态</th>
                        <th width="200" className="py-4 px-6 text-white border-0">操作</th>
                      </tr>
                    </thead>
                    <tbody className="table-group-divider">
                      {filteredBooks.length === 0 ? (
                        <tr>
                          <td colSpan="10" className="text-center py-12 bg-gradient-to-b from-white to-blue-50">
                            <div className="p-8 transition-all duration-500 hover:scale-105">
                              <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-primary bg-opacity-10 mb-6">
                                <i className="bi bi-book-half fs-1 text-primary opacity-90"></i>
                              </div>
                              <p className="fs-5 fw-medium text-gray-700 mb-2">暂无图书数据</p>
                              <p className="text-sm text-gray-500 mb-4">点击上方"添加图书"按钮开始管理您的图书</p>
                              <Link to="/books/add" className="btn btn-primary rounded-pill shadow-sm hover:shadow-md transition-all duration-200">
                                <i className="bi bi-plus-circle me-2"></i> 添加第一本图书
                              </Link>
                            </div>
                          </td>
                        </tr>
                      ) : (
                        filteredBooks.map(book => (
                          <tr key={book.id} className="align-middle transition-all duration-300 hover:bg-blue-50 hover:shadow-md">
                            <td className="py-4 px-6">
                              <span className="badge bg-light text-dark rounded-full px-3 py-1 fw-medium">{book.id}</span>
                            </td>
                            <td className="py-4 px-6">
                              {book.coverImage ? (
                                <img 
                                  src={`http://localhost:8080${book.coverImage}`} 
                                  alt={book.title} 
                                  style={{ width: '75px', height: '110px', objectFit: 'cover', borderRadius: '10px' }}
                                  className="shadow-md border border-gray-100 transition-all duration-300 hover:scale-110 hover:shadow-lg"
                                />
                              ) : (
                                <div style={{ width: '75px', height: '110px', backgroundColor: '#f8fafc', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '2px dashed #cbd5e1' }}>
                                  <i className="bi bi-book fs-3 text-primary opacity-75"></i>
                                </div>
                              )}
                            </td>
                            <td className="py-4 px-6">
                              <div className="fw-semibold text-gray-800">{book.title}</div>
                              <div className="text-xs text-gray-500 mt-1">ID: {book.id}</div>
                            </td>
                            <td className="py-4 px-6">
                              <div className="text-gray-700">{book.author}</div>
                            </td>
                            <td className="py-4 px-6">
                              <div className="text-sm text-gray-600 font-mono">{book.isbn}</div>
                            </td>
                            <td className="py-4 px-6">
                              {(() => {
                                const category = book.categoryName || book.category?.name || '未分类';
                                const categoryClass = {
                                  '文学': 'bg-primary',
                                  '科技': 'bg-info',
                                  '历史': 'bg-secondary',
                                  '艺术': 'bg-secondary',
                                  '教育': 'bg-success',
                                  '经济': 'bg-warning',
                                  '生活': 'bg-success',
                                  '未分类': 'bg-secondary'
                                }[category] || 'bg-primary';
                                return (
                                  <span className={`badge ${categoryClass} bg-gradient rounded-full px-4 py-1.5 text-sm fw-semibold transition-all duration-300 hover:shadow-md`}>
                                    {category}
                                  </span>
                                );
                              })()}
                            </td>
                            <td className="py-4 px-6">
                              <div className="text-success fw-semibold fs-6">¥{book.price.toFixed(2)}</div>
                            </td>
                            <td className="py-4 px-6">
                              <span className={`badge ${book.stock < 5 ? 'bg-danger bg-gradient' : 'bg-success bg-gradient'} rounded-full px-4 py-1.5 fw-semibold transition-all duration-300 hover:shadow-md`}>
                                {book.stock < 5 && <i className="bi bi-exclamation-triangle-fill me-1"></i>}{book.stock}
                              </span>
                            </td>
                            <td className="py-4 px-6">
                              <span className={`badge ${book.status ? 'bg-success bg-gradient' : 'bg-warning bg-gradient'} rounded-full px-4 py-1.5 fw-semibold transition-all duration-300 hover:shadow-md`}>
                                {book.status ? <i className="bi bi-check-circle-fill me-1"></i> : <i className="bi bi-clock-fill me-1"></i>}
                                {book.status ? '可借阅' : '已借出'}
                              </span>
                            </td>
                            <td className="py-4 px-6">
                              <div className="d-flex gap-2 flex-wrap">
                                <Link to={`/books/edit/${book.id}`} className="btn btn-sm btn-primary bg-gradient rounded-pill shadow-sm hover:shadow-md transition-all duration-200">
                                  <i className="bi bi-pencil me-1"></i> 编辑
                                </Link>
                                <button 
                                  className="btn btn-sm btn-danger bg-gradient rounded-pill shadow-sm hover:shadow-md transition-all duration-200"
                                  onClick={() => handleDelete(book.id)}
                                >
                                  <i className="bi bi-trash me-1"></i> 删除
                                </button>
                                {book.status && (
                                  <Link to={`/borrow/${book.id}`} className="btn btn-sm btn-success bg-gradient rounded-pill shadow-sm hover:shadow-md transition-all duration-200">
                                    <i className="bi bi-arrow-right me-1"></i> 借阅
                                  </Link>
                                )}
                              </div>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
              
              {/* 统计信息 */}
              <div className="mt-6 p-4 bg-gradient-to-r from-white to-blue-50 rounded-4 shadow-sm transition-all duration-300 hover:shadow-md animate-fade-in">
                <div className="d-flex justify-content-between align-items-center flex-wrap gap-3">
                  <div className="text-gray-700">
                    <span className="fw-medium">共</span> 
                    <strong className="text-primary fs-4">{filteredBooks.length}</strong> 
                    <span className="fw-medium">本图书</span>
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

export default BookList