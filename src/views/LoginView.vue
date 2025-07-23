<template>
  <div class="login-view">
    <div class="login-layout">
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
        <!-- 頻道資訊 -->
        <div class="fancy-card-wrapper">
          <div class="fancy-title">
            頻道資訊
          </div>
          <div class="fancy-card">
            <label>
              📺 頻道帳號（必填）：Twitch 頻道網址最後面的內容(頻道擁有者帳號)
              <br />
              （如 https://twitch.tv/exampleChannel => 輸入 exampleChannel）。
              <br />
              <input v-model="channel" placeholder="頻道帳號" />
            </label>
          </div>
        </div>
        
        <!-- 訊息篩選區域 -->
        <div class="fancy-card-wrapper">
          <div class="fancy-title">
            篩選訊息
          </div>
          <div class="fancy-card">
            <!-- 黑名單 -->
            <div class="form-group">
              <label for="blacklist">黑名單</label>
              <input 
                type="text" 
                id="blacklist" 
                v-model="blacklistInput"
                placeholder="輸入目標用戶帳號，用逗號分隔" 
              />
            </div>
            <!-- 用戶篩選 -->
            <div class="form-group">
              <label>
                <input type="checkbox" v-model="isLimitDisplay" />
                啟用用戶篩選
              </label>
            </div>
            <!-- 若啟用用戶篩選則可調整 -->
            <div :class="{ 'disabled-section': !isLimitDisplay }">
              <!-- 白名單 -->
              <div class="form-group">
                <label for="whitelist">白名單</label>
                <input 
                  type="text" 
                  id="whitelist" 
                  v-model="whitelistInput"
                  placeholder="輸入目標用戶帳號，用逗號分隔"
                  :disabled="!isLimitDisplay"
                />
              </div>
              <!-- 身份複選 -->
              <div class="form-group">
                <label>身份篩選</label>
                <div class="roles-flex">
                  <label><input type="checkbox" v-model="displayRoles" value="1" :disabled="!isLimitDisplay" /> 頻道擁有者</label>
                  <label><input type="checkbox" v-model="displayRoles" value="2" :disabled="!isLimitDisplay" /> Mod(大劍)</label>
                  <label><input type="checkbox" v-model="displayRoles" value="3" :disabled="!isLimitDisplay" /> VIP</label>
                </div>
                <div class="roles-flex">
                  <label><input type="checkbox" v-model="displayRoles" value="4" :disabled="!isLimitDisplay" /> 創建者</label>
                  <label><input type="checkbox" v-model="displayRoles" value="5" :disabled="!isLimitDisplay" /> 層級2訂閱</label>
                  <label><input type="checkbox" v-model="displayRoles" value="6" :disabled="!isLimitDisplay" /> 層級3訂閱</label>
                </div>
              </div>
              <!-- 訂閱月份 -->
              <div class="form-group">
                <label>
                  <input type="checkbox" v-model="displaySubs" :disabled="!isLimitDisplay" />
                  已訂閱：
                </label>
                <label>
                  <input
                  type="number"
                  v-model="subMonthsLimit"
                  min="0"
                  placeholder="輸入月份"
                  :disabled="!isLimitDisplay || !displaySubs"
                  />
                  個月
                </label>
                
              </div>
              <!-- 小奇點數量 -->
              <div class="form-group">
                <label>
                  <input type="checkbox" v-model="displayBits" :disabled="!isLimitDisplay" />
                  小奇點 - 數量
                </label>
                <select 
                  :value="cheerBitsLimitInput" 
                  @change="e => cheerBitsLimitInput = (e.target as HTMLSelectElement).value" 
                  :disabled="!isLimitDisplay || !displayBits"
                >
                  <option value="">請選擇</option>
                  <option value="100">100+</option>
                  <option value="500">500+</option>
                  <option value="1000">1000+</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        <!-- 顯示相關設定 -->
        <div class="cols2-fancy-card-container">
          <!-- 顯示時間設定 -->
          <div class="fancy-card-wrapper">
            <div class="fancy-title">
              顯示設定
            </div>
            <div class="fancy-card">
              <!-- 顯示名稱 showName -->
              <div class="form-group">
                <label>
                  👤 顯示使用者名稱：
                  <select v-model="showName">
                    <option value="true">顯示</option>
                    <option value="false">不顯示</option>
                  </select>
                </label>
              </div>
              <!-- 每字顯示間隔 typingSpeed -->
              <div class="form-group">
                <label>
                  🦎 每字顯示間隔（毫秒）：
                  <input type="number" v-model="typingSpeed" placeholder="預設50毫秒" /> 毫秒
                </label>
              </div>
              <div class="form-group">
                <label>
                  🦎 換行間隔（幾秒換一行）：
                  <input type="number" v-model="messageLineDuration" placeholder="預設5秒" /> 秒
                </label>
              </div>
              <!-- 訊息呈現時長 messageDuration -->
              <div class="form-group">
                <label>
                  ⏱️ 訊息呈現時長（打字完後停留）：
                  <input type="number" v-model="messageDuration" placeholder="預設10秒" /> 秒
                </label>
              </div>
              <!-- 訊息停留時長 lastMessageDuration -->
              <div class="form-group">
                <label>
                  ⏱️ 最後一則訊息停留秒數（0 = 永久）：
                  <input type="number" v-model="lastMessageDuration" placeholder="預設0，永久停留" /> 秒
                </label>
              </div>
              <!-- 畫面最多保留幾則訊息 maxMessageAwait -->
              <div class="form-group">
                <label>
                  🗃️ 畫面最多保留訊息數量（5~30）：
                  <input 
                    type="number" 
                    v-model="maxMessageAwait"
                    :min="5"
                    :max="30"
                    placeholder="預設5，範圍5~30" /> 筆
                </label>
              </div>
              
            </div>
          </div>
          <!-- 文字相關設定 -->
          <div class="fancy-card-wrapper">
            <div class="fancy-title">
              文字設定
            </div>
            <div class="fancy-card">
              <!-- 文字大小 fontSize -->
              <div class="form-group">
                <label>
                  🔠 文字大小（px）：
                  <input type="number" v-model="fontSize" placeholder="預設12px" /> px
                </label>
              </div>
              <!-- 文字顏色 fontColor -->
              <div class="form-group">
                <label>
                  🎨 文字顏色： {{ fontColor }}
                  <input type="color" v-model="fontColor" />
                </label>
              </div>
              <!-- 字體粗細 fontWeight -->
              <div class="form-group">
                <label>
                  🅱️ 字體粗細：
                  <select v-model="fontWeight">
                    <option value="normal">一般</option>
                    <option value="bold">粗體</option>
                  </select>
                </label>
              </div>
            </div>
          </div>
        </div>

        <br />
        <br />
        <button @click="copyUrl">📋 複製 OBS 用網址</button>
        <p class="obs-url" v-if="obsUrl">✅ 複製成功！OBS 使用此網址：{{ obsUrl }}</p>
        <button @click="testTypingEffect"> 測試訊息效果 </button>
      </div>
      <ChatDisplay 
        ref="chatDisplayRef"
        :channel="channel"
        :showName="showName"
        :typingSpeed= "typingSpeed"
        :fontSize="fontSize"
        :fontColor="fontColor"
        :fontWeight="fontWeight"
        :messageDuration="messageDuration"
        :messageLineDuration="messageLineDuration"
        :lastMessageDuration="lastMessageDuration"
        :maxMessageAwait="maxMessageAwait"
        :isLimitDisplay="isLimitDisplay"
        :blackList="blackList"
        :whiteList="whiteList"
        :displayBroadcaster="displayRoles.includes(1)"
        :displayMod="displayRoles.includes(2)"
        :displayVip="displayRoles.includes(3)"
        :displayFounder="displayRoles.includes(4)"
        :displayTier2Sub="displayRoles.includes(5)"
        :displayTier3Sub="displayRoles.includes(6)"
        :displaySubs="displaySubs"
        :subMonthsLimit="subMonthsLimit"
        :displayBits="displayBits"
        :cheerBitsLimit="cheerBitsLimit"
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
import { ref, onMounted, computed, watch } from 'vue'
import ChatDisplay from '@/components/ChatDisplay.vue'
import FooterAds from '@/components/FooterAds.vue'
import { decodeConfig, encodeConfig, type DisplayConfig } from '@/utils/configEncoder'

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

// 訊息篩選
const isLimitDisplay = ref(false);
const whiteList = ref<string[]>([]);
const blackList = ref<string[]>([]);
const displayRoles = ref<number[]>([]);
const displaySubs = ref(false);
const subMonthsLimit = ref(0);
const displayBits = ref(false);
const cheerBitsLimitInput = ref<string>('');

const blacklistInput = ref('');
const whitelistInput = ref('');

watch(blacklistInput, (val) => {
  blackList.value = val
    .split(',')
    .map(s => s.trim())
    .filter(s => s.length > 0)
});

watch(whitelistInput, (val) => {
  whiteList.value = val
    .split(',')
    .map(s => s.trim())
    .filter(s => s.length > 0)
});

const cheerBitsLimit = computed<number>({
  get() {
    const val = Number(cheerBitsLimitInput.value)
    return isNaN(val) || cheerBitsLimitInput.value === '' ? 0 : val
  },
  set(val: number | null) {
    cheerBitsLimitInput.value = val === 0 ? '' : String(val)
  }
})

onMounted(() => {
  const query = new URLSearchParams(location.search);
  const cfgStr = query.get('config')
  if (cfgStr) {
    const config = decodeConfig(cfgStr)
    if (config) {
      channel.value = config.c || ''
      typingSpeed.value = config.ts || 50
      fontSize.value = config.fs || 12
      fontColor.value = config.fc || '#000000'
      fontWeight.value = config.fw || 'normal'
      showName.value = config.sn ?? true
      messageLineDuration.value = config.mld || 5
      messageDuration.value = config.md || 10
      lastMessageDuration.value = config.lmd || 0
      maxMessageAwait.value = config.mma || 5
      isLimitDisplay.value = config.ild ?? false
      whiteList.value = config.wl || []
      blackList.value = config.bl || []
      displayRoles.value = config.dr || []
      displaySubs.value = config.ds ?? false
      subMonthsLimit.value = config.sml || 0
      displayBits.value = config.db ?? false
      cheerBitsLimit.value = config.cbl || 0
    }
  };
})

function copyUrl() {
  const config: DisplayConfig = {
    c: channel.value,
    ts: typingSpeed.value,
    fs: fontSize.value,
    fc: fontColor.value,
    fw: fontWeight.value,
    sn: showName.value,
    mld: messageLineDuration.value,
    md: messageDuration.value,
    lmd: lastMessageDuration.value,
    mma: maxMessageAwait.value,
    ild: isLimitDisplay.value,
    wl: whiteList.value,
    bl: blackList.value,
    dr: displayRoles.value,
    ds: displaySubs.value,
    sml: subMonthsLimit.value,
    db: displayBits.value,
    cbl: cheerBitsLimit.value,
  }

  const configStr = encodeConfig(config)
  const url = `${import.meta.env.VITE_DOMAIN}${import.meta.env.VITE_BASE_URL}display?config=${configStr}`

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