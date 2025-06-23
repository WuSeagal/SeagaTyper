<template>
  <div class="login-view">
    <div>
      <div class="form-container">
        <label>
          🎯 觀察對象名稱(聊天室暱稱)：<br />
          <input v-model="targetUser" placeholder="想追蹤的 user name" />
        </label>
        <br />
        <label>
          🛰️ 觀察對象的發言頻道(頻道主人帳號username)：<br />
          <input v-model="channel" placeholder="頻道名 (預設自己)" />
        </label>
        <br />
        <label>
          語言速度(幾毫秒跑一個字)：<br />
          <input v-model="typingSpeed" placeholder="預設50毫秒" /> 毫秒
        </label>
        <br />
        <label>
          字體大小(px)：<br />
          <input v-model="fontSize" placeholder="預設12px" /> px
        </label>
        <br />
        <label>
          字體顏色：<br />
          <input type="color" v-model="fontColor" />
          <span> {{ fontColor }} </span>
        </label>
        <br />
        <label>
          是否粗體：
          <select v-model="fontWeight">
            <option value="normal">否</option>
            <option value="bold">是</option>
          </select>
        </label>
        <br />
        <label>
          持續顯示秒數(0代表不刪除)：<br />
          <input v-model="messageDuration" placeholder="預設0為不刪除" /> 秒
        </label>
        <br />
        <button @click="copyUrl">📋 複製 OBS URL</button>
        <p class="obs-url" v-if="obsUrl">✅ URL：{{ obsUrl }}</p>
        <button @click="testTypingEffect"> 測試用訊息 </button>
      </div>
      <ChatDisplay 
        ref="chatDisplayRef"
        :targetUser="targetUser" 
        :channel="channel || userInfo?.login"
        :typingSpeed= "typingSpeed"
        :fontSize="fontSize"
        :fontColor="fontColor"
        :fontWeight="fontWeight"
        :messageDuration="messageDuration"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import ChatDisplay from '@/components/ChatDisplay.vue'

const userInfo = ref<any>(null)
const targetUser = ref('')
const channel = ref('')
const obsUrl = ref('')
const typingSpeed = ref(50);
const fontSize = ref(12);
const fontColor = ref('#000000') // 預設黑色
const fontWeight = ref('normal')  // 預設普通
const messageDuration = ref(0);

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

  messageDuration.value = Number.isNaN(parseInt(query.get('messageDuration') || ''))
    ? 0 : parseInt(query.get('messageDuration') || '');
})

function copyUrl() {
  const url = `${import.meta.env.VITE_DOMAIN}${import.meta.env.VITE_BASE_URL}display?user=${targetUser.value}&channel=${channel.value}&typingSpeed=${typingSpeed.value}&fontSize=${fontSize.value}&fontColor=${encodeURIComponent(fontColor.value)}&fontWeight=${fontWeight.value}&messageDuration=${messageDuration.value}`
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