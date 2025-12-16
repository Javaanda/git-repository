# 图书馆管理系统 - 前端

这是一个基于 React + Vite 构建的图书馆管理系统前端应用，提供了用户管理、图书管理、借阅记录管理等功能。

## 项目功能

### 用户管理
- 用户注册与登录
- 用户列表展示与搜索
- 添加新用户
- 编辑用户信息

### 图书管理
- 图书列表展示与搜索
- 添加新图书
- 编辑图书信息

### 借阅记录管理
- 借阅记录列表展示
- 添加借阅记录
- 图书借阅与归还管理

### 分类管理
- 分类列表展示
- 添加新分类
- 编辑分类信息

## 技术栈

- **前端框架**: React 18
- **构建工具**: Vite
- **路由管理**: React Router
- **HTTP 客户端**: Axios
- **UI 组件库**: Bootstrap
- **状态管理**: React Context API

## 项目结构

```
src/
├── components/          # 组件目录
│   ├── auth/           # 认证相关组件
│   │   ├── Login.jsx   # 登录组件
│   │   └── Register.jsx # 注册组件
│   ├── books/          # 图书相关组件
│   │   ├── BookList.jsx  # 图书列表组件
│   │   ├── AddBook.jsx   # 添加图书组件
│   │   └── EditBook.jsx  # 编辑图书组件
│   ├── borrow/         # 借阅相关组件
│   │   ├── BorrowRecordList.jsx # 借阅记录列表组件
│   │   └── AddBorrowRecord.jsx  # 添加借阅记录组件
│   ├── categories/     # 分类相关组件
│   │   ├── CategoryList.jsx # 分类列表组件
│   │   ├── AddCategory.jsx  # 添加分类组件
│   │   └── EditCategory.jsx # 编辑分类组件
│   └── users/          # 用户相关组件
│       ├── UserList.jsx    # 用户列表组件
│       ├── AddUser.jsx     # 添加用户组件
│       └── EditUser.jsx    # 编辑用户组件
├── assets/             # 静态资源目录
│   └── react.svg       # React logo
├── App.jsx             # 应用入口组件
├── App.css             # App 组件样式
├── main.jsx            # 应用渲染入口
└── index.css           # 全局样式
```

## 安装与运行

### 前置条件

- Node.js >= 16.0.0
- npm >= 8.0.0

### 安装依赖

```bash
npm install
```

### 启动开发服务器

```bash
npm run dev
```

应用将在 http://localhost:5173 启动

### 构建生产版本

```bash
npm run build
```

构建产物将输出到 `dist` 目录

### 预览生产构建

```bash
npm run preview
```

## 开发说明

### API 接口

前端应用通过 Axios 与后端 Spring Boot 应用进行通信。默认 API 地址直接在各个组件的 Axios 请求中配置。

### 路由配置

应用路由配置在 `App.jsx` 中，使用 React Router 实现页面导航。

### 认证机制

应用使用 JWT Token 进行认证，登录成功后 Token 会存储在 localStorage 中，并通过组件状态进行管理。

## 浏览器支持

- Chrome (推荐)
- Firefox
- Safari
- Edge

## License

MIT