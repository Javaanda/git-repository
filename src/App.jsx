import { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, Link, useNavigate } from 'react-router-dom'
import axios from 'axios'
import 'bootstrap/dist/css/bootstrap.min.css'
import './App.css'

// 导入组件
import Login from './components/auth/Login'
import Register from './components/auth/Register'
import BookList from './components/books/BookList'
import AddBook from './components/books/AddBook'
import EditBook from './components/books/EditBook'
import BorrowRecordList from './components/borrow/BorrowRecordList'
import AddBorrowRecord from './components/borrow/AddBorrowRecord'
import CategoryList from './components/categories/CategoryList'
import AddCategory from './components/categories/AddCategory'
import EditCategory from './components/categories/EditCategory'
import UserList from './components/users/UserList'
import AddUser from './components/users/AddUser'
import EditUser from './components/users/EditUser'

// 主应用内容组件（包含在Router内）
function AppContent() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [currentUser, setCurrentUser] = useState(null)
  const navigate = useNavigate()

  // 检查用户是否已认证
  useEffect(() => {
    const token = localStorage.getItem('token')
    if (token) {
      setIsAuthenticated(true)
      // 可以添加获取用户信息的API调用
    }
  }, [])

  // 登录成功处理
  const handleLogin = (user, token) => {
    localStorage.setItem('token', token)
    setIsAuthenticated(true)
    setCurrentUser(user)
  }

  // 退出登录处理
  const handleLogout = () => {
    localStorage.removeItem('token')
    setIsAuthenticated(false)
    setCurrentUser(null)
    navigate('/login')
  }

  return (
    <div className="App">
      {/* 导航栏 */}
      <nav className="navbar navbar-expand-lg navbar-dark bg-dark shadow-sm">
        <div className="container-fluid">
          <Link className="navbar-brand fw-bold fs-5" to="/">图书馆管理系统</Link>
          <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav me-auto mb-2 mb-lg-0">
              {isAuthenticated ? (
                <>
                  <li className="nav-item">
                    <Link className="nav-link active" aria-current="page" to="/books">图书管理</Link>
                  </li>
                  <li className="nav-item">
                    <Link className="nav-link" to="/categories">分类管理</Link>
                  </li>
                  <li className="nav-item">
                    <Link className="nav-link" to="/borrow-records">借阅记录</Link>
                  </li>
                  <li className="nav-item">
                    <Link className="nav-link" to="/users">用户管理</Link>
                  </li>
                </>
              ) : null}
            </ul>
            <ul className="navbar-nav">
              {isAuthenticated ? (
                <li className="nav-item">
                  <button className="btn btn-outline-light nav-link" onClick={handleLogout}>退出登录</button>
                </li>
              ) : (
                <>
                  <li className="nav-item">
                    <Link className="nav-link" to="/login">登录</Link>
                  </li>
                  <li className="nav-item">
                    <Link className="nav-link" to="/register">注册</Link>
                  </li>
                </>
              )}
            </ul>
          </div>
        </div>
      </nav>

      {/* 主内容区 */}
      <div className="container-fluid p-0">
        <Routes>
          {/* 认证路由 */}
          <Route path="/login" element={<Login onLogin={handleLogin} />} />
          <Route path="/register" element={<Register />} />
          
          {/* 图书管理路由 */}
          <Route path="/books" element={<BookList />} />
          <Route path="/books/add" element={<AddBook />} />
          <Route path="/books/edit/:id" element={<EditBook />} />
          
          {/* 借阅记录路由 */}
          <Route path="/borrow-records" element={<BorrowRecordList />} />
          <Route path="/borrow-records/add" element={<AddBorrowRecord />} />
          
          {/* 分类管理路由 */}
          <Route path="/categories" element={<CategoryList />} />
          <Route path="/categories/add" element={<AddCategory />} />
          <Route path="/categories/edit/:id" element={<EditCategory />} />
          
          {/* 用户管理路由 */}
          <Route path="/users" element={<UserList />} />
          <Route path="/users/add" element={<AddUser />} />
          <Route path="/users/edit/:id" element={<EditUser />} />
          
          {/* 默认路由 */}
          <Route path="/" element={<Login onLogin={handleLogin} />} />
        </Routes>
      </div>
    </div>
  )
}

// 根组件
function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  )
}

export default App