# SEO 檢查清單

在部署前使用此檢查清單確保所有 SEO 優化都已正確實作。

## 📋 部署前檢查清單

### 1. 環境變數設定 ⚙️

- [ ] 設定 `NEXT_PUBLIC_BASE_URL` 為正確的網域名稱
- [ ] 設定 `NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION`（如有）
- [ ] 驗證環境變數在生產環境正確載入

### 2. 基本 Metadata 🏷️

- [ ] 每個語言版本都有獨特的 `title`
- [ ] 每個語言版本都有獨特的 `description`（150-160 字元）
- [ ] `keywords` 包含相關關鍵字
- [ ] 標題不超過 60 字元
- [ ] 描述包含主要關鍵字

### 3. Open Graph 標籤 📱

- [ ] 設定 `og:title`
- [ ] 設定 `og:description`
- [ ] 設定 `og:image`（1200x630px）
- [ ] 設定 `og:url`
- [ ] 設定 `og:type`
- [ ] 設定 `og:locale`
- [ ] 圖片檔案存在且可訪問
- [ ] 在 Facebook Debugger 測試

### 4. Twitter Card 🐦

- [ ] 設定 `twitter:card`
- [ ] 設定 `twitter:title`
- [ ] 設定 `twitter:description`
- [ ] 設定 `twitter:image`
- [ ] 在 Twitter Card Validator 測試

### 5. 結構化資料 (JSON-LD) 🏗️

#### WebApplication

- [ ] `name` 正確設定
- [ ] `url` 使用正確的 URL
- [ ] `description` 清楚描述應用程式
- [ ] `applicationCategory` 正確
- [ ] `offers` 價格正確（免費 = "0"）
- [ ] `inLanguage` 設定正確

#### SoftwareApplication

- [ ] `name` 正確設定
- [ ] `applicationCategory` 正確
- [ ] `aggregateRating` 基於真實數據
- [ ] 評分值在 1-5 之間
- [ ] 評分數量真實

#### Organization

- [ ] `name` 正確
- [ ] `url` 正確
- [ ] `logo` 存在且可訪問
- [ ] `sameAs` 包含社交媒體連結（如有）

#### HowTo

- [ ] `name` 清楚描述教學內容
- [ ] 所有 `step` 都有 `name` 和 `text`
- [ ] `position` 正確排序
- [ ] 步驟符合實際使用流程

#### FAQPage

- [ ] 問題和答案成對出現
- [ ] 答案完整且有幫助
- [ ] 至少 3 個問答對
- [ ] 問題是用戶常見的問題

#### BreadcrumbList

- [ ] 位置從 1 開始
- [ ] 每個項目都有 `name` 和 `item`
- [ ] URL 正確且可訪問

#### TechArticle

- [ ] `headline` 正確
- [ ] `description` 準確
- [ ] `author` 和 `publisher` 設定
- [ ] `inLanguage` 正確

### 6. 多語言設定 🌍

- [ ] `hreflang` 標籤包含所有語言
- [ ] `x-default` 設定為預設語言
- [ ] Canonical URL 指向正確頁面
- [ ] 每種語言都有獨立的翻譯內容
- [ ] 語言切換功能正常運作
- [ ] URL 結構一致（如 `/en`, `/zh-TW`）

### 7. Sitemap.xml 🗺️

- [ ] Sitemap 可訪問（`/sitemap.xml`）
- [ ] 包含所有語言版本
- [ ] 每個 URL 都有 `lastModified`
- [ ] 優先級（priority）正確設定
- [ ] changeFrequency 合理
- [ ] 提交到 Google Search Console

### 8. Robots.txt 🤖

- [ ] Robots.txt 可訪問（`/robots.txt`）
- [ ] Allow 規則正確
- [ ] Disallow 規則合理
- [ ] Sitemap URL 正確
- [ ] 不要阻擋重要頁面

### 9. 技術 SEO ⚙️

- [ ] 網站使用 HTTPS
- [ ] 所有圖片都有 alt 文字
- [ ] 頁面載入速度 < 3 秒
- [ ] 移動裝置友好
- [ ] 沒有 404 錯誤
- [ ] 沒有重複內容
- [ ] URL 結構清晰
- [ ] 使用語義化 HTML 標籤

### 10. Core Web Vitals 📊

- [ ] LCP (Largest Contentful Paint) < 2.5s
- [ ] FID (First Input Delay) < 100ms
- [ ] CLS (Cumulative Layout Shift) < 0.1
- [ ] 在 PageSpeed Insights 測試
- [ ] 在 Google Search Console 檢查

### 11. 內容品質 📝

- [ ] H1 標籤只有一個且包含主關鍵字
- [ ] H2-H6 標籤層級正確
- [ ] 內容原創且有價值
- [ ] 段落長度適中
- [ ] 包含相關關鍵字但不過度
- [ ] 內部連結合理
- [ ] 外部連結使用 `rel="noopener"`

### 12. 圖片優化 🖼️

- [ ] 所有圖片都有 alt 屬性
- [ ] 圖片檔案大小優化（WebP 格式）
- [ ] 使用適當的圖片尺寸
- [ ] 重要圖片不使用 lazy loading
- [ ] OG 圖片存在且尺寸正確

### 13. 測試與驗證 ✅

#### Google Tools

- [ ] Google Rich Results Test 通過
- [ ] Google Search Console 已設定
- [ ] Google Analytics 已設定（選用）
- [ ] Sitemap 已提交
- [ ] 索引覆蓋率無錯誤

#### Schema Validation

- [ ] Schema.org Validator 驗證通過
- [ ] 沒有必要欄位缺失
- [ ] 沒有格式錯誤
- [ ] JSON-LD 語法正確

#### Social Media

- [ ] Facebook Sharing Debugger 測試通過
- [ ] Twitter Card Validator 測試通過
- [ ] LinkedIn Post Inspector 測試通過
- [ ] 分享預覽正確顯示

#### 多語言

- [ ] Hreflang Tags Testing Tool 驗證
- [ ] 所有語言版本可訪問
- [ ] 語言檢測正確
- [ ] 語言切換功能正常

### 14. 安全與隱私 🔒

- [ ] HTTPS 憑證有效
- [ ] 沒有混合內容警告
- [ ] 隱私政策頁面（如需要）
- [ ] Cookie 同意（如需要）
- [ ] 符合 GDPR/CCPA（如適用）

### 15. 監控設定 📈

- [ ] Google Search Console 已驗證
- [ ] Google Analytics 設定（選用）
- [ ] 設定錯誤監控
- [ ] 設定 uptime 監控
- [ ] 設定性能監控

## 🚀 部署後檢查

### 立即檢查（部署後 1 小時內）

- [ ] 網站可正常訪問
- [ ] 所有頁面正常載入
- [ ] 沒有 JavaScript 錯誤
- [ ] Sitemap.xml 可訪問
- [ ] Robots.txt 可訪問
- [ ] 結構化資料正確渲染
- [ ] 多語言切換正常

### 第一週

- [ ] 在 Google Search Console 提交 sitemap
- [ ] 請求 Google 索引主要頁面
- [ ] 檢查 Google Search Console 覆蓋率報告
- [ ] 修復任何索引問題
- [ ] 在社交媒體測試分享

### 第一個月

- [ ] 檢查搜尋排名
- [ ] 查看 Google Search Console 表現
- [ ] 分析用戶行為（Analytics）
- [ ] 檢查富資訊片段顯示情況
- [ ] 根據數據優化內容

## 📊 常用測試工具

### Google 工具
- [Google Rich Results Test](https://search.google.com/test/rich-results)
- [Google Search Console](https://search.google.com/search-console)
- [PageSpeed Insights](https://pagespeed.web.dev/)
- [Mobile-Friendly Test](https://search.google.com/test/mobile-friendly)

### Schema 驗證
- [Schema.org Validator](https://validator.schema.org/)
- [JSON-LD Playground](https://json-ld.org/playground/)

### 社交媒體
- [Facebook Sharing Debugger](https://developers.facebook.com/tools/debug/)
- [Twitter Card Validator](https://cards-dev.twitter.com/validator)
- [LinkedIn Post Inspector](https://www.linkedin.com/post-inspector/)

### 多語言
- [Hreflang Tags Testing Tool](https://www.aleydasolis.com/english/international-seo-tools/hreflang-tags-generator/)

### 性能
- [WebPageTest](https://www.webpagetest.org/)
- [GTmetrix](https://gtmetrix.com/)
- [Lighthouse CI](https://github.com/GoogleChrome/lighthouse-ci)

### SEO 分析
- [Ahrefs Site Audit](https://ahrefs.com/)
- [Screaming Frog SEO Spider](https://www.screamingfrog.co.uk/seo-spider/)
- [SEMrush](https://www.semrush.com/)

## 🔄 定期維護（每月）

- [ ] 檢查 Google Search Console 報告
- [ ] 更新內容（如日期、統計數據）
- [ ] 檢查並修復 404 錯誤
- [ ] 更新 sitemap lastModified
- [ ] 驗證結構化資料仍正常
- [ ] 檢查頁面載入速度
- [ ] 審查和更新關鍵字
- [ ] 分析競爭對手

## 📝 記錄

### 部署資訊

- **部署日期**：_____________
- **網域名稱**：_____________
- **部署平台**：_____________
- **部署者**：_____________

### Google 驗證

- **Search Console 驗證碼**：_____________
- **Analytics ID**：_____________
- **Tag Manager ID**：_____________（選用）

### 首次索引

- **Sitemap 提交日期**：_____________
- **首次被索引日期**：_____________
- **首次出現在搜尋結果**：_____________

### 問題追蹤

| 日期 | 問題描述 | 狀態 | 解決日期 |
|------|----------|------|----------|
|      |          |      |          |
|      |          |      |          |

## 🎯 優先級指南

### 🔴 高優先級（必須完成）

- 基本 Metadata
- Open Graph 標籤
- 結構化資料（至少 WebApplication）
- Sitemap.xml
- Robots.txt
- HTTPS
- 移動裝置友好

### 🟡 中優先級（應該完成）

- Twitter Card
- 所有建議的結構化資料類型
- 多語言 hreflang 標籤
- Google Search Console 設定
- 圖片優化
- Core Web Vitals 優化

### 🟢 低優先級（可以之後完成）

- Google Analytics
- 社交媒體整合
- 進階監控
- A/B 測試
- 內容行銷

---

**最後更新**：2026-01-26  
**版本**：1.0.0

**注意**：此檢查清單應該根據專案需求定期更新和調整。
