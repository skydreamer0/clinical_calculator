# 🏥 Clinical Calculator

> 臨床與健康計算工具集 — 輕量化 PWA，支援離線使用與行動裝置安裝

[![Deploy to GitHub Pages](https://github.com/skydreamer0/clinical_calculator/actions/workflows/deploy.yml/badge.svg)](https://github.com/skydreamer0/clinical_calculator/actions/workflows/deploy.yml)

🔗 **線上使用：** [https://skydreamer0.github.io/clinical_calculator/](https://skydreamer0.github.io/clinical_calculator/)

---

## ✨ 功能特色

- 📱 **PWA 支援** — 可安裝至手機桌面，離線也能使用
- 🫀 **FIB-4 肝纖維化風險評估** — 非侵入性肝纖維化篩檢計算
- 🔥 **BMR 基礎代謝率計算** — Harris-Benedict 公式，含 TDEE 每日總熱量消耗估算
- 🌐 **中英雙語介面** — 繁體中文為主，搭配英文醫學術語
- 📐 **響應式設計** — 針對行動裝置最佳化，支援 safe-area

---

## 🧮 計算工具

### 🫀 FIB-4 Index

非侵入性肝纖維化風險評估指標，用於篩檢是否需要進一步肝臟檢查。

**公式：**

$$\text{FIB-4} = \frac{\text{Age} \times \text{AST}}{\text{Platelet} \times \sqrt{\text{ALT}}}$$

**輸入參數：**

| 參數 | 單位 | 說明 |
|------|------|------|
| 年齡 | 歲 | Age |
| AST | U/L | 天門冬胺酸轉胺酶 |
| ALT | U/L | 丙胺酸轉胺酶 |
| 血小板 | ×10⁹/L | Platelet count |

**風險分級：**

| 等級 | FIB-4 範圍 | 對應 LSM | 建議 |
|------|-----------|----------|------|
| 🟢 低風險 | < 1.3 | < 8 kPa | 常規監測，每 1–2 年追蹤 |
| 🟡 中度風險 | 1.3–2.67 | 8–12 kPa | 每 3–6 個月密切監控 |
| 🔴 高風險 | > 2.67 | > 12 kPa | 每 3 個月密切監控 |

> 📖 參考文獻：*Hepatol Commun.* 2024;8(11):e0571

---

### 🔥 BMR 基礎代謝率

基於 Harris-Benedict 公式計算基礎代謝率，並依活動量估算每日總熱量消耗（TDEE）。

**公式：**

| 性別 | 公式 |
|------|------|
| ♂ 男性 | BMR = 66 + (13.7 × 體重) + (5 × 身高) − (6.8 × 年齡) |
| ♀ 女性 | BMR = 655 + (9.6 × 體重) + (1.8 × 身高) − (4.7 × 年齡) |

**活動量係數：**

| 活動量 | 說明 | 係數 |
|--------|------|------|
| 久坐 | 幾乎不運動 | ×1.2 |
| 輕度活動 | 每週 1–3 天 | ×1.375 |
| 中度活動 | 每週 3–5 天 | ×1.55 |
| 高度活動 | 每週 6–7 天 | ×1.725 |
| 極高活動 | 體力工作 / 每日訓練 | ×1.9 |

另提供 **減重目標**（TDEE − 300~500 kcal）與 **增肌目標**（TDEE + 200~400 kcal）參考值。

> 📖 參考文獻：Harris-Benedict (1919, revised 1984)

---

## 🛠 技術架構

| 項目 | 技術 |
|------|------|
| 框架 | React 18 |
| 建構工具 | Vite 5 |
| PWA | vite-plugin-pwa |
| 部署 | GitHub Pages（GitHub Actions 自動部署） |
| 語言 | JavaScript (JSX) |

### 專案結構

```
clinical_calculator/
├── public/
│   └── icon.svg              # App 圖示
├── src/
│   ├── main.jsx              # 進入點
│   ├── App.jsx               # 主元件 & 底部導覽列
│   ├── FIB4Calculator.jsx    # FIB-4 計算器
│   └── BMRCalculator.jsx     # BMR 計算器
├── index.html                # HTML 入口
├── vite.config.js            # Vite + PWA 設定
├── package.json
└── .github/workflows/
    └── deploy.yml            # GitHub Pages 部署 workflow
```

---

## 🚀 本地開發

```bash
# 安裝依賴
npm install

# 啟動開發伺服器
npm run dev

# 建構生產版本
npm run build

# 預覽生產版本
npm run preview
```

---

## 📦 部署

推送至 `main` 分支後，GitHub Actions 會自動建構並部署至 GitHub Pages。

也可在 GitHub repo 的 **Actions** 頁面手動觸發 `workflow_dispatch`。

---

## ⚠️ 免責聲明

本工具僅供 **醫療專業人員參考**，不可取代臨床判斷。所有計算結果應結合病人臨床狀況綜合評估，不應作為唯一的診斷或治療依據。

---

## 📄 License

MIT