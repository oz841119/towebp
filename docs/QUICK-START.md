# 🚀 快速開始指南

10 分鐘內完成 VPS 自動部署設定。

## ⏱️ 預計時間

- **VPS 設定**：5 分鐘
- **GitHub 設定**：3 分鐘
- **測試部署**：2 分鐘

## 📋 前置需求

- ✅ 一台 VPS（建議 Ubuntu 20.04+，至少 1GB RAM）
- ✅ VPS 的 root 或 sudo 訪問權限
- ✅ GitHub 帳號
- ✅ 專案已推送到 GitHub

## 🎯 步驟一：VPS 設定（5 分鐘）

### 1. 連接到 VPS

```bash
ssh root@your-vps-ip
# 或
ssh your-username@your-vps-ip
```

### 2. 執行一鍵安裝腳本

```bash
# 下載安裝腳本
wget https://raw.githubusercontent.com/your-username/towebp/main/scripts/setup-vps.sh

# 賦予執行權限
chmod +x setup-vps.sh

# 執行安裝（需要 root 權限）
sudo bash setup-vps.sh
```

### 3. 按照提示輸入資訊

腳本會詢問：
- **專案目錄路徑**：按 Enter 使用預設 `/opt/towebp`
- **Git 儲存庫 URL**：輸入 `https://github.com/your-username/towebp.git`
- **分支**：按 Enter 使用預設 `main`
- **網站域名**：輸入您的域名，例如 `https://yourdomain.com`
- **Google Verification**（選填）：按 Enter 跳過或輸入驗證碼

### 4. 等待安裝完成

腳本會自動：
- ✅ 安裝 Docker 和 Docker Compose
- ✅ 配置防火牆
- ✅ 克隆專案
- ✅ 建置並啟動容器

看到 `🎉 部署成功！` 表示完成。

### 5. 驗證服務

```bash
# 檢查容器狀態
sudo docker-compose ps

# 測試服務
curl http://localhost:3001
```

您應該看到 HTML 回應。

## 🔑 步驟二：GitHub 設定（3 分鐘）

### 1. 生成 SSH 密鑰

在**本機**執行：

```bash
# 生成密鑰對
ssh-keygen -t ed25519 -C "github-actions" -f ~/.ssh/towebp_deploy

# 不要設定密碼（直接按 Enter）
```

### 2. 添加公鑰到 VPS

```bash
# 查看公鑰
cat ~/.ssh/towebp_deploy.pub

# 複製輸出的內容
```

然後在 VPS 上執行：

```bash
# 添加公鑰（替換為您的公鑰內容）
echo "您的公鑰內容" >> ~/.ssh/authorized_keys

# 設定權限
chmod 600 ~/.ssh/authorized_keys
```

### 3. 測試 SSH 連接

在本機測試：

```bash
ssh -i ~/.ssh/towebp_deploy root@your-vps-ip
# 或
ssh -i ~/.ssh/towebp_deploy your-username@your-vps-ip
```

如果能成功連接，表示設定正確。輸入 `exit` 離開。

### 4. 在 GitHub 設定 Secrets

#### 4.1 前往 Secrets 設定頁面

1. 開啟您的 GitHub 儲存庫
2. 點擊 `Settings` 標籤
3. 左側選單點擊 `Secrets and variables` > `Actions`
4. 點擊 `New repository secret` 按鈕

#### 4.2 添加以下 Secrets

**Secret 1: VPS_HOST**
- Name: `VPS_HOST`
- Value: 您的 VPS IP 地址，例如 `123.456.789.0`

**Secret 2: VPS_USERNAME**
- Name: `VPS_USERNAME`
- Value: SSH 用戶名，通常是 `root` 或 `ubuntu`

**Secret 3: VPS_SSH_KEY**
- Name: `VPS_SSH_KEY`
- Value: SSH 私鑰完整內容

在本機執行以下命令查看私鑰：
```bash
cat ~/.ssh/towebp_deploy
```

複製**完整內容**（包括 `-----BEGIN OPENSSH PRIVATE KEY-----` 和 `-----END OPENSSH PRIVATE KEY-----`）

**Secret 4: VPS_PORT**（選填）
- Name: `VPS_PORT`
- Value: `22`（如果使用預設端口可以不設定）

**Secret 5: VPS_PROJECT_PATH**（選填）
- Name: `VPS_PROJECT_PATH`
- Value: `/opt/towebp`（如果使用預設路徑可以不設定）

#### 4.3 驗證 Secrets

完成後您應該看到 5 個（或 3 個）Secrets：
- ✅ VPS_HOST
- ✅ VPS_USERNAME
- ✅ VPS_SSH_KEY
- VPS_PORT（選填）
- VPS_PROJECT_PATH（選填）

## 🧪 步驟三：測試自動部署（2 分鐘）

### 方式一：手動觸發

1. 前往 GitHub 儲存庫的 `Actions` 標籤
2. 左側選擇 `Deploy to VPS` workflow
3. 點擊 `Run workflow` 按鈕（右側）
4. 確認分支是 `main`
5. 點擊綠色的 `Run workflow` 按鈕

### 方式二：推送代碼觸發

```bash
# 在本機的專案目錄
git add .
git commit -m "test: trigger deployment"
git push origin main
```

### 監控部署進度

1. 前往 `Actions` 標籤
2. 點擊最新的 workflow 執行
3. 展開各個步驟查看日誌

### 驗證部署成功

當所有步驟都顯示綠色勾勾 ✅ 時，部署成功！

在 VPS 上驗證：

```bash
# 檢查容器狀態
sudo docker-compose ps

# 查看日誌
sudo docker-compose logs --tail=50
```

## 🌐 步驟四：設定域名訪問（選填，10 分鐘）

### 1. 設定 DNS

在您的域名服務商（如 Cloudflare、GoDaddy）設定 A 記錄：

```
Type: A
Name: @ 或 www
Value: 您的 VPS IP 地址
TTL: Auto 或 3600
```

等待 DNS 生效（可能需要 5-60 分鐘）。

### 2. 安裝 Nginx

```bash
sudo apt update
sudo apt install nginx -y
```

### 3. 配置 Nginx

```bash
sudo vim /etc/nginx/sites-available/towebp
```

貼上以下內容（替換 `your-domain.com`）：

```nginx
server {
    listen 80;
    server_name your-domain.com www.your-domain.com;

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
    }
}
```

啟用站點：

```bash
# 創建符號連結
sudo ln -s /etc/nginx/sites-available/towebp /etc/nginx/sites-enabled/

# 測試配置
sudo nginx -t

# 重啟 Nginx
sudo systemctl restart nginx
```

### 4. 設定 SSL（使用 Let's Encrypt）

```bash
# 安裝 Certbot
sudo apt install certbot python3-certbot-nginx -y

# 獲取憑證（替換域名）
sudo certbot --nginx -d your-domain.com -d www.your-domain.com

# 按照提示操作：
# 1. 輸入 Email
# 2. 同意條款（輸入 Y）
# 3. 選擇是否重定向到 HTTPS（建議選 2）
```

完成！現在可以通過 HTTPS 訪問您的網站。

### 5. 更新環境變數

在 VPS 上更新 `.env.local`：

```bash
cd /opt/towebp
sudo vim .env.local
```

更新為您的域名：

```
NEXT_PUBLIC_BASE_URL=https://your-domain.com
```

重啟容器：

```bash
sudo docker-compose restart
```

## ✅ 完成！

恭喜！您已經成功設定：

- ✅ VPS 環境
- ✅ Docker 容器
- ✅ GitHub Actions 自動部署
- ✅ 域名和 SSL（選填）

## 📚 下一步

### 基礎設定

1. **提交 Sitemap 到 Google**
   - 前往 [Google Search Console](https://search.google.com/search-console)
   - 添加網站並驗證
   - 提交 sitemap: `https://yourdomain.com/sitemap.xml`

2. **測試 SEO**
   - [Google Rich Results Test](https://search.google.com/test/rich-results)
   - [Schema.org Validator](https://validator.schema.org/)

3. **測試社交分享**
   - [Facebook Debugger](https://developers.facebook.com/tools/debug/)
   - [Twitter Card Validator](https://cards-dev.twitter.com/validator)

### 進階設定

1. **設定監控**
   - 使用 [UptimeRobot](https://uptimerobot.com/) 監控網站可用性
   - 設定 Email 或 Slack 告警

2. **效能優化**
   - 使用 [Cloudflare](https://www.cloudflare.com/) CDN
   - 啟用 Gzip/Brotli 壓縮

3. **備份策略**
   - 設定定期備份環境變數
   - 設定 VPS 快照

## 🔍 疑難排解

### 問題 1：部署後無法訪問

```bash
# 檢查防火牆
sudo ufw status
sudo ufw allow 3001/tcp

# 檢查容器
sudo docker-compose ps
sudo docker-compose logs
```

### 問題 2：GitHub Actions 失敗

1. 檢查 Secrets 是否正確設定
2. 查看 Actions 日誌詳細錯誤
3. 測試 SSH 連接

### 問題 3：SSL 憑證失敗

```bash
# 檢查 DNS 是否生效
nslookup your-domain.com

# 重新獲取憑證
sudo certbot --nginx -d your-domain.com --force-renewal
```

## 📞 取得協助

如遇到問題：

1. 查看 [部署指南](DEPLOYMENT.md) 完整文件
2. 查看 [常見問題](DEPLOYMENT.md#常見問題)
3. 在 GitHub 提交 Issue
4. 查看 Actions 日誌獲取詳細錯誤訊息

## 🎉 成功案例

部署成功後，您的網站將：

- ⚡ 快速載入（Next.js 優化）
- 🔒 安全（HTTPS）
- 🚀 自動部署（推送即部署）
- 🔍 SEO 友好（完整結構化資料）
- 🌍 多語言支援（6 種語言）

---

**製作時間**：10 分鐘  
**難度**：⭐⭐☆☆☆ 簡單

有任何問題歡迎回報！祝部署順利！🎊
