# 自動部署指南

本文件說明如何設定 GitHub Actions 自動部署到 VPS。

## 📋 目錄

- [部署方式選擇](#部署方式選擇)
- [方式一：直接部署到 VPS](#方式一直接部署到-vps)
- [方式二：透過 Docker Hub 部署](#方式二透過-docker-hub-部署)
- [Nginx 反向代理設定](#nginx-反向代理設定)
- [SSL 憑證設定](#ssl-憑證設定)
- [常見問題](#常見問題)

## 🎯 部署方式選擇

本專案提供兩種自動部署方式：

### 方式一：直接部署到 VPS（推薦新手）

**優點**：
- ✅ 設定簡單
- ✅ 不需要 Docker Hub 帳號
- ✅ 適合單一 VPS 部署

**缺點**：
- ⚠️ 在 VPS 上建置，消耗 VPS 資源
- ⚠️ 建置時間較長

**適合情況**：
- 單一 VPS 部署
- VPS 資源充足（至少 2GB RAM）
- 不需要多個環境部署

### 方式二：透過 Docker Hub 部署（推薦進階）

**優點**：
- ✅ 在 GitHub Actions 建置，不消耗 VPS 資源
- ✅ 建置快速
- ✅ 可輕鬆部署到多個 VPS
- ✅ 映像版本化管理

**缺點**：
- ⚠️ 需要 Docker Hub 帳號
- ⚠️ 公開儲存庫免費，私有儲存庫需付費

**適合情況**：
- VPS 資源有限
- 需要部署到多個環境
- 需要版本控制和回滾功能

## 🚀 方式一：直接部署到 VPS

### 1. VPS 初始化設定

在 VPS 上執行初始化腳本：

```bash
# 1. 下載設定腳本
wget https://raw.githubusercontent.com/your-username/towebp/main/scripts/setup-vps.sh

# 2. 賦予執行權限
chmod +x setup-vps.sh

# 3. 執行設定（需要 root 權限）
sudo bash setup-vps.sh
```

此腳本會自動：
- ✅ 安裝 Docker 和 Docker Compose
- ✅ 配置防火牆
- ✅ 克隆專案
- ✅ 設定環境變數
- ✅ 建置並啟動容器

### 2. 手動設定（如不使用自動腳本）

#### 2.1 安裝 Docker

```bash
# 安裝 Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh

# 啟動 Docker
sudo systemctl start docker
sudo systemctl enable docker
```

#### 2.2 安裝 Docker Compose

```bash
# 下載 Docker Compose
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose

# 賦予執行權限
sudo chmod +x /usr/local/bin/docker-compose

# 驗證安裝
docker-compose --version
```

#### 2.3 創建專案目錄並克隆代碼

```bash
# 創建專案目錄
sudo mkdir -p /opt/towebp
cd /opt/towebp

# 克隆專案
sudo git clone https://github.com/your-username/towebp.git .

# 設定環境變數
sudo cp .env.local.example .env.local
sudo vim .env.local  # 編輯環境變數
```

#### 2.4 啟動服務

```bash
# 建置並啟動
sudo docker-compose build
sudo docker-compose up -d

# 查看狀態
sudo docker-compose ps

# 查看日誌
sudo docker-compose logs -f
```

### 3. 設定 GitHub Secrets

在 GitHub 儲存庫中設定以下 Secrets：

1. 前往 GitHub 儲存庫
2. 點擊 `Settings` > `Secrets and variables` > `Actions`
3. 點擊 `New repository secret`
4. 添加以下 Secrets：

| Secret 名稱 | 說明 | 範例 |
|------------|------|------|
| `VPS_HOST` | VPS IP 地址或域名 | `123.456.789.0` |
| `VPS_USERNAME` | SSH 用戶名 | `root` 或 `ubuntu` |
| `VPS_SSH_KEY` | SSH 私鑰 | 完整的私鑰內容 |
| `VPS_PORT` | SSH 端口（選填） | `22`（預設） |
| `VPS_PROJECT_PATH` | 專案路徑（選填） | `/opt/towebp`（預設） |

#### 3.1 生成 SSH 密鑰

如果還沒有 SSH 密鑰，在本機生成：

```bash
# 生成 SSH 密鑰對
ssh-keygen -t ed25519 -C "github-actions" -f ~/.ssh/github_actions

# 查看公鑰（需要添加到 VPS）
cat ~/.ssh/github_actions.pub

# 查看私鑰（需要添加到 GitHub Secrets）
cat ~/.ssh/github_actions
```

#### 3.2 將公鑰添加到 VPS

```bash
# 在 VPS 上執行
echo "你的公鑰內容" >> ~/.ssh/authorized_keys
chmod 600 ~/.ssh/authorized_keys
```

### 4. 觸發部署

部署會在以下情況自動觸發：
- ✅ 推送代碼到 `main` 分支
- ✅ 手動觸發（在 GitHub Actions 頁面）

手動觸發方式：
1. 前往 GitHub 儲存庫
2. 點擊 `Actions` 標籤
3. 選擇 `Deploy to VPS` workflow
4. 點擊 `Run workflow`

### 5. 驗證部署

```bash
# 在 VPS 上檢查容器狀態
sudo docker-compose ps

# 查看日誌
sudo docker-compose logs -f

# 測試服務
curl http://localhost:3001
```

## 🐳 方式二：透過 Docker Hub 部署

### 1. 創建 Docker Hub 帳號

1. 前往 [Docker Hub](https://hub.docker.com/)
2. 註冊帳號
3. 創建儲存庫 `towebp`

### 2. 設定 GitHub Secrets

除了方式一的 Secrets，還需添加：

| Secret 名稱 | 說明 | 範例 |
|------------|------|------|
| `DOCKER_USERNAME` | Docker Hub 用戶名 | `your-username` |
| `DOCKER_PASSWORD` | Docker Hub 密碼或 Token | `dckr_pat_xxxxx` |

**注意**：建議使用 Access Token 而非密碼

生成 Access Token：
1. 登入 Docker Hub
2. 點擊右上角頭像 > `Account Settings`
3. 點擊 `Security` > `New Access Token`
4. 創建 Token 並複製

### 3. 更新 docker-compose.yml

在 VPS 上編輯 `docker-compose.yml`：

```yaml
version: '3'

services:
  towebp:
    container_name: towebp
    # 取消註解並修改為你的 Docker Hub 用戶名
    image: your-dockerhub-username/towebp:latest
    # 註解掉 build 部分
    # build:
    #   context: .
    #   dockerfile: Dockerfile
    restart: always
    ports:
      - "3001:3000"
    environment:
      - NODE_ENV=production
      - NEXT_PUBLIC_BASE_URL=${NEXT_PUBLIC_BASE_URL:-https://towebp.com}
      - NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION=${NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION:-}
```

### 4. 選擇正確的 Workflow

將 `.github/workflows/deploy.yml` 重命名或刪除，使用 `.github/workflows/deploy-with-docker-hub.yml`：

```bash
# 在專案根目錄
git mv .github/workflows/deploy.yml .github/workflows/deploy-direct.yml.bak
git mv .github/workflows/deploy-with-docker-hub.yml .github/workflows/deploy.yml
git add .
git commit -m "chore: switch to Docker Hub deployment"
git push
```

### 5. 觸發部署

推送代碼後，GitHub Actions 會：
1. 建置 Docker 映像
2. 推送到 Docker Hub
3. 在 VPS 上拉取映像
4. 重啟容器

## 🔧 Nginx 反向代理設定

### 1. 安裝 Nginx

```bash
sudo apt update
sudo apt install nginx -y
```

### 2. 創建 Nginx 配置

```bash
sudo vim /etc/nginx/sites-available/towebp
```

添加以下內容：

```nginx
server {
    listen 80;
    server_name your-domain.com www.your-domain.com;

    # 強制 HTTPS（在設定 SSL 後啟用）
    # return 301 https://$server_name$request_uri;

    location / {
        proxy_pass http://localhost:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
        
        # 超時設定
        proxy_connect_timeout 60s;
        proxy_send_timeout 60s;
        proxy_read_timeout 60s;
    }

    # 日誌
    access_log /var/log/nginx/towebp-access.log;
    error_log /var/log/nginx/towebp-error.log;
}
```

### 3. 啟用站點

```bash
# 創建符號連結
sudo ln -s /etc/nginx/sites-available/towebp /etc/nginx/sites-enabled/

# 測試配置
sudo nginx -t

# 重啟 Nginx
sudo systemctl restart nginx
```

## 🔒 SSL 憑證設定

使用 Let's Encrypt 免費 SSL 憑證：

### 1. 安裝 Certbot

```bash
sudo apt install certbot python3-certbot-nginx -y
```

### 2. 獲取憑證

```bash
sudo certbot --nginx -d your-domain.com -d www.your-domain.com
```

### 3. 自動續期

Certbot 會自動設定 cron job，也可以手動測試：

```bash
# 測試續期
sudo certbot renew --dry-run

# 查看定時任務
sudo systemctl status certbot.timer
```

### 4. HTTPS 配置

Certbot 會自動修改 Nginx 配置，添加 SSL 設定。最終配置類似：

```nginx
server {
    listen 80;
    server_name your-domain.com www.your-domain.com;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name your-domain.com www.your-domain.com;

    ssl_certificate /etc/letsencrypt/live/your-domain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/your-domain.com/privkey.pem;
    include /etc/letsencrypt/options-ssl-nginx.conf;
    ssl_dhparam /etc/letsencrypt/ssl-dhparams.pem;

    location / {
        proxy_pass http://localhost:3001;
        # ... 其他配置 ...
    }
}
```

## 🔍 常用命令

### Docker 相關

```bash
# 查看容器狀態
sudo docker-compose ps

# 查看日誌
sudo docker-compose logs -f

# 重啟容器
sudo docker-compose restart

# 停止容器
sudo docker-compose down

# 重新建置並啟動
sudo docker-compose up -d --build

# 進入容器
sudo docker exec -it towebp sh

# 查看資源使用
sudo docker stats towebp
```

### Git 相關

```bash
# 拉取最新代碼
git pull origin main

# 查看當前版本
git log -1

# 回滾到特定版本
git checkout <commit-hash>
```

### 系統相關

```bash
# 查看端口佔用
sudo netstat -tlnp | grep 3001

# 查看磁碟使用
df -h

# 查看記憶體使用
free -h

# 查看系統資源
htop
```

## 🐛 常見問題

### 1. 部署失敗：SSH 連接超時

**原因**：防火牆阻擋或 SSH 配置問題

**解決方案**：

```bash
# 檢查防火牆
sudo ufw status

# 允許 SSH
sudo ufw allow ssh

# 檢查 SSH 服務
sudo systemctl status ssh
```

### 2. 容器無法啟動

**原因**：端口被佔用或環境變數錯誤

**解決方案**：

```bash
# 檢查端口佔用
sudo netstat -tlnp | grep 3001

# 檢查環境變數
cat .env.local

# 查看詳細日誌
sudo docker-compose logs --tail=100
```

### 3. 建置記憶體不足

**原因**：VPS 記憶體不足（< 2GB）

**解決方案**：

選項一：增加 Swap
```bash
# 創建 2GB Swap
sudo fallocate -l 2G /swapfile
sudo chmod 600 /swapfile
sudo mkswap /swapfile
sudo swapon /swapfile

# 永久啟用
echo '/swapfile none swap sw 0 0' | sudo tee -a /etc/fstab
```

選項二：使用 Docker Hub 部署（方式二）

### 4. 無法訪問服務

**原因**：防火牆或 Nginx 配置問題

**解決方案**：

```bash
# 檢查防火牆
sudo ufw status

# 允許端口
sudo ufw allow 3001/tcp
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp

# 測試服務
curl http://localhost:3001

# 檢查 Nginx
sudo nginx -t
sudo systemctl status nginx
```

### 5. SSL 憑證錯誤

**原因**：DNS 未生效或 Certbot 配置錯誤

**解決方案**：

```bash
# 檢查 DNS
nslookup your-domain.com

# 重新獲取憑證
sudo certbot --nginx -d your-domain.com --force-renewal

# 查看憑證狀態
sudo certbot certificates
```

## 📊 監控和維護

### 1. 設定日誌輪轉

```bash
# 創建日誌輪轉配置
sudo vim /etc/logrotate.d/docker-compose
```

添加：

```
/var/lib/docker/containers/*/*.log {
    rotate 7
    daily
    compress
    missingok
    delaycompress
    copytruncate
}
```

### 2. 設定自動備份

```bash
# 創建備份腳本
sudo vim /opt/scripts/backup-towebp.sh
```

```bash
#!/bin/bash
BACKUP_DIR="/opt/backups/towebp"
DATE=$(date +%Y%m%d-%H%M%S)

mkdir -p $BACKUP_DIR

# 備份環境變數
cp /opt/towebp/.env.local $BACKUP_DIR/env-$DATE.backup

# 備份 Git 資訊
cd /opt/towebp && git rev-parse HEAD > $BACKUP_DIR/commit-$DATE.txt

# 刪除 30 天前的備份
find $BACKUP_DIR -name "*.backup" -mtime +30 -delete
```

設定 cron job：

```bash
sudo crontab -e
```

添加：

```cron
# 每天凌晨 3 點備份
0 3 * * * /opt/scripts/backup-towebp.sh
```

### 3. 設定監控告警

使用 UptimeRobot 或其他服務監控網站可用性。

## 🔄 回滾部署

如果新版本有問題，可以快速回滾：

### 方式一：Git 回滾

```bash
cd /opt/towebp

# 查看歷史版本
git log --oneline -10

# 回滾到特定版本
git checkout <commit-hash>

# 重新部署
sudo docker-compose down
sudo docker-compose up -d --build
```

### 方式二：Docker 映像回滾（Docker Hub 部署）

```bash
# 查看可用映像
docker images

# 使用特定版本
docker pull your-username/towebp:<commit-hash>

# 更新 docker-compose.yml 中的映像標籤
# 然後重啟
sudo docker-compose up -d
```

## 📚 相關資源

- [Docker 文件](https://docs.docker.com/)
- [Docker Compose 文件](https://docs.docker.com/compose/)
- [GitHub Actions 文件](https://docs.github.com/en/actions)
- [Nginx 文件](https://nginx.org/en/docs/)
- [Let's Encrypt 文件](https://letsencrypt.org/docs/)

---

**最後更新**：2026-01-26  
**版本**：1.0.0

如有問題，請提交 Issue 或查看項目文檔。
