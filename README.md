# SeagaTyper - Twitch聊天單行式顯示工具

SeagaTyper是一個幫助實況主的Twitch聊天室單行式顯示工具，可以產生Twitch聊天室內容進行單行顯示的網址套用在OBS瀏覽器來源。
針對Twitch聊天室內容進行打字式單行顯示、指定特定觀眾身分觀眾篩選呈現對話是SeagaTyper的特色。

## DEMO AND 使用方式

目前部署在 [https://seagatyper.seagalogs.com/](https://seagatyper.seagalogs.com/) 上面，歡迎直接使用。

## 使用套件
* vue3 + vite
* vue-router
* tmi.js

## 使用說明
run build 後靜態部署即可，記得環境變數需要調整成自己的網域

### 環境變數
記得要修改`env/.env`裡面的參數
```
VITE_BASE_URL=/             # 如果部署在子路徑（例如 /npc/），這邊要改成對應路徑
VITE_DOMAIN=your.domain.com # 你的部署網域
```

### 路由
本專案只有路由下只有兩個頁面：
* MainView.vue(/): 用來調整設定，產生display連結的地方。
* DisplayView.vue(/display): 產生的OBS來源，內容只有顯示的訊息。
* TutorialView.vue(/tutorial): 教學頁面。

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
