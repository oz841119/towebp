# ToWebP - 專業圖片轉 WebP 工具

這是一個基於 [Next.js](https://nextjs.org) 開發的多語言圖片轉換工具，可將 PNG 和 JPG 格式的圖片轉換為 WebP 格式。所有轉換均在瀏覽器本地完成，確保隱私安全。

## ✨ 主要特點

- 🔒 **隱私優先**：100% 瀏覽器本地處理，無需上傳至伺服器
- 🚀 **高效轉換**：支援 PNG、JPG 轉 WebP，可減少 30-80% 檔案大小
- 🎨 **可自訂**：調整品質、寬度、高度等參數
- 🌍 **多語言支援**：支援繁中、簡中、英文、日文、法文、德文
- 📱 **響應式設計**：完美支援桌面和移動裝置
- 🔍 **SEO 優化**：完整的結構化資料標記和多語言 SEO

## 🚀 開始使用

### 安裝依賴

```bash
npm install
# 或
yarn install
# 或
pnpm install
```

### 環境變數設定

複製 `.env.local.example` 為 `.env.local` 並設定相關變數：

```bash
cp .env.local.example .env.local
```

必要的環境變數：
- `NEXT_PUBLIC_BASE_URL`：網站的基礎 URL（用於 SEO 和結構化資料）
- `NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION`：Google Search Console 驗證碼（選填）

### 啟動開發伺服器

```bash
npm run dev
# 或
yarn dev
# 或
pnpm dev
```

開啟 [http://localhost:3000](http://localhost:3000) 即可看到結果。

### 建置專案

```bash
npm run build
npm run start
```

## 🔍 SEO 功能

本專案已整合完整的 SEO 優化功能，包括：

### 1. Metadata（元資料）
- 多語言標題、描述、關鍵字
- Open Graph 標籤（Facebook、LinkedIn）
- Twitter Card 標籤
- Canonical URL 和語言替代連結
- Robots 指令

### 2. 結構化資料（JSON-LD）

在 SSR 端渲染以下結構化資料標記：

- **WebApplication**：Web 應用程式資訊
- **SoftwareApplication**：軟體應用程式資訊（含評分）
- **WebSite**：網站資訊（含搜尋功能）
- **Organization**：組織資訊
- **HowTo**：使用教學步驟
- **BreadcrumbList**：麵包屑導航
- **FAQPage**：常見問題
- **TechArticle**：技術文章

### 3. 多語言支援

- 自動生成 `hreflang` 標籤
- 支援 6 種語言：en、zh-TW、zh-CN、ja、fr、de
- 預設語言：zh-TW
- 每種語言都有獨立的 SEO 內容

### 4. 驗證與測試

可使用以下工具驗證結構化資料：

- [Google Rich Results Test](https://search.google.com/test/rich-results)
- [Schema.org Validator](https://validator.schema.org/)
- [Google Search Console](https://search.google.com/search-console)

## 📁 專案結構

```
towebp/
├── src/
│   ├── app/
│   │   └── [lang]/
│   │       ├── layout.tsx      # 包含 Metadata 和全域結構化資料
│   │       └── page.tsx         # 包含頁面級結構化資料
│   ├── components/
│   │   ├── WebPConverter.tsx   # 主要轉換元件
│   │   ├── Dropzone.tsx        # 檔案拖放區域
│   │   ├── Controls.tsx        # 轉換控制項
│   │   └── LanguageSwitcher.tsx # 語言切換器
│   ├── dictionaries/            # 多語言翻譯檔案
│   │   ├── en.json
│   │   ├── zh-TW.json
│   │   ├── zh-CN.json
│   │   ├── ja.json
│   │   ├── fr.json
│   │   └── de.json
│   ├── i18n-config.ts           # i18n 設定
│   └── middleware.ts            # 語言檢測中介軟體
└── .env.local.example           # 環境變數範例
```

## 🛠 技術棧

- **框架**：Next.js 16 (App Router)
- **語言**：TypeScript
- **樣式**：Tailwind CSS 4
- **圖示**：Lucide React
- **檔案處理**：React Dropzone
- **國際化**：@formatjs/intl-localematcher, negotiator

## 📝 授權

本專案採用 MIT 授權。

## 🤝 貢獻

歡迎提交 Issue 和 Pull Request！

## 🚀 部署

本專案支援多種部署方式：

### VPS 自動部署（推薦）

使用 GitHub Actions 自動部署到您的 VPS：

1. **在 VPS 上執行初始化**：
   ```bash
   wget https://raw.githubusercontent.com/your-username/towebp/main/scripts/setup-vps.sh
   sudo bash setup-vps.sh
   ```

2. **在 GitHub 設定 Secrets**：
   - `VPS_HOST` - VPS IP 地址
   - `VPS_USERNAME` - SSH 用戶名
   - `VPS_SSH_KEY` - SSH 私鑰
   - `VPS_PORT` - SSH 端口（選填，預設 22）
   - `VPS_PROJECT_PATH` - 專案路徑（選填，預設 /opt/towebp）

3. **推送代碼自動部署**：
   ```bash
   git push origin main
   ```

詳細說明請參閱 [部署指南](docs/DEPLOYMENT.md)。

### Vercel 部署

最簡單的部署方式是使用 [Vercel Platform](https://vercel.com/new)：

1. 將專案推送至 GitHub
2. 在 Vercel 中匯入專案
3. 設定環境變數
4. 部署

### Docker 部署

使用 Docker Compose 手動部署：

```bash
# 建置並啟動
docker-compose up -d

# 查看狀態
docker-compose ps

# 查看日誌
docker-compose logs -f
```

更多資訊請參閱：
- [部署指南](docs/DEPLOYMENT.md) - VPS 自動部署詳細說明
- [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying)
