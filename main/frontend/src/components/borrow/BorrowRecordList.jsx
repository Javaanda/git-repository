import { useState, useEffect } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'

function BorrowRecordList() {
  const [borrowRecords, setBorrowRecords] = useState([])
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const navigate = useNavigate()

  // 获取借阅记录
  useEffect(() => {
    const fetchBorrowRecords = async () => {
      try {
        const token = localStorage.getItem('token')
        const response = await axios.get('http://localhost:8080/api/borrow-records', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        })
        setBorrowRecords(response.data)
      } catch (err) {
        setError('获取借阅记录失败')
      }
    }

    fetchBorrowRecords()
  }, [success])

  // 处理图书归还
  const handleReturnBook = async (recordId) => {
    if (!window.confirm('确定要归还这本书吗？')) return
    
    try {
      const token = localStorage.getItem('token')
      await axios.put(`http://localhost:8080/api/borrow-records/return/${recordId}`, {}, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      setSuccess('图书归还成功')
      
      // 3秒后清除成功消息
      setTimeout(() => {
        setSuccess('')
      }, 3000)
    } catch (err) {
      setError('图书归还失败')
    }
  }

  // 处理删除借阅记录
  const handleDeleteRecord = async (recordId) => {
    if (!window.confirm('确定要删除这条借阅记录吗？')) return
    
    try {
      const token = localStorage.getItem('token')
      await axios.delete(`http://localhost:8080/api/borrow-records/${recordId}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      setSuccess('借阅记录删除成功')
      
      // 3秒后清除成功消息
      setTimeout(() => {
        setSuccess('')
      }, 3000)
    } catch (err) {
      setError('借阅记录删除失败')
    }
  }

  return (
    <div className="container-fluid py-5">
      <div className="row">
        <div className="col-12">
          <div className="card shadow-lg border-0 rounded-4 overflow-hidden mb-5 transition-all duration-500 animate-fade-in" style={{ boxShadow: '0 10px 40px rgba(0, 0, 0, 0.1)' }}>
            <div className="card-body bg-gradient-to-br from-white to-blue-50">
              <div className="d-flex justify-content-between align-items-center mb-6">
                <h2 className="fw-bold text-primary display-6">借阅记录管理</h2>
                <button className="btn btn-primary btn-lg rounded-pill shadow-lg bg-gradient-to-r from-primary to-blue-600 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1" onClick={() => navigate('/borrow-records/add')}>
                  <i className="bi bi-plus-circle me-2"></i> 新增借阅
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
              
              <div className="card shadow-lg border-0 rounded-4 overflow-hidden" style={{ boxShadow: '0 8px 30px rgba(0, 0, 0, 0.08)' }}>
                <div className="table-responsive">
                  <table className="table table-hover mb-0">
                    <thead className="table-primary bg-gradient-to-r from-primary to-blue-600">
                      <tr>
                        <th className="py-4 px-6 text-white border-0">#</th>
                        <th className="py-4 px-6 text-white border-0">图书名称</th>
                        <th className="py-4 px-6 text-white border-0">借阅用户</th>
                        <th className="py-4 px-6 text-white border-0">借阅日期</th>
                        <th className="py-4 px-6 text-white border-0">应还日期</th>
                        <th className="py-4 px-6 text-white border-0">实际归还日期</th>
                        <th className="py-4 px-6 text-white border-0">借阅状态</th>
                        <th width="200" className="py-4 px-6 text-white border-0">操作</th>
                      </tr>
                    </thead>
                    <tbody className="table-group-divider">
                      {borrowRecords.length === 0 ? (
                        <tr>
                          <td colSpan="8" className="text-center py-12 bg-gradient-to-b from-white to-blue-50">
                            <div className="p-8 transition-all duration-500 hover:scale-105">
                              <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-primary bg-opacity-10 mb-6">
                                <i className="bi bi-bookmark-heart fs-1 text-primary opacity-90"></i>
                              </div>
                              <p className="fs-5 fw-medium text-gray-700 mb-2">暂无借阅记录</p>
                              <p className="text-sm text-gray-500 mb-4">点击上方"新增借阅"按钮开始管理您的借阅记录</p>
                              <button className="btn btn-primary rounded-pill shadow-sm hover:shadow-md transition-all duration-200" onClick={() => navigate('/borrow-records/add')}>
                                <i className="bi bi-plus-circle me-2"></i> 添加第一笔借阅记录
                              </button>
                            </div>
                          </td>
                        </tr>
                      ) : (
                        borrowRecords.map((record, index) => (
                          <tr key={record.id} className="align-middle transition-all duration-300 hover:bg-blue-50 hover:shadow-md">
                            <td className="py-4 px-6">
                              <span className="badge bg-light text-dark rounded-full px-3 py-1 fw-medium">{index + 1}</span>
                            </td>
                            <td className="py-4 px-6">
                              <div className="fw-semibold text-gray-800">{record.bookTitle || record.book?.title || '未知图书'}</div>
                            </td>
                            <td className="py-4 px-6">
                              <div className="text-gray-700">{record.userFullName || record.user?.fullName || '未知用户'}</div>
                            </td>
                            <td className="py-4 px-6">
                              <div className="text-gray-700">{new Date(record.borrowDate).toLocaleDateString()}</div>
                            </td>
                            <td className="py-4 px-6">
                              <div className="text-gray-700">{new Date(record.dueDate).toLocaleDateString()}</div>
                            </td>
                            <td className="py-4 px-6">
                              <div className="text-gray-700">{record.returnDate ? new Date(record.returnDate).toLocaleDateString() : '-'}</div>
                            </td>
                            <td className="py-4 px-6">
                              <span className={`badge ${record.status === 'BORROWED' ? 'bg-primary bg-gradient' : 'bg-success bg-gradient'} rounded-full px-4 py-1.5 fw-semibold transition-all duration-300 hover:shadow-md`}>
                                {record.status === 'BORROWED' ? '已借阅' : '已归还'}
                              </span>
                            </td>
                            <td className="py-4 px-6">
                              <div className="d-flex gap-2">
                                {record.status === 'BORROWED' && (
                                  <button 
                                    className="btn btn-sm btn-success bg-gradient rounded-pill shadow-sm hover:shadow-md transition-all duration-200"
                                    onClick={() => handleReturnBook(record.id)}
                                    title="归还图书"
                                  >
                                    <i className="bi bi-arrow-return-left me-1"></i> 归还
                                  </button>
                                )}
                                <button 
                                  className="btn btn-sm btn-danger bg-gradient rounded-pill shadow-sm hover:shadow-md transition-all duration-200"
                                  onClick={() => handleDeleteRecord(record.id)}
                                  title="删除记录"
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
              </div>
              
              {/* 统计信息 */}
              <div className="mt-6 p-4 bg-gradient-to-r from-white to-blue-50 rounded-4 shadow-sm transition-all duration-300 hover:shadow-md animate-fade-in">
                <div className="d-flex justify-content-between align-items-center flex-wrap gap-3">
                  <div className="text-gray-700">
                    <span className="fw-medium">共</span> 
                    <strong className="text-primary fs-4">{borrowRecords.length}</strong> 
                    <span className="fw-medium">条借阅记录</span>
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

export default BorrowRecordList