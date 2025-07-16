<template>
  <div class="login-view">
    <div>
      <h1>Twitch NPC對話聊天室展示器</h1>
      <div class="description-container">
        只需輸入 Twitch 頻道名稱並調整設定，即可產生一個實時展示觀眾發言的 OBS 瀏覽器來源。
        <br />
        也支援輸入指定用戶顯示名稱，會只顯示其訊息。
        <br />
        有任何建議或疑難，都可以透過信箱<a href="mailto:seagal.wu@seagalogs.com">seagal.wu@seagalogs.com</a>
        <br />
        或<a href="https://seagalogs.com/" target="_blank">我的部落格-蜥嘎絡格室</a>來聯絡我
        <br />
        本專案為開源開發中項目，尚未完工，歡迎貢獻或提供建議LUL (<a href="https://github.com/WuSeagal/Twitch-NPC-Talk-Displayer" target="_blank">可以參考GITHUB</a>)
      </div>
      <div class="form-container">
        <!-- 頻道 channel -->
        <label>
          📺 頻道帳號（必填）：Twitch 網址最後的 ID
          <br />
          （如 https://twitch.tv/example => 輸入 example）。
          <br />
          <input v-model="channel" placeholder="頻道帳號，必填" />
        </label>
        <br />
        <!-- 顯示用戶 targetUser -->
        <label>
          👤 指定顯示用戶（可選）：僅顯示該使用者的訊息。<br>請填"用戶顯示名稱"，若要顯示所有觀眾的訊息，請留白此欄位。<br>（如 用戶聊天室名稱(用戶帳號) => 請輸入 用戶聊天室名稱）
          <br />
          <input v-model="targetUser" placeholder="不指定用戶請留白" />
        </label>
        <br />
        <!-- 是否顯示名稱 showName -->
        <label>
          👤 顯示使用者名稱，是否在訊息前標示用戶名（預設顯示）：
          <select v-model="showName">
            <option value="true">顯示</option>
            <option value="false">不顯示</option>
          </select>
        </label>
        <br />
        <!-- 每字顯示間隔 typingSpeed  -->
        <label>
          🦎 每字顯示間隔（單位：毫秒，1000 毫秒 = 1 秒）：
          <input type="number" v-model="typingSpeed" placeholder="預設50毫秒" /> 毫秒
        </label>
        <br />
        <!-- 換行間隔 messageLineDuration  -->
        <label>
          🦎 換行間隔，內容超過一行的時候每幾秒換一次行：
          <input type="number" v-model="messageLineDuration" placeholder="預設5秒" /> 秒
        </label>
        <br />
        <!-- 訊息呈現時長 messageDuration  -->
        <label>
          ⏱️ 訊息呈現時長，訊息打完後，停留畫面幾秒後才消失：
          <input type="number" v-model="messageDuration" placeholder="預設10秒" /> 秒
        </label>
        <br />
        <!-- 訊息停留時長 lastMessageDuration  -->
        <label>
          ⏱️ 訊息停留時長：沒有新訊息時，最後一則訊息持續顯示幾秒（0 = 永久）
          <input type="number" v-model="lastMessageDuration" placeholder="預設0，永久停留" /> 秒
        </label>
        <br />
        <!-- 畫面最多保留幾則訊息 maxMessageAwait -->
        <label>
          🗃️ 畫面最多保留幾則訊息（範圍：5~30，僅保留最新 N 筆）
          <input 
            type="number" 
            v-model="maxMessageAwait"
            :min="5"
            :max="30"
            placeholder="預設5，範圍5~30" /> 筆（只保留最新的 N 筆訊息）
        </label>
        <br />
        <!-- 文字大小 fontSize -->
        <label>
          🔠 文字大小（單位：px，預設 12）：
          <input type="number" v-model="fontSize" placeholder="預設12px" /> px
        </label>
        <br />
        <!-- 文字顏色 fontColor -->
        <label>
          🎨 文字顏色： {{ fontColor }}
          <br />
          <input type="color" v-model="fontColor" />
        </label>
        <br />
        <!-- 字體粗細 fontWeight -->
        <label>
          🅱️ 字體粗細：
          <select v-model="fontWeight">
            <option value="normal">一般</option>
            <option value="bold">粗體</option>
          </select>
        </label>
        <br />
        <br />
        <button @click="copyUrl">📋 複製 OBS 用網址</button>
        <p class="obs-url" v-if="obsUrl">✅ 複製成功！OBS 使用此網址：{{ obsUrl }}</p>
        <button @click="testTypingEffect"> 測試訊息效果 </button>
      </div>
      <ChatDisplay 
        ref="chatDisplayRef"
        :targetUser="targetUser" 
        :showName="showName"
        :channel="channel"
        :typingSpeed= "typingSpeed"
        :fontSize="fontSize"
        :fontColor="fontColor"
        :fontWeight="fontWeight"
        :messageDuration="messageDuration"
        :messageLineDuration="messageLineDuration"
        :lastMessageDuration="lastMessageDuration"
        :maxMessageAwait="maxMessageAwait"
      />
      <FooterAds />
      <div class="copyright">
        Copyright © 2025 Seagalogs. 
        <br />
        All rights reserved.
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import ChatDisplay from '@/components/ChatDisplay.vue'
import FooterAds from '@/components/FooterAds.vue'

const targetUser = ref('')
const channel = ref('')
const obsUrl = ref('')
const typingSpeed = ref(50);
const fontSize = ref(12);
const fontColor = ref('#000000') // 預設黑色
const fontWeight = ref('normal')  // 預設普通
const messageLineDuration = ref(5);
const messageDuration = ref(10);
const maxMessageAwait = ref(5);
const lastMessageDuration = ref(0);
const showName = ref(true);

onMounted(async () => {
  const query = new URLSearchParams(location.search);
  typingSpeed.value = Number.isNaN(parseInt(query.get('typingSpeed') || ''))
    ? 50 : parseInt(query.get('typingSpeed') || '');
  fontSize.value = Number.isNaN(parseInt(query.get('fontSize') || ''))
    ? 12 : parseInt(query.get('fontSize') || '');

  targetUser.value = query.get('user') || ''
  channel.value = query.get('channel') || ''
  fontColor.value = query.get('fontColor') || '#000000' // 預設黑色
  fontWeight.value = query.get('fontWeight') || 'normal'

  messageLineDuration.value = Number.isNaN(parseInt(query.get('messageLineDuration') || ''))
    ? 5 : parseInt(query.get('messageLineDuration') || '');
  messageDuration.value = Number.isNaN(parseInt(query.get('messageDuration') || ''))
    ? 10 : parseInt(query.get('messageDuration') || '');
  maxMessageAwait.value = Number.isNaN(parseInt(query.get('maxMessageAwait') || ''))
    ? 5 : parseInt(query.get('maxMessageAwait') || '');
  lastMessageDuration.value = Number.isNaN(parseInt(query.get('lastMessageDuration') || ''))
    ? 0 : parseInt(query.get('lastMessageDuration') || '');
  showName.value = query.get('showName') === 'true';
})

function copyUrl() {
  const url = `${import.meta.env.VITE_DOMAIN}${import.meta.env.VITE_BASE_URL}display`
    + `?user=${encodeURIComponent(targetUser.value)}` 
    + `&channel=${channel.value}` 
    + `&typingSpeed=${typingSpeed.value}`
    + `&fontSize=${fontSize.value}`
    + `&fontColor=${encodeURIComponent(fontColor.value)}`
    + `&fontWeight=${fontWeight.value}`
    + `&showName=${showName.value}`
    + `&messageLineDuration=${messageLineDuration.value}`
    + `&messageDuration=${messageDuration.value}`
    + `&lastMessageDuration=${lastMessageDuration.value}`
    + `&maxMessageAwait=${maxMessageAwait.value}`;
  navigator.clipboard.writeText(url)
  obsUrl.value = url
}

const chatDisplayRef = ref<InstanceType<typeof ChatDisplay> | null>(null)
function testTypingEffect() {
  chatDisplayRef.value?.testTypingEffect()
}
</script>

<style scoped>
</style>