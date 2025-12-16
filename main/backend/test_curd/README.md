# Spring Boot CRUD 示例项目

这是一个基于 Spring Boot 的 CRUD (Create, Read, Update, Delete) 示例项目，使用 Maven 构建，演示了如何使用 Spring Boot、Spring Data JPA 和 MySQL 实现基本的用户管理功能。

## 技术栈

- Spring Boot 2.7.18
- Spring Data JPA
- MySQL 数据库
- Maven
- Lombok

## 项目结构

```
src/
├── main/
│   ├── java/com/example/test_curd/
│   │   ├── TestCurdApplication.java  # 应用程序入口
│   │   ├── controller/               # 控制器层
│   │   │   └── UserController.java
│   │   ├── entity/                   # 实体层
│   │   │   └── User.java
│   │   ├── repository/               # 数据访问层
│   │   │   └── UserRepository.java
│   │   └── service/                  # 服务层
│   │       ├── UserService.java
│   │       └── impl/
│   │           └── UserServiceImpl.java
│   └── resources/
│       └── application.properties    # 应用程序配置
└── test/                             # 测试代码
```

## 配置和运行

### 1. 创建数据库

首先，你需要在 MySQL 中创建一个名为 `test_curd` 的数据库：

```sql
CREATE DATABASE test_curd;
```

### 2. 配置数据库连接

在 `src/main/resources/application.properties` 文件中配置你的 MySQL 数据库连接信息：

```properties
spring.datasource.url=jdbc:mysql://localhost:3306/test_curd?useUnicode=true&characterEncoding=utf8&useSSL=false&serverTimezone=UTC&rewriteBatchedStatements=true
spring.datasource.username=root  # 你的 MySQL 用户名
spring.datasource.password=root  # 你的 MySQL 密码
```

### 3. 构建和运行项目

使用 Maven 构建项目：

```bash
mvn clean compile
```

启动 Spring Boot 应用程序：

```bash
mvn spring-boot:run
```

应用程序将在 `http://localhost:8080` 上启动。

## API 端点

### 用户管理

| 方法 | URL | 描述 |
|------|-----|------|
| GET | /api/users | 获取所有用户 |
| GET | /api/users/{id} | 根据 ID 获取用户 |
| POST | /api/users | 创建新用户 |
| PUT | /api/users/{id} | 更新用户信息 |
| DELETE | /api/users/{id} | 删除用户 |

## 示例请求

### 创建用户

```bash
curl -X POST -H "Content-Type: application/json" -d '{"username": "testuser", "password": "password123", "email": "test@example.com", "fullName": "Test User"}' http://localhost:8080/api/users
```

### 获取所有用户

```bash
curl http://localhost:8080/api/users
```

### 获取单个用户

```bash
curl http://localhost:8080/api/users/1
```

### 更新用户

```bash
curl -X PUT -H "Content-Type: application/json" -d '{"username": "updateduser", "password": "newpassword123", "email": "updated@example.com", "fullName": "Updated User"}' http://localhost:8080/api/users/1
```

### 删除用户

```bash
curl -X DELETE http://localhost:8080/api/users/1
```

## 注意事项

1. 确保你的 MySQL 服务器正在运行
2. 确保你已经创建了 `test_curd` 数据库
3. 确保你在 `application.properties` 中配置了正确的数据库连接信息
4. 本项目使用 Lombok 简化代码，如果你使用 IDE 开发，需要安装 Lombok 插件

## 许可证

MIT
