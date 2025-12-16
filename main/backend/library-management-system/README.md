# 图书管理系统 (Library Management System)

一个基于 Spring Boot 的完整图书管理系统，提供 RESTful API 接口，实现图书管理、用户管理、分类管理、借阅管理等功能。

## 技术栈

- **后端框架**：Spring Boot 2.7.18
- **ORM 框架**：Spring Data JPA
- **数据库**：MySQL
- **构建工具**：Maven
- **开发语言**：Java 8
- **安全框架**：Spring Security + JWT
- **其他依赖**：
  - Lombok (简化代码)
  - Spring Validation (数据验证)
  - MySQL Connector (数据库驱动)
  - Apache Commons FileUpload (文件上传)

## 项目结构

```
library-management-system/
├── src/
│   ├── main/
│   │   ├── java/com/example/librarymanagementsystem/
│   │   │   ├── LibraryManagementSystemApplication.java  # 应用入口
│   │   │   ├── config/  # 配置层
│   │   │   │   ├── DataInitializer.java  # 数据初始化
│   │   │   │   ├── FileUploadConfig.java  # 文件上传配置
│   │   │   │   ├── JwtConfig.java  # JWT配置
│   │   │   │   └── SecurityConfig.java  # 安全配置
│   │   │   ├── controller/  # 控制器层
│   │   │   │   ├── BookController.java  # 图书控制器
│   │   │   │   ├── BorrowRecordController.java  # 借阅记录控制器
│   │   │   │   ├── CategoryController.java  # 分类控制器
│   │   │   │   ├── FileUploadController.java  # 文件上传控制器
│   │   │   │   └── UserController.java  # 用户控制器
│   │   │   ├── entity/  # 实体层
│   │   │   │   ├── Book.java  # 图书实体
│   │   │   │   ├── BorrowRecord.java  # 借阅记录实体
│   │   │   │   ├── Category.java  # 分类实体
│   │   │   │   └── User.java  # 用户实体
│   │   │   ├── repository/  # 数据访问层
│   │   │   │   ├── BookRepository.java  # 图书仓库
│   │   │   │   ├── BorrowRecordRepository.java  # 借阅记录仓库
│   │   │   │   ├── CategoryRepository.java  # 分类仓库
│   │   │   │   └── UserRepository.java  # 用户仓库
│   │   │   ├── security/  # 安全相关
│   │   │   │   ├── JwtAuthenticationFilter.java  # JWT认证过滤器
│   │   │   │   ├── JwtTokenProvider.java  # JWT令牌提供者
│   │   │   │   └── UserDetailsServiceImpl.java  # 用户详情服务
│   │   │   └── service/  # 服务层
│   │   │       ├── impl/  # 服务实现
│   │   │       │   ├── BorrowRecordServiceImpl.java  # 借阅记录服务实现
│   │   │       │   └── CategoryServiceImpl.java  # 分类服务实现
│   │   │       ├── BookService.java  # 图书服务
│   │   │       ├── BorrowRecordService.java  # 借阅记录服务
│   │   │       ├── CategoryService.java  # 分类服务
│   │   │       └── UserService.java  # 用户服务
│   │   └── resources/
│   │       └── application.properties  # 配置文件
│   └── test/  # 测试目录
└── pom.xml  # Maven 配置文件
```

## 功能特性

1. **图书管理**
   - 添加图书
   - 查询图书（按ID、书名、作者、ISBN、分类等）
   - 更新图书信息
   - 删除图书
   - 获取所有可用图书

2. **用户管理**
   - 用户注册
   - 用户登录
   - 获取用户信息
   - JWT认证

3. **分类管理**
   - 添加分类
   - 查询分类
   - 更新分类信息
   - 删除分类

4. **借阅管理**
   - 借阅图书
   - 归还图书
   - 查看借阅记录
   - 库存管理

5. **文件上传**
   - 图书封面上传

## 配置说明

### 数据库配置

在 `application.properties` 文件中配置 MySQL 数据库连接信息：

```properties
spring.datasource.url=jdbc:mysql://localhost:23306/library_db?useUnicode=true&characterEncoding=utf-8&useSSL=false&serverTimezone=UTC
spring.datasource.username=root
spring.datasource.password=52python
spring.datasource.driver-class-name=com.mysql.cj.jdbc.Driver
```

### JPA 配置

```properties
spring.jpa.hibernate.ddl-auto=update  # 自动创建/更新数据库表
spring.jpa.show-sql=true  # 显示 SQL 语句
spring.jpa.properties.hibernate.dialect=org.hibernate.dialect.MySQL5InnoDBDialect  # 使用 MySQL5 方言
```

### JWT 配置

```properties
jwt.secret=ThisIsASecureSecretKeyForJWTGenerationWithAtLeast512BitsOfEntropyToMeetTheHS512AlgorithmRequirements12345678901234567890ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz1234567890ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmn
jwt.expiration=86400000  # JWT过期时间（毫秒）
```

## API 接口

### 用户管理接口

| 方法 | 路径 | 功能 | 参数 |
|------|------|------|------|
| POST | /api/users/register | 用户注册 | User 对象 (JSON) |
| POST | /api/users/login | 用户登录 | 用户名、密码 (JSON) |
| GET | /api/users | 获取所有用户 | 无 |
| GET | /api/users/{id} | 根据ID获取用户 | id: 用户ID |
| PUT | /api/users/{id} | 更新用户信息 | id: 用户ID, User 对象 (JSON) |
| DELETE | /api/users/{id} | 删除用户 | id: 用户ID |

### 分类管理接口

| 方法 | 路径 | 功能 | 参数 |
|------|------|------|------|
| POST | /api/categories | 创建分类 | Category 对象 (JSON) |
| GET | /api/categories | 获取所有分类 | 无 |
| GET | /api/categories/{id} | 根据ID获取分类 | id: 分类ID |
| PUT | /api/categories/{id} | 更新分类 | id: 分类ID, Category 对象 (JSON) |
| DELETE | /api/categories/{id} | 删除分类 | id: 分类ID |

### 图书管理接口

| 方法 | 路径 | 功能 | 参数 |
|------|------|------|------|
| GET | /api/books | 获取所有图书 | 无 |
| GET | /api/books/{id} | 根据ID获取图书 | id: 图书ID |
| GET | /api/books/search/title | 根据书名搜索图书 | title: 书名关键词 |
| GET | /api/books/search/author | 根据作者搜索图书 | author: 作者关键词 |
| GET | /api/books/isbn/{isbn} | 根据ISBN查询图书 | isbn: 图书ISBN |
| GET | /api/books/category/{category} | 根据分类查询图书 | category: 图书分类 |
| GET | /api/books/available | 获取所有可用图书 | 无 |
| POST | /api/books | 添加图书 | Book 对象 (JSON) |
| PUT | /api/books/{id} | 更新图书信息 | id: 图书ID, Book 对象 (JSON) |
| DELETE | /api/books/{id} | 删除图书 | id: 图书ID |
| PUT | /api/books/{id}/stock | 更新图书库存 | id: 图书ID, stock: 库存数量 |

### 借阅管理接口

| 方法 | 路径 | 功能 | 参数 |
|------|------|------|------|
| POST | /api/borrow-records/borrow | 借阅图书 | bookId: 图书ID, userId: 用户ID, days: 借阅天数 |
| POST | /api/borrow-records/return | 归还图书 | recordId: 记录ID |
| GET | /api/borrow-records | 获取所有借阅记录 | 无 |
| GET | /api/borrow-records/user/{userId} | 获取用户借阅记录 | userId: 用户ID |
| GET | /api/borrow-records/book/{bookId} | 获取图书借阅记录 | bookId: 图书ID |

### 文件上传接口

| 方法 | 路径 | 功能 | 参数 |
|------|------|------|------|
| POST | /api/upload | 上传文件 | file: 二进制文件 |

## 实体字段

### User 实体
```json
{
  "id": 1,
  "username": "admin",
  "password": "$2a$10$...",  // 加密后的密码
  "email": "admin@example.com",
  "role": "ADMIN",  // ADMIN/USER
  "createTime": "2023-01-01 10:00:00",
  "updateTime": "2023-01-01 10:00:00"
}
```

### Category 实体
```json
{
  "id": 1,
  "name": "计算机",
  "description": "计算机相关书籍",
  "createTime": "2023-01-01 10:00:00",
  "updateTime": "2023-01-01 10:00:00"
}
```

### Book 实体
```json
{
  "id": 1,
  "title": "Java核心技术",
  "author": "Cay S. Horstmann",
  "isbn": "9787115546003",
  "publisher": "人民邮电出版社",
  "publishDate": "2021-01-01",
  "categoryName": "计算机",
  "price": 129.00,
  "description": "Java核心技术，卷I：基础知识（原书第11版）",
  "stock": 10,
  "status": true,  // true: 可用, false: 已借出
  "coverImage": "book_cover.jpg",
  "createTime": "2023-01-01 10:00:00",
  "updateTime": "2023-01-01 10:00:00"
}
```

### BorrowRecord 实体
```json
{
  "id": 1,
  "bookId": 1,
  "userId": 1,
  "borrowDate": "2023-01-01 10:00:00",
  "returnDate": null,
  "dueDate": "2023-01-15 10:00:00",
  "status": "BORROWED",  // BORROWED/RETURNED/OVERDUE
  "createTime": "2023-01-01 10:00:00",
  "updateTime": "2023-01-01 10:00:00"
}
```

## 运行方式

1. 确保已安装 JDK 1.8+ 和 Maven
2. 配置 MySQL 数据库（端口：23306，数据库名：library_db）
3. 执行以下命令构建项目：
   ```bash
   mvn clean install
   ```
4. 运行项目：
   ```bash
   mvn spring-boot:run
   ```
5. 访问 API 接口：http://localhost:8080/api/books

## 注意事项

1. 首次运行时，系统会自动创建数据库表并初始化基础数据
2. 使用前请确保数据库服务已启动
3. API 接口支持 JSON 格式的请求和响应
4. 用户登录后会返回 JWT 令牌，后续请求需在 Header 中添加 `Authorization: Bearer {token}`
5. 借阅图书时，系统会检查图书状态和库存
6. 归还图书时，系统会自动更新图书状态和库存
7. 文件上传支持常见图片格式

## 许可证

本项目采用 MIT 许可证，详见 LICENSE 文件。
