# 🚀 VPS 自動部署摘要

您的專案現在已經配置了完整的 VPS 自動部署功能！

## ✅ 已完成的配置

### 1. GitHub Actions Workflows

創建了兩個自動部署 workflows：

#### 📄 `.github/workflows/deploy.yml`
**直接部署到 VPS**（預設方式）
- 連接 VPS 並拉取代碼
- 使用 Docker Compose 重新建置
- 自動啟動容器
- 適合單一 VPS 和 VPS 資源充足的情況

#### 📄 `.github/workflows/deploy-with-docker-hub.yml`
**透過 Docker Hub 部署**（進階方式）
- 在 GitHub Actions 建置映像
- 推送到 Docker Hub
- VPS 拉取映像並啟動
- 適合 VPS 資源有限和多環境部署

### 2. VPS 部署腳本

#### 📄 `scripts/setup-vps.sh`
**VPS 初始化腳本**
- 一鍵安裝 Docker 和 Docker Compose
- 配置防火牆和安全設定
- 克隆專案並建置容器
- 設定環境變數

#### 📄 `scripts/deploy-vps.sh`
**手動部署腳本**
- 拉取最新代碼
- 備份當前版本
- 重新建置並啟動
- 健康檢查和日誌輸出

### 3. Docker 配置更新

#### 📄 `docker-compose.yml`
- 添加環境變數支援
- 添加健康檢查
- 支持從環境變數讀取配置

### 4. 文件

#### 📄 `docs/DEPLOYMENT.md`
完整的部署指南（50+ 頁），包含：
- 兩種部署方式的詳細說明
- VPS 初始化步驟
- GitHub Secrets 設定
- Nginx 反向代理配置
- SSL 憑證設定（Let's Encrypt）
- 常見問題排解
- 監控和維護指南

#### 📄 `docs/QUICK-START.md`
10 分鐘快速開始指南：
- 最簡化的設定步驟
- 清晰的時間預估
- 一步一步的指引

#### 📄 `.github/workflows/README.md`
Workflows 說明文件：
- 兩種 workflow 的比較
- SSH 密鑰設定指南
- 故障排除步驟

## 🎯 下一步操作

### 立即行動（必要）

1. **在 VPS 上執行初始化**
   ```bash
   wget https://raw.githubusercontent.com/YOUR-USERNAME/towebp/main/scripts/setup-vps.sh
   sudo bash setup-vps.sh
   ```

2. **設定 GitHub Secrets**
   
   前往: `Settings` > `Secrets and variables` > `Actions`
   
   必要的 Secrets：
   - `VPS_HOST` - VPS IP 地址
   - `VPS_USERNAME` - SSH 用戶名（root 或 ubuntu）
   - `VPS_SSH_KEY` - SSH 私鑰完整內容
   
   選填的 Secrets：
   - `VPS_PORT` - SSH 端口（預設 22）
   - `VPS_PROJECT_PATH` - 專案路徑（預設 /opt/towebp）

3. **測試部署**
   ```bash
   git add .
   git commit -m "feat: add VPS auto-deployment"
   git push origin main
   ```

### 後續設定（建議）

4. **設定域名和 SSL**
   - 配置 DNS A 記錄
   - 安裝 Nginx
   - 使用 Let's Encrypt 獲取 SSL 憑證

5. **SEO 設定**
   - 在 Google Search Console 提交 sitemap
   - 驗證結構化資料
   - 測試社交媒體分享

6. **監控設定**
   - 設定 uptime 監控
   - 配置告警通知

## 📖 快速參考

### 常用文件連結

| 文件 | 用途 | 何時閱讀 |
|------|------|----------|
| [QUICK-START.md](QUICK-START.md) | 10 分鐘快速設定 | 開始之前 |
| [DEPLOYMENT.md](DEPLOYMENT.md) | 完整部署指南 | 詳細設定 |
| [workflows/README.md](../.github/workflows/README.md) | Workflows 說明 | 設定 Actions |

### 常用命令

#### 在 VPS 上

```bash
# 查看容器狀態
sudo docker-compose ps

# 查看日誌
sudo docker-compose logs -f

# 重啟容器
sudo docker-compose restart

# 手動部署
cd /opt/towebp && sudo bash scripts/deploy-vps.sh
```

#### 在本機

```bash
# 推送並觸發部署
git push origin main

# 測試 SSH 連接
ssh -i ~/.ssh/towebp_deploy root@your-vps-ip

# 生成 SSH 密鑰
ssh-keygen -t ed25519 -C "github-actions" -f ~/.ssh/towebp_deploy
```

#### GitHub Actions

- 查看部署狀態：`Actions` 標籤
- 手動觸發：`Actions` > `Deploy to VPS` > `Run workflow`

## 🔧 兩種部署方式對比

| 特性 | 直接部署 | Docker Hub 部署 |
|------|----------|-----------------|
| **設定難度** | ⭐⭐☆☆☆ 簡單 | ⭐⭐⭐☆☆ 中等 |
| **VPS 資源消耗** | 高（建置時） | 低（只下載） |
| **部署速度** | 較慢（5-10分鐘） | 快（2-3分鐘） |
| **需要額外帳號** | ❌ 不需要 | ✅ 需要 Docker Hub |
| **多環境部署** | ❌ 較困難 | ✅ 簡單 |
| **版本管理** | ⚠️ 基本 | ✅ 完整 |
| **推薦使用情境** | 單一 VPS，資源充足 | VPS 資源有限，多環境 |

## ⚠️ 重要提醒

### 安全性

1. ✅ **不要**將 SSH 私鑰提交到代碼庫
2. ✅ **務必**在 VPS 上設定防火牆
3. ✅ **建議**使用 SSH 密鑰而非密碼
4. ✅ **建議**定期更新系統和 Docker

### 權限

1. 腳本檔案在 Windows 上無法設定執行權限
2. 克隆到 Linux 後需手動執行：
   ```bash
   chmod +x scripts/*.sh
   ```
3. 或在首次使用時加上 `bash` 命令：
   ```bash
   bash scripts/setup-vps.sh
   ```

### 環境變數

1. ⚠️ **必須**設定 `NEXT_PUBLIC_BASE_URL` 為實際域名
2. 📝 在 VPS 上編輯 `.env.local` 檔案
3. 🔄 修改後需重啟容器：`docker-compose restart`

## 🎓 學習資源

### 推薦閱讀順序

1. 📘 **新手**：先閱讀 [QUICK-START.md](QUICK-START.md)
2. 📗 **進階**：再閱讀 [DEPLOYMENT.md](DEPLOYMENT.md)
3. 📙 **專業**：最後閱讀 [workflows/README.md](../.github/workflows/README.md)

### 外部資源

- [Docker 官方文檔](https://docs.docker.com/)
- [GitHub Actions 文檔](https://docs.github.com/en/actions)
- [Let's Encrypt 指南](https://letsencrypt.org/getting-started/)
- [Nginx 配置指南](https://nginx.org/en/docs/)

## 📊 部署檢查清單

使用此清單確保所有設定正確：

### VPS 設定 ✓

- [ ] Docker 已安裝
- [ ] Docker Compose 已安裝
- [ ] 防火牆已配置（開放 22, 80, 443, 3001）
- [ ] 專案已克隆到 `/opt/towebp`
- [ ] `.env.local` 已設定
- [ ] 容器正常運行（`docker-compose ps`）
- [ ] 服務可訪問（`curl http://localhost:3001`）

### GitHub 設定 ✓

- [ ] SSH 密鑰已生成
- [ ] 公鑰已添加到 VPS
- [ ] SSH 連接測試成功
- [ ] `VPS_HOST` Secret 已設定
- [ ] `VPS_USERNAME` Secret 已設定
- [ ] `VPS_SSH_KEY` Secret 已設定
- [ ] Workflow 手動觸發測試成功
- [ ] 推送代碼自動部署測試成功

### 域名和 SSL ✓（選填）

- [ ] DNS A 記錄已設定
- [ ] DNS 已生效（`nslookup your-domain.com`）
- [ ] Nginx 已安裝
- [ ] Nginx 配置已創建
- [ ] SSL 憑證已獲取
- [ ] HTTPS 訪問正常
- [ ] HTTP 自動重定向到 HTTPS

### SEO 和監控 ✓（選填）

- [ ] Google Search Console 已驗證
- [ ] Sitemap 已提交
- [ ] 結構化資料驗證通過
- [ ] 社交媒體分享測試通過
- [ ] Uptime 監控已設定
- [ ] 告警通知已設定

## 🎉 完成！

現在您的專案具備：

- ✅ 完整的 SEO 優化（8 種結構化資料類型）
- ✅ 6 種語言支援
- ✅ 自動化 VPS 部署
- ✅ Docker 容器化
- ✅ 健康檢查和日誌
- ✅ 完整的文檔

## 📞 需要協助？

遇到問題時的處理順序：

1. 📖 查看 [DEPLOYMENT.md](DEPLOYMENT.md) 的「常見問題」章節
2. 📋 檢查 GitHub Actions 日誌
3. 🔍 在 VPS 上查看容器日誌：`docker-compose logs`
4. 💬 在 GitHub 提交 Issue
5. 🌐 搜尋相關錯誤訊息

---

**創建日期**：2026-01-26  
**版本**：1.0.0  
**狀態**：✅ 完成

祝部署順利！如有任何問題歡迎回報。🚀
