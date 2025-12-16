import { useState, useEffect } from 'react'
import axios from 'axios'
import { useParams, useNavigate } from 'react-router-dom'

function EditBook() {
  const { id } = useParams()
  const [book, setBook] = useState({
    title: '',
    author: '',
    isbn: '',
    publisher: '',
    publishDate: '',
    categoryId: '',
    price: '',
    description: '',
    stock: 0,
    coverImage: null,
    existingCoverImage: null
  })
  const [categories, setCategories] = useState([])
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [uploading, setUploading] = useState(false)
  const navigate = useNavigate()

  // 获取图书信息
  useEffect(() => {
    const fetchBook = async () => {
      try {
        const token = localStorage.getItem('token')
        const response = await axios.get(`http://localhost:8080/api/books/${id}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        })
        const bookData = response.data
        setBook({
          ...bookData,
          publishDate: bookData.publishDate ? bookData.publishDate.slice(0, 10) : '',
          existingCoverImage: bookData.coverImage
        })
      } catch (err) {
        setError('获取图书信息失败')
      }
    }

    fetchBook()
  }, [id])

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
  }, [])

  // 处理表单输入变化
  const handleChange = (e) => {
    const { name, value, type, checked, files } = e.target
    if (type === 'file' && files.length > 0) {
      setBook({ ...book, coverImage: files[0] })
    } else if (type === 'checkbox') {
      setBook({ ...book, [name]: checked })
    } else {
      setBook({ ...book, [name]: value })
    }
  }

  // 上传封面图片
  const uploadCoverImage = async () => {
    if (!book.coverImage) return book.existingCoverImage
    
    setUploading(true)
    try {
      const formData = new FormData()
      formData.append('file', book.coverImage)
      
      const token = localStorage.getItem('token')
      const response = await axios.post('http://localhost:8080/api/upload/book-cover', formData, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      })
      
      // 如果上传了新图片，删除旧图片
      if (book.existingCoverImage) {
        const oldFilename = book.existingCoverImage.split('/').pop()
        await axios.delete(`http://localhost:8080/api/upload/book-cover/${oldFilename}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        })
      }
      
      return response.data.url
    } catch (err) {
      throw new Error('上传封面图片失败')
    } finally {
      setUploading(false)
    }
  }

  // 处理表单提交
  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSuccess('')
    
    try {
      // 上传封面图片（如果有）
      const coverImageUrl = await uploadCoverImage()
      
      // 准备图书数据
      const bookData = {
        ...book,
        categoryId: parseInt(book.categoryId),
        price: parseFloat(book.price),
        stock: parseInt(book.stock),
        coverImage: coverImageUrl
      }
      
      // 发送更新图书请求
      const token = localStorage.getItem('token')
      await axios.put(`http://localhost:8080/api/books/${id}`, bookData, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      
      setSuccess('图书更新成功')
      
      // 跳转到图书列表
      setTimeout(() => {
        navigate('/books')
      }, 1500)
    } catch (err) {
      setError(err.message || '更新图书失败')
    }
  }

  // 删除封面图片
  const handleDeleteCover = async () => {
    if (!book.existingCoverImage) return
    
    try {
      const token = localStorage.getItem('token')
      const filename = book.existingCoverImage.split('/').pop()
      await axios.delete(`http://localhost:8080/api/upload/book-cover/${filename}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      
      setBook({
        ...book,
        existingCoverImage: null
      })
      setSuccess('封面图片已删除')
    } catch (err) {
      setError('删除封面图片失败')
    }
  }

  return (
    <div className="container-fluid py-5">
      <div className="row">
        <div className="col-12">
          <div className="card shadow-lg border-0 rounded-4 overflow-hidden mb-5 transition-all duration-500 animate-fade-in">
            <div className="card-body bg-gradient-to-br from-white to-blue-50">
              <div className="d-flex justify-content-between align-items-center mb-6">
                <h2 className="fw-bold text-primary display-6">编辑图书</h2>
                <Link to="/books" className="btn btn-secondary btn-lg rounded-pill shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                  <i className="bi bi-arrow-left-circle me-2"></i> 返回图书列表
                </Link>
              </div>
              
              {error && (
                <div className="alert alert-danger border-0 rounded-xl mb-5 shadow-sm">
                  <div className="d-flex align-items-center">
                    <svg className="bi bi-exclamation-circle-fill me-2" width="20" height="20" fill="currentColor">
                      <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zM8 4a.905.905 0 0 0-.9.995l.35 3.507a.552.552 0 0 0 1.1 0l.35-3.507A.905.905 0 0 0 8 4zm.002 6a1 1 0 1 0 0 2 1 1 0 0 0 0-2z"/>
                    </svg>
                    <span>{error}</span>
                  </div>
                </div>
              )}
              {success && (
                <div className="alert alert-success border-0 rounded-xl mb-5 shadow-sm">
                  <div className="d-flex align-items-center">
                    <svg className="bi bi-check-circle-fill me-2" width="20" height="20" fill="currentColor">
                      <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zm-3.97-3.03a.75.75 0 0 0-1.08.022L7.477 9.417 5.384 7.323a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-.01-1.05z"/>
                    </svg>
                    <span>{success}</span>
                  </div>
                </div>
              )}
              
              <form onSubmit={handleSubmit}>
                <div className="row">
                  <div className="col-md-6">
                    <div className="mb-4">
                      <label htmlFor="title" className="form-label text-sm font-medium text-gray-700 mb-1 block">标题</label>
                      <input
                        type="text"
                        className="form-control rounded-pill shadow-sm border-gray-200 focus:ring-2 focus:ring-primary focus:border-primary transition-all"
                        id="title"
                        name="title"
                        value={book.title}
                        onChange={handleChange}
                        placeholder="请输入图书标题"
                        required
                      />
                    </div>
                    
                    <div className="mb-4">
                      <label htmlFor="author" className="form-label text-sm font-medium text-gray-700 mb-1 block">作者</label>
                      <input
                        type="text"
                        className="form-control rounded-pill shadow-sm border-gray-200 focus:ring-2 focus:ring-primary focus:border-primary transition-all"
                        id="author"
                        name="author"
                        value={book.author}
                        onChange={handleChange}
                        placeholder="请输入作者姓名"
                        required
                      />
                    </div>
                    
                    <div className="mb-4">
                      <label htmlFor="isbn" className="form-label text-sm font-medium text-gray-700 mb-1 block">ISBN</label>
                      <input
                        type="text"
                        className="form-control rounded-pill shadow-sm border-gray-200 focus:ring-2 focus:ring-primary focus:border-primary transition-all"
                        id="isbn"
                        name="isbn"
                        value={book.isbn}
                        onChange={handleChange}
                        placeholder="请输入ISBN号"
                      />
                    </div>
                    
                    <div className="mb-4">
                      <label htmlFor="publisher" className="form-label text-sm font-medium text-gray-700 mb-1 block">出版社</label>
                      <input
                        type="text"
                        className="form-control rounded-pill shadow-sm border-gray-200 focus:ring-2 focus:ring-primary focus:border-primary transition-all"
                        id="publisher"
                        name="publisher"
                        value={book.publisher}
                        onChange={handleChange}
                        placeholder="请输入出版社"
                      />
                    </div>
                    
                    <div className="mb-4">
                      <label htmlFor="publishDate" className="form-label text-sm font-medium text-gray-700 mb-1 block">出版日期</label>
                      <input
                        type="date"
                        className="form-control rounded-pill shadow-sm border-gray-200 focus:ring-2 focus:ring-primary focus:border-primary transition-all"
                        id="publishDate"
                        name="publishDate"
                        value={book.publishDate}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                  
                  <div className="col-md-6">
                    <div className="mb-4">
                      <label htmlFor="categoryId" className="form-label text-sm font-medium text-gray-700 mb-1 block">分类</label>
                      <select
                        className="form-select rounded-pill shadow-sm border-gray-200 focus:ring-2 focus:ring-primary focus:border-primary transition-all"
                        id="categoryId"
                        name="categoryId"
                        value={book.categoryId}
                        onChange={handleChange}
                        required
                      >
                        <option value="">请选择分类</option>
                        {categories.map(category => (
                          <option key={category.id} value={category.id}>
                            {category.name}
                          </option>
                        ))}
                      </select>
                    </div>
                    
                    <div className="mb-4">
                      <label htmlFor="price" className="form-label text-sm font-medium text-gray-700 mb-1 block">价格</label>
                      <input
                        type="number"
                        className="form-control rounded-pill shadow-sm border-gray-200 focus:ring-2 focus:ring-primary focus:border-primary transition-all"
                        id="price"
                        name="price"
                        value={book.price}
                        onChange={handleChange}
                        step="0.01"
                        placeholder="请输入价格"
                        required
                      />
                    </div>
                    
                    <div className="mb-4">
                      <label htmlFor="stock" className="form-label text-sm font-medium text-gray-700 mb-1 block">库存</label>
                      <input
                        type="number"
                        className="form-control rounded-pill shadow-sm border-gray-200 focus:ring-2 focus:ring-primary focus:border-primary transition-all"
                        id="stock"
                        name="stock"
                        value={book.stock}
                        onChange={handleChange}
                        min="0"
                        placeholder="请输入库存数量"
                        required
                      />
                    </div>
                    
                    <div className="mb-4">
                      <label htmlFor="coverImage" className="form-label text-sm font-medium text-gray-700 mb-1 block">封面图片</label>
                      <input
                        type="file"
                        className="form-control rounded-pill shadow-sm border-gray-200 focus:ring-2 focus:ring-primary focus:border-primary transition-all"
                        id="coverImage"
                        name="coverImage"
                        accept="image/*"
                        onChange={handleChange}
                      />
                      {uploading && <small className="text-muted">正在上传...</small>}
                      
                      {book.existingCoverImage && (
                        <div className="mt-3 p-4 bg-white border border-gray-200 rounded-xl shadow-sm">
                          <h6 className="text-sm font-medium text-gray-700 mb-2">现有封面图片：</h6>
                          <div className="d-flex flex-column align-items-start gap-3">
                            <img 
                              src={`http://localhost:8080${book.existingCoverImage}`} 
                              alt="图书封面" 
                              style={{ maxWidth: '200px', maxHeight: '300px', borderRadius: '8px' }}
                              className="border border-gray-200 shadow-sm"
                            />
                            <button 
                              type="button" 
                              className="btn btn-sm btn-danger rounded-pill shadow-sm hover:shadow transition-all duration-300 transform hover:-translate-y-1"
                              onClick={handleDeleteCover}
                            >
                              <i className="bi bi-trash-fill me-1"></i> 删除封面图片
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                
                <div className="mb-5">
                  <label htmlFor="description" className="form-label text-sm font-medium text-gray-700 mb-1 block">描述</label>
                  <textarea
                    className="form-control rounded-xl shadow-sm border-gray-200 focus:ring-2 focus:ring-primary focus:border-primary transition-all"
                    id="description"
                    name="description"
                    value={book.description}
                    onChange={handleChange}
                    rows="4"
                    placeholder="请输入图书描述"
                  ></textarea>
                </div>
                
                <div className="d-flex gap-3">
                  <button 
                    type="submit" 
                    className="btn btn-lg rounded-pill bg-gradient-to-r from-primary to-blue-600 text-white font-medium shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
                    disabled={uploading}
                  >
                    {uploading ? '更新中...' : '更新图书'}
                  </button>
                  <button 
                    type="button" 
                    className="btn btn-lg btn-secondary rounded-pill shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
                    onClick={() => navigate('/books')}
                  >
                    取消
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

export default EditBook