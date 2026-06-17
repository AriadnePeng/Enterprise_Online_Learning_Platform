# 企业在线学习平台交接说明

本压缩包包含两个项目：

- `backend`：Spring Boot + MyBatis 后端
- `frontend`：React + Vite 前端，当前使用完整分支 `codex/docker-backend-deploy-20260616`

## 1. 后端启动

用 IntelliJ IDEA 打开：

```text
backend
```

运行：

```text
src/main/java/com/example/learning/EnterpriseLearningApplication.java
```

后端默认端口：

```text
http://127.0.0.1:8080
```

数据库配置文件：

```text
backend/src/main/resources/application.yml
```

需要确认 MySQL 数据库：

```text
enterprise_learning_db
```

健康检查：

```text
http://127.0.0.1:8080/api/health
```

## 2. 前端启动

进入前端目录：

```powershell
cd frontend
npm install
npm run dev
```

前端默认端口：

```text
http://localhost:3000
```

登录页演示账号：

```text
账号：admin
密码：123456
```

## 3. 前后端连接方式

前端接口统一请求：

```text
http://127.0.0.1:8080/api/...
```

后端已经补了前端完整版会调用的基础接口：

```text
POST /api/auth/login
GET  /api/{table}/list
GET  /api/{table}/detail/{id}
POST /api/{table}/add
POST /api/{table}/update
POST /api/{table}/delete/{id}
GET  /api/views/...
POST /api/procedures/...
GET  /api/health
```

## 4. 注意事项

如果接口返回：

```text
Table/View/Procedure doesn't exist
```

说明 MySQL 里对应的表、视图或存储过程还没有创建，不是前端问题，也不是后端启动问题。

可先执行：

```text
backend/sql/init_views_and_procedures.sql
```

该 SQL 用于补充部分视图和存储过程。

## 5. 常用测试接口

```text
http://127.0.0.1:8080/api/health
http://127.0.0.1:8080/api/user_info/list
http://127.0.0.1:8080/api/views/users/safe
http://127.0.0.1:8080/api/views/exams/score-summary
```
