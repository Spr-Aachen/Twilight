# Docker 部署指南

本指南将帮助您使用 Docker 部署 Twilight 博客项目。

## 前置要求

- Docker 已安装（版本 20.10 或更高）
- Docker Compose 已安装（版本 2.0 或更高）

## 快速开始

### 1. 构建并启动容器

```bash
# 使用 docker-compose 构建并启动
docker-compose up -d --build
```

### 2. 访问应用

容器启动后，访问 http://localhost:8080 即可查看您的博客。

### 3. 停止容器

```bash
# 停止并删除容器
docker-compose down
```

## 详细说明

### 使用 Dockerfile 直接构建

```bash
# 构建镜像
docker build -t twilight-blog .

# 运行容器
docker run -d -p 8080:80 --name twilight-blog twilight-blog
```

### 使用 Docker Compose

`docker-compose.yml` 文件已经配置好了所有必要的设置：

- **端口映射**: 容器内的 80 端口映射到主机的 8080 端口
- **自动重启**: 容器会在停止后自动重启（除非手动停止）
- **网络**: 使用独立的 Docker 网络

### 自定义配置

#### 修改端口

编辑 `docker-compose.yml` 文件，修改端口映射：

```yaml
ports:
  - "3000:80"  # 将 8080 改为您想要的端口
```

#### 修改 Nginx 配置

1. 编辑 `nginx.conf` 文件
2. 重新构建镜像：

```bash
docker-compose up -d --build
```

#### 查看日志

```bash
# 查看容器日志
docker-compose logs -f

# 或者使用 docker 命令
docker logs -f twilight-blog
```

## 生产环境部署建议

### 1. 使用环境变量

创建 `.env` 文件（如果需要）：

```env
TZ=Asia/Shanghai
```

### 2. 使用反向代理

在生产环境中，建议使用 Nginx 或 Traefik 作为反向代理，而不是直接暴露容器端口。

### 3. 使用 HTTPS

配置 SSL 证书，可以通过：
- Let's Encrypt
- 云服务商的 SSL 服务
- 自签名证书（仅用于测试）

### 4. 资源限制

在 `docker-compose.yml` 中添加资源限制：

```yaml
services:
  twilight:
    # ... 其他配置
    deploy:
      resources:
        limits:
          cpus: '1'
          memory: 512M
        reservations:
          cpus: '0.5'
          memory: 256M
```

## 故障排查

### 容器无法启动

1. 检查端口是否被占用：
```bash
# Windows
netstat -ano | findstr :8080

# Linux/Mac
lsof -i :8080
```

2. 查看容器日志：
```bash
docker-compose logs twilight
```

### 构建失败

1. 确保网络连接正常（需要下载依赖）
2. 检查 Docker 是否有足够的磁盘空间
3. 清理旧的构建缓存：
```bash
docker system prune -a
```

### 页面无法访问

1. 检查容器是否正在运行：
```bash
docker ps
```

2. 检查端口映射是否正确
3. 查看 Nginx 日志：
```bash
docker exec twilight-blog cat /var/log/nginx/error.log
```

## 更新部署

当您更新了代码后：

```bash
# 停止当前容器
docker-compose down

# 重新构建并启动
docker-compose up -d --build
```

## 清理

```bash
# 停止并删除容器、网络
docker-compose down

# 删除镜像
docker rmi twilight-blog

# 清理所有未使用的资源
docker system prune -a
```

## 注意事项

- 首次构建可能需要较长时间（下载依赖和构建项目）
- 确保有足够的磁盘空间（建议至少 2GB）
- 生产环境建议使用具体的镜像标签而不是 `latest`
