# 多阶段构建 Dockerfile for Twilight Blog

# 阶段1: 构建阶段
FROM node:20-alpine AS builder

# 安装 pnpm
RUN npm install -g pnpm@9.14.4

# 设置工作目录
WORKDIR /app

# 复制 package.json 和 pnpm-lock.yaml
COPY package.json pnpm-lock.yaml ./

# 安装依赖
RUN pnpm install --frozen-lockfile

# 复制项目文件
COPY . .

# 构建项目
RUN pnpm build

# 阶段2: 生产阶段 - 使用 Nginx 提供静态文件
FROM nginx:alpine

# 复制构建产物到 nginx 目录
COPY --from=builder /app/dist /usr/share/nginx/html

# 复制 nginx 配置文件
COPY nginx.conf /etc/nginx/conf.d/default.conf

# 暴露端口
EXPOSE 80

# 启动 nginx
CMD ["nginx", "-g", "daemon off;"]
