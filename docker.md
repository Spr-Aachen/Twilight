# Docker 指南

## 📋 前置要求

- 已安装 [Docker](https://www.docker.com/get-started) 和 [Docker Compose](https://docs.docker.com/compose/install/)
- 项目使用 pnpm 作为包管理器

## 📁 文件说明

### 1. `Dockerfile`

多阶段构建的 Docker 镜像配置文件：
- **构建阶段**：使用 `node:lts-alpine` 镜像安装依赖并构建项目
- **运行阶段**：使用 `nginx:alpine` 镜像提供静态文件服务

### 2. `docker-compose.yml`

Docker Compose 配置文件，用于简化容器的构建和管理：
- 定义服务名称和容器名称
- 配置端口映射（默认：`127.0.0.1:8070:80`）不允许外部端口访问
- 设置自动重启策略

### 3. `.dockerignore`

Docker 构建时忽略的文件列表，用于：
- 减小构建上下文大小
- 加快构建速度
- 避免将不必要的文件复制到镜像中

## 🚀 部署步骤

```bash
# 构建并启动容器
docker compose up -d --build

# 查看运行状态
docker compose ps

# 查看日志
docker compose logs -f

# 停止容器
docker compose down
```

## 访问应用

构建完成后，访问：
- 本地访问：http://localhost:8070
- 外部访问需要自行配置反向代理
