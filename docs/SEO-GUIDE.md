# SEO 優化指南

本文件說明專案中實作的 SEO 優化功能及其使用方式。

## 📋 目錄

- [結構化資料](#結構化資料)
- [Metadata 設定](#metadata-設定)
- [多語言 SEO](#多語言-seo)
- [Sitemap 和 Robots.txt](#sitemap-和-robotstxt)
- [驗證與測試](#驗證與測試)
- [最佳實踐](#最佳實踐)

## 🏗 結構化資料

### 已實作的 Schema.org 類型

#### 1. WebApplication（Web 應用程式）

位置：`src/app/[lang]/layout.tsx`

```typescript
{
  '@type': 'WebApplication',
  'name': 'ToWebP - Image to WebP Converter',
  'url': '網站 URL',
  'description': '應用程式描述',
  'applicationCategory': 'Multimedia',
  'operatingSystem': 'Web Browser',
  'offers': { // 免費提供
    '@type': 'Offer',
    'price': '0',
    'priceCurrency': 'USD',
  }
}
```

**用途**：告訴搜尋引擎這是一個 Web 應用程式，可能會在搜尋結果中顯示應用程式資訊。

#### 2. SoftwareApplication（軟體應用程式）

位置：`src/app/[lang]/layout.tsx`

```typescript
{
  '@type': 'SoftwareApplication',
  'name': 'ToWebP',
  'applicationCategory': 'DesignApplication',
  'aggregateRating': {
    '@type': 'AggregateRating',
    'ratingValue': '4.8',
    'ratingCount': '1250',
  }
}
```

**用途**：提供評分資訊，可能在搜尋結果中顯示星級評分。

**注意**：評分應該是真實的用戶評分，需要定期更新。

#### 3. HowTo（教學步驟）

位置：`src/app/[lang]/layout.tsx`

```typescript
{
  '@type': 'HowTo',
  'name': '如何使用 WebP 轉換器',
  'step': [
    {
      '@type': 'HowToStep',
      'name': '上傳圖片',
      'text': '拖放檔案至此',
      'position': 1,
    },
    // ... 更多步驟
  ]
}
```

**用途**：在搜尋結果中可能顯示步驟式教學，提高點擊率。

#### 4. FAQPage（常見問題）

位置：`src/app/[lang]/page.tsx`

```typescript
{
  '@type': 'FAQPage',
  'mainEntity': [
    {
      '@type': 'Question',
      'name': '問題',
      'acceptedAnswer': {
        '@type': 'Answer',
        'text': '答案',
      }
    }
  ]
}
```

**用途**：在搜尋結果中可能顯示 FAQ 富資訊片段（Rich Snippets）。

#### 5. BreadcrumbList（麵包屑導航）

位置：`src/app/[lang]/page.tsx`

```typescript
{
  '@type': 'BreadcrumbList',
  'itemListElement': [
    {
      '@type': 'ListItem',
      'position': 1,
      'name': 'Home',
      'item': '首頁 URL'
    }
  ]
}
```

**用途**：在搜尋結果中顯示導航路徑。

#### 6. Organization（組織）

位置：`src/app/[lang]/layout.tsx`

```typescript
{
  '@type': 'Organization',
  'name': 'ToWebP',
  'url': '網站 URL',
  'logo': {
    '@type': 'ImageObject',
    'url': 'Logo URL'
  },
  'sameAs': [] // 社交媒體連結
}
```

**用途**：提供組織資訊，建立品牌實體。

## 📝 Metadata 設定

### 基本 Metadata

位置：`src/app/[lang]/layout.tsx` 的 `generateMetadata` 函數

```typescript
{
  title: '頁面標題',
  description: '頁面描述',
  keywords: '關鍵字',
  authors: [{ name: '作者' }],
  creator: '創建者',
  publisher: '發布者',
}
```

### Open Graph（社交媒體分享）

```typescript
openGraph: {
  title: 'OG 標題',
  description: 'OG 描述',
  url: '頁面 URL',
  siteName: '網站名稱',
  locale: '語言代碼',
  type: 'website',
  images: [{
    url: '圖片 URL',
    width: 1200,
    height: 630,
    alt: '圖片描述',
  }],
}
```

**最佳實踐**：
- 圖片尺寸：1200x630px（Facebook、LinkedIn）
- 檔案大小：小於 5MB
- 格式：JPG 或 PNG

### Twitter Card

```typescript
twitter: {
  card: 'summary_large_image',
  title: 'Twitter 標題',
  description: 'Twitter 描述',
  images: ['圖片 URL'],
}
```

## 🌍 多語言 SEO

### Hreflang 標籤

位置：`src/app/[lang]/layout.tsx`

```html
<link rel="alternate" hrefLang="en" href="https://example.com/en" />
<link rel="alternate" hrefLang="zh-TW" href="https://example.com/zh-TW" />
<link rel="alternate" hrefLang="x-default" href="https://example.com/zh-TW" />
```

**用途**：告訴搜尋引擎不同語言版本的頁面，避免重複內容問題。

### Canonical URL

```typescript
alternates: {
  canonical: `${baseUrl}/${lang}`,
  languages: {
    'en': `${baseUrl}/en`,
    'zh-TW': `${baseUrl}/zh-TW`,
    // ...
  },
}
```

**用途**：指定首選版本，避免重複內容懲罰。

### 語言特定的內容

每種語言都有獨立的翻譯檔案：

- `src/dictionaries/en.json`
- `src/dictionaries/zh-TW.json`
- 等等...

包含：
- `meta.title`：頁面標題
- `meta.description`：頁面描述
- `meta.keywords`：關鍵字
- `meta.ogTitle`：OG 標題
- `meta.ogDescription`：OG 描述

## 🗺 Sitemap 和 Robots.txt

### Sitemap.xml

位置：`src/app/sitemap.ts`

自動生成包含所有語言版本的 sitemap：

```xml
<url>
  <loc>https://example.com/zh-TW</loc>
  <lastmod>2026-01-26</lastmod>
  <changefreq>weekly</changefreq>
  <priority>1.0</priority>
  <xhtml:link rel="alternate" hreflang="en" href="https://example.com/en"/>
  <xhtml:link rel="alternate" hreflang="zh-TW" href="https://example.com/zh-TW"/>
</url>
```

**訪問方式**：`https://yourdomain.com/sitemap.xml`

### Robots.txt

位置：`src/app/robots.ts`

```
User-agent: *
Allow: /
Disallow: /api/
Disallow: /admin/

Sitemap: https://yourdomain.com/sitemap.xml
```

**訪問方式**：`https://yourdomain.com/robots.txt`

## ✅ 驗證與測試

### 1. Google Rich Results Test

URL: https://search.google.com/test/rich-results

- 貼上頁面 URL 或程式碼
- 檢查結構化資料是否正確
- 查看預覽效果

### 2. Schema.org Validator

URL: https://validator.schema.org/

- 驗證 JSON-LD 格式
- 檢查 Schema.org 規範

### 3. Google Search Console

URL: https://search.google.com/search-console

步驟：
1. 添加網站
2. 驗證所有權
3. 提交 Sitemap
4. 檢查覆蓋率報告
5. 查看增強型結果

### 4. 測試多語言實作

使用以下工具：
- [Hreflang Tags Testing Tool](https://www.aleydasolis.com/english/international-seo-tools/hreflang-tags-generator/)
- Google Search Console 的國際目標功能

### 5. Open Graph 測試

- [Facebook Sharing Debugger](https://developers.facebook.com/tools/debug/)
- [Twitter Card Validator](https://cards-dev.twitter.com/validator)
- [LinkedIn Post Inspector](https://www.linkedin.com/post-inspector/)

## 🎯 最佳實踐

### 1. 內容品質

- ✅ 提供獨特、有價值的內容
- ✅ 使用清晰的標題層級（H1、H2、H3）
- ✅ 優化圖片 alt 文字
- ✅ 確保內容可讀性

### 2. 技術 SEO

- ✅ 使用 HTTPS
- ✅ 優化頁面載入速度
- ✅ 確保移動裝置友好
- ✅ 修復 404 錯誤
- ✅ 實作結構化資料

### 3. 結構化資料最佳實踐

- ✅ 只使用適合內容的 Schema 類型
- ✅ 提供完整且準確的資訊
- ✅ 定期更新資料（如評分、日期）
- ✅ 在 SSR 中渲染（不要在客戶端生成）
- ✅ 驗證 JSON-LD 語法

### 4. 多語言 SEO 最佳實踐

- ✅ 每種語言使用獨立的 URL
- ✅ 實作 hreflang 標籤
- ✅ 不要自動重定向基於 IP 位置
- ✅ 提供語言切換選項
- ✅ 翻譯 metadata 和結構化資料

### 5. 避免的錯誤

- ❌ 不要使用虛假的評分或評論
- ❌ 不要隱藏文字或連結
- ❌ 不要過度使用關鍵字
- ❌ 不要複製其他網站的內容
- ❌ 不要在 display:none 的元素中放結構化資料

## 📊 監控與分析

### Google Analytics 4

在 `src/app/[lang]/layout.tsx` 中添加：

```typescript
<Script src="https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID" />
<Script id="google-analytics">
  {`
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    gtag('js', new Date());
    gtag('config', 'GA_MEASUREMENT_ID');
  `}
</Script>
```

### Google Search Console

監控：
- 搜尋表現（點擊、曝光、CTR）
- 覆蓋率（索引狀態）
- 增強型結果（結構化資料）
- 行動裝置可用性
- 核心網頁指標

## 🔄 維護

### 定期檢查（每月）

- [ ] 驗證結構化資料仍正常運作
- [ ] 更新 sitemap
- [ ] 檢查 404 錯誤
- [ ] 審查 Google Search Console 報告
- [ ] 更新內容（如評分、日期）

### 內容更新時

- [ ] 更新 lastModified 日期
- [ ] 檢查相關的結構化資料
- [ ] 更新 metadata
- [ ] 驗證更改

## 📚 參考資源

- [Schema.org 文件](https://schema.org/)
- [Google Search Central](https://developers.google.com/search)
- [Next.js Metadata](https://nextjs.org/docs/app/building-your-application/optimizing/metadata)
- [Google 結構化資料指南](https://developers.google.com/search/docs/appearance/structured-data/intro-structured-data)
- [Hreflang 指南](https://developers.google.com/search/docs/specialty/international/localized-versions)

## 🆘 常見問題

### Q: 為什麼我的結構化資料沒有顯示在搜尋結果中？

A: 
1. Google 需要時間處理（可能需要數週）
2. 不是所有結構化資料都會顯示
3. 需要滿足特定條件（如評分需要真實評論）
4. 使用 Rich Results Test 驗證

### Q: 如何添加新的語言？

A:
1. 在 `src/i18n-config.ts` 添加語言代碼
2. 創建對應的字典檔案（如 `es.json`）
3. 更新 `layout.tsx` 中的 hreflang 標籤
4. 更新 `sitemap.ts`

### Q: 如何更新評分？

A: 修改 `src/app/[lang]/layout.tsx` 中的 `aggregateRating` 值。確保評分基於真實用戶反饋。

### Q: 需要在 head 標籤中還是 body 中放置 JSON-LD？

A: 兩者都可以，但建議放在 `<head>` 中以確保搜尋引擎能最先讀取。本專案在 `<head>` 中實作。

## 🎓 進階優化

### 添加更多結構化資料類型

根據內容類型，可以考慮添加：

- **Review**：如果有用戶評論
- **VideoObject**：如果添加教學影片
- **Article**：如果有部落格文章
- **Product**：如果有付費版本

### 實作 AMP（加速移動頁面）

如需更快的移動體驗，可考慮實作 AMP 版本。

### 添加結構化資料測試

在 CI/CD 中添加自動化測試，驗證結構化資料格式。

---

**最後更新**：2026-01-26
**版本**：1.0.0
