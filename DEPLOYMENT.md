# Docker 部署说明

## 本地构建

```bash
docker build -t enterprise-online-learning-platform:latest .
```

## 本地运行

```bash
docker run --rm \
  --name enterprise-online-learning-platform \
  -p 8081:8080 \
  -e API_TOKEN_SECRET=change-this-secret-in-production \
  -v enterprise-learning-data:/app/data \
  enterprise-online-learning-platform:latest
```

打开 `http://127.0.0.1:8081/` 即可访问完整系统，后端健康检查地址为 `http://127.0.0.1:8081/api/health`。

## Docker Compose

```bash
docker compose up -d --build
```

## 推送到云端镜像仓库

把镜像改成你的云端仓库地址后推送：

```bash
docker tag enterprise-online-learning-platform:latest <registry>/<namespace>/enterprise-online-learning-platform:latest
docker push <registry>/<namespace>/enterprise-online-learning-platform:latest
```

如果云服务器前面有域名或 HTTPS 反向代理，前端默认使用同源 `/api/*`，不需要额外配置 API 地址。
