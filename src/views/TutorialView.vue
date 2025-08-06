<template>
  <div class="main-view">
    <div class="main-layout">
      <h1>SeagaTyper 使用教學</h1>
      <div class="description-container">
        <p>本頁面將帶您操作SeagaTyper的各個設定怎麼調整，以及設定完後怎麼在OBS瀏覽器來源進行使用。</p>
        <p>跟著以下步驟操作，您將能夠輕鬆自訂設定使用SeagaTyper打造屬於你的Twitch聊天室單行顯示效果。</p>
      </div>

      <div class="form-container">
        <a href="/" class="return-main-button primary-button">返回主頁面</a>
        <!-- 步驟 1 -->
        <div class="fancy-card-wrapper">
          <div class="fancy-title">
            步驟一 設定SeagaTyper要抓哪個頻道的聊天室
          </div>
          <div class="fancy-card">
            <p>在Twitch找到想要抓的頻道的頻道擁有者帳號，可以從頻道網址最末段複製貼過來這邊，例如：想要抓 https://www.twitch.tv/wuseagal 的聊天室，就輸入wuseagal。</p>
            <div class="tutorial-image">
              <img src="/images/tutorials/tutorial-1-channel_example.png" alt="頻道設定範例" />
            </div>
          </div>
        </div>
        
        <!-- 步驟 2 -->
        <div class="fancy-card-wrapper">
          <div class="fancy-title">
            步驟二 確認那些觀眾發言要出現在SeagaTyper
          </div>
          <div class="fancy-card">
            <ul>
              <li><strong>黑名單：</strong> 在此輸入的觀眾帳號(用,分隔)的發言都不會出現。例如有用一些Bot帳號如Nightbot設在這邊，避免汙染發言呈現。</li>
              <li><strong>只顯示符合條件的觀眾發言：</strong>勾選後，只有下方有選擇的白名單、身分徽章篩選、訂閱or小奇點條件有符合的才會出現。</li>
              <li><strong>白名單：</strong>在此輸入的觀眾帳號(用,分隔)的發言都會出現。</li>
              <li><strong>身分徽章篩選：</strong>觀眾具有勾選的身分徽章的話，發言就會出現。</li>
              <li><strong>訂閱N個月：</strong>打勾後，觀眾總訂閱月數在設定數字以上的話發言就會出現。</li>
              <li><strong>小奇點：</strong>打勾後，正在佩帶小奇點徽章且數量在設定值以上的觀眾的發言會出現。</li>
            </ul>
          </div>
        </div>
        
        <!-- 步驟 3 -->
        <div class="fancy-card-wrapper">
          <div class="fancy-title">
            步驟三 調整訊息顯示相關設定
          </div>
          <div class="fancy-card">
            <ul>
              <li><strong>發言使用者名稱：</strong>是否開頭要顯示「觀眾聊天室顯示名稱：」再接著發言內容。</li>
              <li><strong>打字顯示速度：</strong>打字呈現的效果每隔多久出現下一個字。</li>
              <li><strong>同訊息每行顯示間隔時間：</strong>當字數在一行無法顯示時，SeagaTyper會分行顯示，一次顯示一行，每行之間顯示停留幾秒。</li>
              <li><strong>每則訊息間隔：</strong>當訊息呈現完成後，如果已經有新的發言在等待顯示，會停留多久才顯示新的發言。</li>
              <li><strong>末尾訊息停留畫面時長：</strong>如果今天沒有新的發言在等待顯示，最後一則訊息會停留在畫面多久(設0秒的話會一直停留)。</li>
              <li><strong>待顯示佇列訊息數上限：</strong>今天如果聊天室有大量發言等待顯示，等待顯示的訊息的上限。超過上限時會先剔除排隊中最舊的訊息。</li>
            </ul>
          </div>
        </div>
        
        <!-- 步驟 4 -->
        <div class="fancy-card-wrapper">
          <div class="fancy-title">
            步驟四 調整顯示文字的設定
          </div>
          <div class="fancy-card">
            <p>根據喜好設定字型、文字大小、文字顏色與粗細程度。請注意部分字型如例方體11號、饅頭黑體並無粗細之分。</p>
          </div>
        </div>
        
        <!-- 步驟 5 -->
        <div class="fancy-card-wrapper">
          <div class="fancy-title">
            步驟五 輸出用於OBS瀏覽器來源的網址
          </div>
          <div class="fancy-card">
            <ol>
              <li>可以先按「測試顯示效果」確認文字設定是否符合預期，也可以直接在目標頻道聊天室直接留言測試。</li>
              <li>按下「複製 OBS瀏覽器來源 網址」即可複製網址(畫面上也會出現網址)。</li>
              <li>OBS瀏覽器來源長度不限(盡量不要超過畫面長度)、寬度建議至少大於文字大小，網址就直接貼上即可。</li>
            </ol>
          </div>
        </div>

        <a href="/" class="return-main-button primary-button">返回主頁面</a>
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
