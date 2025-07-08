<template>
  <div class="login-view">
    <div>
      <h1>Twitch NPC對話聊天室展示器</h1>
      <div class="description-container">
        這是一個只要提供Twitch聊天室暱稱、Twitch頻道，
        <br />
        你就能產生一個實時展示該用戶在聊天室每次新輸入的內容的瀏覽器來源產生器。
        <br />
        有任何建議或疑難，都可以透過信箱<a href="mailto:seagal.wu@seagalogs.com">seagal.wu@seagalogs.com</a>
        <br />
        或<a href="https://seagalogs.com/" target="_blank">我的部落格-蜥嘎絡格室</a>來聯絡我
        <br />
        本專案為開源項目，可以參考<a href="https://github.com/WuSeagal/Twitch-NPC-Talk-Displayer" target="_blank">GITHUB</a>，不過還沒完工就是了LUL
      </div>
      <div class="form-container">
        <label>
          👤 觀察對象(聊天室暱稱)：
          <input v-model="targetUser" placeholder="想追蹤的 user name" />
        </label>
        <br />
        <label>
          📺 頻道(頻道主人帳號username)：
          <input v-model="channel" placeholder="頻道名 (預設自己)" />
        </label>
        <br />
        <label>
          🦎 語言速度(幾毫秒跑一個字，1000=1秒)：
          <input v-model="typingSpeed" placeholder="預設50毫秒" /> 毫秒
        </label>
        <br />
        <label>
          🔠 字體大小(px)：
          <input v-model="fontSize" placeholder="預設12px" /> px
        </label>
        <br />
        <label>
          🎨 字體顏色：
          <input type="color" v-model="fontColor" />
          <br />
          <span> {{ fontColor }} </span>
        </label>
        <br />
        <label>
          🅱️ 是否粗體：
          <select v-model="fontWeight">
            <option value="normal">否</option>
            <option value="bold">是</option>
          </select>
        </label>
        <br />
        <label>
          ⏱️ 持續顯示秒數(0代表不刪除)：
          <input v-model="lastMessageDuration" placeholder="預設0為不刪除" /> 秒
        </label>
        <br />
        <button @click="copyUrl">📋 複製 OBS URL</button>
        <p class="obs-url" v-if="obsUrl">✅ URL：{{ obsUrl }}</p>
        <button @click="testTypingEffect"> 測試用訊息 </button>
      </div>
      <ChatDisplay 
        ref="chatDisplayRef"
        :targetUser="targetUser" 
        :channel="channel"
        :typingSpeed= "typingSpeed"
        :fontSize="fontSize"
        :fontColor="fontColor"
        :fontWeight="fontWeight"
        :lastMessageDuration="lastMessageDuration"
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
const lastMessageDuration = ref(0);

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

  lastMessageDuration.value = Number.isNaN(parseInt(query.get('lastMessageDuration') || ''))
    ? 0 : parseInt(query.get('lastMessageDuration') || '');
})

function copyUrl() {
  const url = `${import.meta.env.VITE_DOMAIN}${import.meta.env.VITE_BASE_URL}display?user=${targetUser.value}&channel=${channel.value}&typingSpeed=${typingSpeed.value}&fontSize=${fontSize.value}&fontColor=${encodeURIComponent(fontColor.value)}&fontWeight=${fontWeight.value}&lastMessageDuration=${lastMessageDuration.value}`
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