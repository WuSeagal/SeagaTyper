<template>
  <div class="main-view">
    <div class="main-layout">
      <h1>SeagaTyper</h1>
      <div class="description-container">
        <p>SeagaTyper是一個幫助實況主的Twitch聊天室單行式顯示工具，可以產生Twitch聊天室內容進行單行顯示的網址套用在OBS瀏覽器來源。</p>
        <p>針對Twitch聊天室內容進行打字式單行顯示、指定特定觀眾身分觀眾篩選呈現對話是SeagaTyper的特色。</p>
        <p>如果使用上有任何建議或疑難，都可以透過以下方式與我設法聯繫：</p>
        <p>
          信箱 <a href="mailto:seagal.wu@seagalogs.com">seagal.wu@seagalogs.com</a> 或 部落格 <a href="https://seagalogs.com/about" target="_blank">關於我</a>
        </p>
        <p>
          本工具為開源專案，歡迎不吝指教。 --<a href="https://github.com/WuSeagal/SeagaTyper" target="_blank">SeagaTyper GitHub連結</a>
        </p>
      </div>
      <a href="/tutorial" class="primary-button">查看使用教學</a>
      <div class="form-container">
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

        <div class="fancy-card-wrapper">
          <div class="fancy-title">
            篩選發言用戶
          </div>
          <div class="fancy-card">
            <div class="form-group">
              <label for="blacklist">黑名單：不想顯示的用戶，在此輸入帳號並以","來分隔複數帳號</label>
              <br />
              <input 
                type="text" 
                id="blacklist" 
                v-model="blacklistInput"
                placeholder="輸入不想顯示的用戶"
              />
            </div>
            <div class="form-group">
              <label>
                <input type="checkbox" v-model="isLimitDisplay" />
                只顯示符合條件的用戶發言
              </label>
            </div>
            <div :class="{ 'disabled-section': !isLimitDisplay }">
              <div class="form-group">
                <label for="whitelist">白名單：指定想顯示的用戶，在此輸入帳號並以","來分隔複數帳號</label>
                <br />
                <input 
                  type="text" 
                  id="whitelist" 
                  v-model="whitelistInput"
                  placeholder="輸入想顯示的用戶"
                  :disabled="!isLimitDisplay"
                />
              </div>
              <div class="form-group">
                <label>身份徽章篩選</label>
                <div class="roles-flex">
                  <label><input type="checkbox" v-model="displayRoles" :value="1" :disabled="!isLimitDisplay" /> 頻道擁有者</label>
                  <label><input type="checkbox" v-model="displayRoles" :value="2" :disabled="!isLimitDisplay" /> Mod(大劍)</label>
                  <label><input type="checkbox" v-model="displayRoles" :value="3" :disabled="!isLimitDisplay" /> VIP</label>
                </div>
                <div class="roles-flex">
                  <label><input type="checkbox" v-model="displayRoles" :value="4" :disabled="!isLimitDisplay" /> 創建者</label>
                  <label><input type="checkbox" v-model="displayRoles" :value="5" :disabled="!isLimitDisplay" /> 層級2訂閱</label>
                  <label><input type="checkbox" v-model="displayRoles" :value="6" :disabled="!isLimitDisplay" /> 層級3訂閱</label>
                </div>
              </div>
              <div class="form-group">
                <label>
                  <input type="checkbox" v-model="displaySubs" :disabled="!isLimitDisplay" />
                  顯示已訂閱
                </label>
                <label>
                  <input
                  type="number"
                  class="number-short"
                  :value="subMonthsLimit"
                  @input="(e) => handleNumberInput(e, (v) => subMonthsLimit = v, { min: 1, max: 999, decimalPlaces: 0, defaultValue: 1 })"
                  placeholder="1~999"
                  :disabled="!isLimitDisplay || !displaySubs"
                  />
                  個月以上的用戶
                </label>
                
              </div>
              <div class="form-group">
                <label>
                  <input type="checkbox" v-model="displayBits" :disabled="!isLimitDisplay" />
                  顯示佩帶小奇點徽章
                </label>
                <label>
                  <select
                    :value="cheerBitsLimitInput"
                    @change="e => cheerBitsLimitInput = (e.target as HTMLSelectElement).value"
                    :disabled="!isLimitDisplay || !displayBits"
                  >
                    <option value="1">1點</option>
                    <option value="100">100點</option>
                    <option value="1000">1000點</option>
                    <option value="5000">5000點</option>
                    <option value="10000">10000點</option>
                    <option value="25000">25000點</option>
                    <option value="50000">50000點</option>
                    <option value="75000">75000點</option>
                    <option value="100000">100000點</option>
                    <option value="200000">200000點</option>
                    <option value="300000">300000點</option>
                    <option value="400000">400000點</option>
                    <option value="500000">500000點</option>
                    <option value="600000">600000點</option>
                    <option value="700000">700000點</option>
                    <option value="800000">800000點</option>
                    <option value="900000">900000點</option>
                    <option value="1000000">1000000點</option>
                    <option value="1250000">1250000點</option>
                    <option value="1500000">1500000點</option>
                    <option value="1750000">1750000點</option>
                    <option value="2000000">2000000點</option>
                    <option value="2500000">2500000點</option>
                    <option value="3000000">3000000點</option>
                    <option value="3500000">3500000點</option>
                    <option value="4000000">4000000點</option>
                    <option value="4500000">4500000點</option>
                    <option value="5000000">5000000點</option>
                  </select>
                  以上的用戶
                </label>
              </div>
              <div class="note-block">
                <p><strong>重要：</strong> 層級2訂閱、層級3訂閱、VIP、創建者、小奇點點數，以上幾個都需要觀眾現在正在佩帶對應的徽章才會視為該身分。</p>
              </div>
            </div>
          </div>
        </div>

        <div class="cols2-fancy-card-container">
          <div class="fancy-card-wrapper">
            <div class="fancy-title">
              顯示設定
            </div>
            <div class="fancy-card">
              <div class="form-group">
                <label>
                  👤 發言使用者名稱：
                  <br />
                  <select v-model="showName">
                    <option value="true">顯示</option>
                    <option value="false">不顯示</option>
                  </select>
                </label>
              </div>
              <div class="form-group">
                <label>
                  🦎 打字顯示速度：
                  <br />
                  每字
                  <input
                      type="number"
                      class="number-medium"
                      :value="typingSpeed"
                      @input="(e) => handleNumberInput(e, (v) => typingSpeed = v, { min: 1, max: 10000, decimalPlaces: 0, defaultValue: 50 })"
                      placeholder="1~10000"
                  /> 毫秒
                </label>
              </div>
              <div class="form-group">
                <label>
                  🦎 同訊息每行顯示間隔時間：
                  <br />
                  <input
                      type="number"
                      class="number-medium"
                      :value="messageLineDuration"
                      @input="(e) => handleNumberInput(e, (v) => messageLineDuration = v, { min: 1, max: 3600, decimalPlaces: 0, defaultValue: 5 })"
                      placeholder="1~3600"
                  /> 秒
                </label>
              </div>
              <div class="form-group">
                <label>
                  ⏱️ 每則訊息間隔：
                  <br />
                  <input
                      type="number"
                      class="number-medium"
                      :value="messageDuration"
                      @input="(e) => handleNumberInput(e, (v) => messageDuration = v, { min: 1, max: 3600, decimalPlaces: 0, defaultValue: 10 })"
                      placeholder="1~3600"
                  /> 秒
                </label>
              </div>
              <div class="form-group">
                <label>
                  ⏱️ 末尾訊息停留畫面時長（0=永遠停留）：
                  <br />
                  <input
                      type="number"
                      class="number-medium"
                      :value="lastMessageDuration"
                      @input="(e) => handleNumberInput(e, (v) => lastMessageDuration = v, { min: 0, max: 3600, decimalPlaces: 0, defaultValue: 0 })"
                      placeholder="0~3600, 0=永遠存在"
                  /> 秒
                </label>
              </div>
              <div class="form-group">
                <label>
                  🗃️ 待顯示佇列訊息數上限
                  <br />
                  （超過筆數時，會先刪除等待中最舊的訊息）：
                  <br />
                  <input
                      type="number"
                      class="number-short"
                      :value="maxMessageAwait"
                      @input="(e) => handleNumberInput(e, (v) => maxMessageAwait = v, { min: 5, max: 999, decimalPlaces: 0, defaultValue: 5 })"
                      :min="5"
                      :max="999"
                      placeholder="5~999"
                  /> 筆
                </label>
              </div>
              
            </div>
          </div>
          <div class="fancy-card-wrapper">
            <div class="fancy-title">
              文字設定
            </div>
            <div class="fancy-card">
              <div class="form-group">
                <label>
                  🔠 文字大小（px）：
                  <br />
                  <input
                      type="number"
                      class="number-medium"
                      :value="fontSize"
                      @input="(e) => handleNumberInput(e, (v) => fontSize = v, { min: 1, max: 9999, decimalPlaces: 0, defaultValue: 12 })"
                      placeholder="1~9999"
                  /> px
                </label>
              </div>
              <div class="form-group">
                <label>
                  🎨 文字顏色： {{ fontColor }}
                  <br />
                  <input type="color" v-model="fontColor" />
                </label>
              </div>
              <div class="form-group">
                <label>
                  🅱️ 字體粗細：
                  <br />
                  <select v-model="fontWeight">
                    <option value="normal">一般</option>
                    <option value="bold">粗體</option>
                  </select>
                </label>
              </div>
              <div class="form-group">
                <label>
                  🔤 字體選擇：
                  <br />
                  <select v-model="fontFamily">
                    <option value="'Cubic 11', sans-serif">俐方體11號(預設)</option>
                    <option value="'Mantou Sans', sans-serif">饅頭黑體</option>
                    <option value="'Noto Sans TC', sans-serif">思源黑體(Noto Sans TC)</option>
                    <option value="'Microsoft JhengHei', sans-serif">微軟正黑體</option>
                    <option value="'PMingLiU', serif">新細明體</option>
                    <option value="'DFKai-sb', serif">標楷體</option>
                  </select>
                </label>
              </div>
            </div>
          </div>
        </div>

        <br />
        <br />
        <button class="primary-button" @click="copyUrl">📋 複製 OBS瀏覽器來源 網址</button>
        <p class="obs-url" v-if="obsUrl">✅ 複製成功！OBS 使用此網址：{{ obsUrl }}</p>
        <button @click="testTypingEffect"> 測試顯示效果 </button>
      </div>
      <ChatDisplay 
        ref="chatDisplayRef"
        :channel="channel"
        :showName="showName"
        :typingSpeed= "typingSpeed"
        :fontSize="fontSize"
        :fontColor="fontColor"
        :fontWeight="fontWeight"
        :fontFamily="fontFamily"
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
import { useRouter } from 'vue-router'
import ChatDisplay from '@/components/ChatDisplay.vue'
import FooterAds from '@/components/FooterAds.vue'
import { decodeConfig, encodeConfig, type DisplayConfig } from '@/utils/configEncoder'

const router = useRouter()

function goToTutorial() {
  router.push('/tutorial')
}

const channel = ref('')
const obsUrl = ref('')
const typingSpeed = ref(50);
const fontSize = ref(12);
const fontColor = ref('#000000')
const fontWeight = ref('normal')
const fontFamily = ref("'Cubic 11', sans-serif")
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
const cheerBitsLimitInput = ref<string>('1');

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
    return isNaN(val) || cheerBitsLimitInput.value === '' ? 1 : val
  },
  set(val: number | null) {
    cheerBitsLimitInput.value = val === 0 ? '1' : String(val)
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
      fontFamily.value = config.ff || "'Cubic 11', sans-serif"
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
    ff: fontFamily.value,
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

function handleNumberInput(
    event: Event,
    setValue: (value: number) => void,
    options: {
      min: number
      max: number
      decimalPlaces?: number
      defaultValue?: number
    }
) {
  const target = event.target as HTMLInputElement
  let value = Number(target.value)

  if (isNaN(value)) {
    value = options.defaultValue ?? options.min
  }

  if (options.decimalPlaces === 0) {
    value = Math.floor(value)
  } else if (options.decimalPlaces && options.decimalPlaces > 0) {
    value = Number(value.toFixed(options.decimalPlaces))
  }

  // 限制範圍
  if (value < options.min) {
    value = options.min
  } else if (value > options.max) {
    value = options.max
  }

  setValue(value)
  target.value = value.toString()
}

</script>
