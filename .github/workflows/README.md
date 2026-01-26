# GitHub Actions Workflows

本目錄包含自動化部署的 GitHub Actions workflows。

## 📋 Workflows 說明

### 1. deploy.yml - 直接部署到 VPS

**觸發條件**：
- 推送到 `main` 分支
- 手動觸發

**功能**：
1. 連接到 VPS
2. 拉取最新代碼
3. 使用 Docker Compose 重新建置
4. 啟動容器

**適用場景**：
- 單一 VPS 部署
- VPS 資源充足（建議 >= 2GB RAM）
- 不需要多環境部署

**必要的 GitHub Secrets**：
- `VPS_HOST` - VPS IP 地址或域名
- `VPS_USERNAME` - SSH 用戶名（通常是 root 或 ubuntu）
- `VPS_SSH_KEY` - SSH 私鑰完整內容
- `VPS_PORT` - SSH 端口（選填，預設 22）
- `VPS_PROJECT_PATH` - 專案在 VPS 上的路徑（選填，預設 /opt/towebp）

### 2. deploy-with-docker-hub.yml - 透過 Docker Hub 部署

**觸發條件**：
- 推送到 `main` 分支
- 手動觸發

**功能**：
1. 在 GitHub Actions 中建置 Docker 映像
2. 推送映像到 Docker Hub
3. 連接到 VPS 拉取映像
4. 啟動容器

**適用場景**：
- VPS 資源有限
- 需要部署到多個環境
- 需要映像版本管理

**必要的 GitHub Secrets**：
所有 deploy.yml 的 Secrets，加上：
- `DOCKER_USERNAME` - Docker Hub 用戶名
- `DOCKER_PASSWORD` - Docker Hub 密碼或 Access Token

## 🔧 使用方式

### 選擇合適的 Workflow

**如果您是新手或只有單一 VPS**：
使用 `deploy.yml`（預設）

**如果您需要更高效的部署**：
1. 重命名或刪除 `deploy.yml`
2. 將 `deploy-with-docker-hub.yml` 重命名為 `deploy.yml`
3. 設定 Docker Hub 相關的 Secrets

### 設定 SSH 密鑰

#### 1. 生成 SSH 密鑰對

在本機執行：

```bash
ssh-keygen -t ed25519 -C "github-actions-towebp" -f ~/.ssh/towebp_deploy
```

#### 2. 添加公鑰到 VPS

```bash
# 查看公鑰
cat ~/.ssh/towebp_deploy.pub

# 在 VPS 上添加（替換為實際的公鑰內容）
echo "ssh-ed25519 AAAA...your-public-key... github-actions-towebp" >> ~/.ssh/authorized_keys
chmod 600 ~/.ssh/authorized_keys
```

#### 3. 添加私鑰到 GitHub Secrets

```bash
# 查看私鑰（完整內容）
cat ~/.ssh/towebp_deploy
```

將完整的私鑰內容（包括 `-----BEGIN OPENSSH PRIVATE KEY-----` 和 `-----END OPENSSH PRIVATE KEY-----`）複製到 GitHub Secrets 的 `VPS_SSH_KEY`。

### 設定 GitHub Secrets

1. 前往 GitHub 儲存庫
2. 點擊 `Settings` > `Secrets and variables` > `Actions`
3. 點擊 `New repository secret`
4. 添加必要的 Secrets（見上方說明）

### 手動觸發部署

1. 前往 GitHub 儲存庫的 `Actions` 標籤
2. 選擇要執行的 workflow
3. 點擊 `Run workflow` 按鈕
4. 確認分支（預設 main）
5. 點擊綠色的 `Run workflow` 按鈕

## 🔍 故障排除

### SSH 連接失敗

**錯誤訊息**：`Permission denied (publickey)`

**可能原因**：
1. SSH 私鑰格式錯誤
2. VPS 上未添加公鑰
3. SSH 端口錯誤

**解決方案**：

```bash
# 在 VPS 上檢查 authorized_keys
cat ~/.ssh/authorized_keys

# 檢查權限
chmod 700 ~/.ssh
chmod 600 ~/.ssh/authorized_keys

# 測試 SSH 連接（在本機）
ssh -i ~/.ssh/towebp_deploy -p 22 username@vps-ip
```

### Docker 建置失敗

**錯誤訊息**：`Cannot allocate memory` 或 `Killed`

**可能原因**：VPS 記憶體不足

**解決方案**：

選項一：添加 Swap（臨時方案）
```bash
# 在 VPS 上執行
sudo fallocate -l 2G /swapfile
sudo chmod 600 /swapfile
sudo mkswap /swapfile
sudo swapon /swapfile
echo '/swapfile none swap sw 0 0' | sudo tee -a /etc/fstab
```

選項二：使用 Docker Hub 部署（推薦）
切換到 `deploy-with-docker-hub.yml`，在 GitHub Actions 中建置。

### 容器無法啟動

**檢查步驟**：

```bash
# 在 VPS 上執行

# 1. 查看容器狀態
docker-compose ps

# 2. 查看詳細日誌
docker-compose logs --tail=100

# 3. 檢查環境變數
cat .env.local

# 4. 測試端口
netstat -tlnp | grep 3001
```

### 部署成功但無法訪問

**可能原因**：
1. 防火牆阻擋
2. Nginx 配置錯誤
3. 端口映射錯誤

**解決方案**：

```bash
# 檢查防火牆
sudo ufw status
sudo ufw allow 3001/tcp
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp

# 測試本地訪問
curl http://localhost:3001

# 檢查 Nginx（如果使用）
sudo nginx -t
sudo systemctl status nginx
```

## 📚 相關文件

- [部署指南](../../docs/DEPLOYMENT.md) - 完整的部署說明
- [SEO 指南](../../docs/SEO-GUIDE.md) - SEO 優化說明
- [README](../../README.md) - 專案概述

## 🔒 安全性最佳實踐

1. **使用 SSH 密鑰而非密碼**
2. **限制 SSH 訪問 IP**（如果可能）
3. **使用 Docker Hub Access Token 而非密碼**
4. **定期更新 Secrets**
5. **啟用 VPS 防火牆**
6. **使用 HTTPS（Let's Encrypt）**

## 📊 監控部署

### 查看 GitHub Actions 日誌

1. 前往 `Actions` 標籤
2. 點擊最近的 workflow 執行
3. 查看各個步驟的輸出

### 查看 VPS 日誌

```bash
# 即時日誌
sudo docker-compose logs -f

# 最近 100 行
sudo docker-compose logs --tail=100

# 特定時間範圍
sudo docker-compose logs --since 1h
```

## 🎯 進階配置

### 多環境部署

如果需要部署到多個環境（開發、測試、生產），可以：

1. 複製 workflow 檔案
2. 修改觸發分支
3. 使用不同的 Secrets（如 `PROD_VPS_HOST`, `DEV_VPS_HOST`）

### 添加部署通知

可以添加 Slack、Discord 或 Email 通知：

```yaml
- name: 發送通知
  if: always()
  uses: 8398a7/action-slack@v3
  with:
    status: ${{ job.status }}
    webhook_url: ${{ secrets.SLACK_WEBHOOK }}
```

### 自動化測試

在部署前運行測試：

```yaml
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Run tests
        run: npm test
  
  deploy:
    needs: test
    # ... 部署步驟
```

---

**最後更新**：2026-01-26  
**版本**：1.0.0
