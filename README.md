# Twitch NPC Talk Displayer - 用Vue做的一個Twitch聊天室指定用戶監聽器

這是一個可以用來產生一個動態顯示某用戶在Twitch頻道聊天室上最新聊天訊息的瀏覽器來源。
像是如果實況主不打算開麥克風說話，但又想要讓觀眾有實況主在實時說話的沉浸感的話，就可以使用這個工具。
可以讓文字像是RPG裡面NPC在文字說話的樣子一樣呈現，可以調整語速、文字大小顏色、顯示時長等參數。

## DEMO AND 使用方式

目前部署在 https://twitch-npc-talk-displayer.seagalogs.com 上面，歡迎直接使用。

OBS自訂CSS範例(文字調整 無效請加!important在後面)
```
.chat-display {
  /* 字體大小 */
  font-size: 12px;

  /* 字體顏色 */
  color: black;

  /* 是否粗體 */
  font-weight: 400;

  /* 除了Cubic 11外 其他自訂字體需要在本地有安裝，在此把他放在最前面。 */
  font-family: 'Cubic 11', '微軟正黑體', sans-serif;
}
```

## 使用套件
* vue3 + vite
* vue-touter
* tmi.js - Twitch 聊天室 WebSocket 客戶端

## 使用說明
靜態部署即可，記得下面幾項內容需要調整成自己的：

### 環境變數
記得要修改`env/.env`裡面的參數
```
VITE_BASE_URL=/             # 如果部署在子路徑（例如 /npc/），這邊要改成對應路徑
VITE_DOMAIN=your.domain.com # 你的部署網域
```

### 路由
本專案只有路由下只有兩個頁面：
* LoginView.vue(/): 用來產生可以用來顯示OBS來源的地方
* DisplayView.vue(/display): 產生的OBS來源，裡面只有顯示的訊息。

### Google Adsense 廣告
FooterAds.vue底下的`data-ad-client`和`data-ad-slot`記得改成自己的，另外此專案由於我自己是部署在子網域下，所以一些要設置在網域底下的內容我這邊沒有特別設定，如果這是直接部署在主網域上請記得補齊，或是註解FooterAds的內容。
```
data-ad-client="你的 Google AdSense client ID"
data-ad-slot="你的 slot ID"
```
若你不需要廣告，建議直接註解掉 FooterAds.vue。

### 啟動服務(以pnpm為例)
* 安裝套件 `pnpm install`
* 開發模式 `pnpm run dev`
* 打包成靜態頁 `pnpm run build`

> MIT License – 歡迎 Fork、改造、二創。
