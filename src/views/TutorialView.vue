<template>
  <div class="login-view">
    <div class="login-layout">
      <h1>SeagaTyper 使用教學</h1>
      <div class="description-container">
        <p>這個頁面將一步一步教您如何填寫表單來產生您想要的效果。</p>
        <p>跟著以下步驟操作，您將能夠輕鬆設置並使用 SeagaTyper 來展示您的 Twitch 聊天室內容。</p>
      </div>
      
      <div class="form-container">
        <!-- 步驟 1 -->
        <div class="fancy-card-wrapper">
          <div class="fancy-title">
            步驟 1: 設定頻道資訊
          </div>
          <div class="fancy-card">
            <p>首先，您需要輸入您的 Twitch 頻道帳號：</p>
            <ol>
              <li>在主頁面找到「頻道資訊」區塊</li>
              <li>在「頻道帳號」欄位中輸入您的 Twitch 頻道名稱（例如：exampleChannel）</li>
              <li>確保您輸入的是頻道網址最後的部分，而不是完整網址</li>
            </ol>
            <div class="tutorial-image-placeholder">
              <!-- 未來可放置圖片 -->
              <p>【未來將在此處放置頻道設定的截圖】</p>
            </div>
          </div>
        </div>
        
        <!-- 步驟 2 -->
        <div class="fancy-card-wrapper">
          <div class="fancy-title">
            步驟 2: 篩選發言用戶
          </div>
          <div class="fancy-card">
            <p>接下來，您可以設定要顯示哪些用戶的發言：</p>
            <ol>
              <li>如果您想要排除特定用戶，可以在「黑名單」欄位中輸入用戶名稱，多個用戶請用逗號分隔</li>
              <li>如果您只想顯示特定用戶的發言，請勾選「只顯示符合條件的用戶發言」</li>
              <li>勾選後，您可以：
                <ul>
                  <li>在「白名單」中輸入想要顯示的用戶名稱</li>
                  <li>選擇要顯示的用戶身份（頻道擁有者、Mod、VIP等）</li>
                  <li>設定是否顯示已訂閱用戶，以及訂閱月份的最低要求</li>
                  <li>設定是否顯示獎勵小奇點的用戶，以及小奇點數量的最低要求</li>
                </ul>
              </li>
            </ol>
            <div class="tutorial-image-placeholder">
              <!-- 未來可放置圖片 -->
              <p>【未來將在此處放置用戶篩選設定的截圖】</p>
            </div>
          </div>
        </div>
        
        <!-- 步驟 3 -->
        <div class="fancy-card-wrapper">
          <div class="fancy-title">
            步驟 3: 調整顯示設定
          </div>
          <div class="fancy-card">
            <p>現在，您可以調整訊息的顯示方式：</p>
            <ol>
              <li>決定是否在訊息開頭顯示用戶名稱</li>
              <li>設定每個字符顯示的間隔時間（打字效果的速度）</li>
              <li>設定長訊息分行的間隔時間</li>
              <li>設定訊息之間的間隔時間（一則訊息顯示多久後換下一則）</li>
              <li>設定末尾訊息的停留時間（沒有新訊息時，多久後消失）</li>
              <li>設定最多保留幾則訊息（超過筆數時，過舊的訊息會被移除）</li>
            </ol>
            <div class="tutorial-image-placeholder">
              <!-- 未來可放置圖片 -->
              <p>【未來將在此處放置顯示設定的截圖】</p>
            </div>
          </div>
        </div>
        
        <!-- 步驟 4 -->
        <div class="fancy-card-wrapper">
          <div class="fancy-title">
            步驟 4: 調整文字設定
          </div>
          <div class="fancy-card">
            <p>您可以自訂文字的外觀：</p>
            <ol>
              <li>設定文字大小（像素）</li>
              <li>選擇文字顏色</li>
              <li>選擇字體粗細（一般或粗體）</li>
            </ol>
            <div class="tutorial-image-placeholder">
              <!-- 未來可放置圖片 -->
              <p>【未來將在此處放置文字設定的截圖】</p>
            </div>
          </div>
        </div>
        
        <!-- 步驟 5 -->
        <div class="fancy-card-wrapper">
          <div class="fancy-title">
            步驟 5: 測試與使用
          </div>
          <div class="fancy-card">
            <p>完成設定後：</p>
            <ol>
              <li>點擊「測試顯示效果」按鈕，查看設定的效果</li>
              <li>確認效果符合預期後，點擊「複製 OBS瀏覽器來源 網址」按鈕</li>
              <li>在 OBS 中添加一個「瀏覽器」來源</li>
              <li>將複製的網址貼入 OBS 瀏覽器來源的 URL 欄位</li>
              <li>調整瀏覽器來源的大小和位置</li>
              <li>完成！現在您的直播中將顯示符合您設定的聊天訊息</li>
            </ol>
            <div class="tutorial-image-placeholder">
              <!-- 未來可放置圖片或影片 -->
              <p>【未來將在此處放置 OBS 設定的截圖或影片】</p>
            </div>
          </div>
        </div>
        
        <br />
        <br />
        <button @click="goToMainPage">返回主頁面</button>
      </div>
      
      <div class="copyright">
        Copyright © 2025 Seagalogs. 
        <br />
        All rights reserved.
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'

const router = useRouter()

function goToMainPage() {
  router.push('/')
}
</script>
