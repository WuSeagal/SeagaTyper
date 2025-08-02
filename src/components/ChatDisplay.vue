<template>
  <div class="chat-container">
    <div class="chat-line">
      <span class="chat-display-name" :style="fontStyle" v-if="props.showName && currentDisplayName">{{ currentDisplayName }}：</span>
      <span class="chat-text-content" :style="fontStyle" ref="typingContainer" v-html="displayedHtml"></span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref, watch, nextTick } from 'vue'
import tmi from 'tmi.js'
import type { ChatProps } from '@/types/ChatProps';
import { defaultChatProps } from '@/constants/defaultChatProps';

const props = withDefaults(defineProps<ChatProps>(), defaultChatProps)

// 輸出參數的函數
function logProps() {
  console.log('ChatDisplay 參數：', {
    '頻道': props.channel,
    '打字速度': props.typingSpeed + 'ms',
    '字體大小': props.fontSize + 'px',
    '字體顏色': props.fontColor,
    '字體粗細': props.fontWeight,
    '每行間隔': props.messageLineDuration + '秒',
    '訊息間隔': props.messageDuration + '秒',
    '最多保留訊息數': props.maxMessageAwait,
    '末尾訊息停留': props.lastMessageDuration + '秒',
    '顯示用戶名': props.showName ? '是' : '否',
    '限制顯示': props.isLimitDisplay ? '是' : '否',
    '白名單': props.whiteList,
    '顯示頻道擁有者': props.displayBroadcaster ? '是' : '否',
    '顯示版主': props.displayMod ? '是' : '否',
    '顯示VIP': props.displayVip ? '是' : '否',
    '顯示創建者': props.displayFounder ? '是' : '否',
    '顯示二級訂閱': props.displayTier2Sub ? '是' : '否',
    '顯示三級訂閱': props.displayTier3Sub ? '是' : '否',
    '顯示訂閱者': props.displaySubs ? '是' : '否',
    '訂閱月數限制': props.subMonthsLimit,
    '顯示小奇點': props.displayBits ? '是' : '否',
    '小奇點限制': props.cheerBitsLimit,
    '黑名單': props.blackList
  })
}

// 初始化時輸出傳入的參數
logProps()

// 監聽所有props的變化，當任何prop改變時重新輸出
watch(() => ({ ...props }), () => {
  console.log('設定已更新')
  logProps()
}, { deep: true })

const typingContainer = ref<HTMLElement | null>(null)
const currentDisplayName = ref('')
const fullSegments = ref<(string)[]>([])
const displayedHtml = ref('')

type ChatMessage = {
  displayName: string
  segments: string[]
}
const messageQueue = ref<ChatMessage[]>([])
let isTyping = false

let typingInterval: number | undefined
let clearMessageTimeout: number | undefined

let client: tmi.Client

const fontStyle = computed(() => ({
  fontSize: `${props.fontSize}px`,
  color: props.fontColor,
  fontWeight: props.fontWeight
}))

watch(() => props.channel, (newChannel) => {
  console.log(`Switching to channel: ${newChannel}`)
  if (client) client.disconnect()
  setupClient()
})

function setupClient() {
  client = new tmi.Client({ channels: [props.channel] })
  client.connect()

  client.on('message', (channel, tags, message, self) => {
    const name = tags['display-name'] ?? ''
    const segments = parseMessageWithEmotes(message, tags.emotes)

    const isDisplay = checkTags(tags);
    

    if (isDisplay) {
          messageQueue.value.push({ displayName: name, segments })
        if (messageQueue.value.length > props.maxMessageAwait) {
          messageQueue.value.shift()
        }
        if (!isTyping) {
          displayNextMessage()
        }
    }
  })
}

function displayNextMessage() {
  // Clear any existing timeout to prevent issues with previous timeouts
  if (clearMessageTimeout) {
    window.clearTimeout(clearMessageTimeout)
    clearMessageTimeout = undefined
  }

  const next = messageQueue.value.shift()
  if (!next) {
    isTyping = false
    // lastMessageDuration: 如果 queue 空了 → 等最後一條的延遲時間後清除畫面
    if (props.lastMessageDuration > 0) {
      clearMessageTimeout = window.setTimeout(() => {
        displayedHtml.value = ''
        currentDisplayName.value = ''
        // Clear the actual DOM content as well
        if (typingContainer.value) {
          typingContainer.value.innerHTML = ''
        }
      }, props.lastMessageDuration * 1000)
    }
    return
  }

  isTyping = true
  fullSegments.value = next.segments
  currentDisplayName.value = next.displayName

  startTypingEffect(() => {
    // messageDuration: 此條訊息顯示完成後, 過多久嘗試顯示下一條訊息
    setTimeout(() => {
      displayNextMessage()
    }, props.messageDuration * 1000)
  })
}

function parseMessageWithEmotes(message: string, emotes: any): string[] {
  if (!emotes) return message.split('') // 沒 emote 就每字一段

  const parts: { start: number; end: number; id: string }[] = []
  for (const id in emotes) {
    emotes[id].forEach((range: string) => {
      const [start, end] = range.split('-').map(Number)
      parts.push({ start, end, id })
    })
  }

  parts.sort((a, b) => a.start - b.start)

  const segments: string[] = []
  let lastIndex = 0
  for (const { start, end, id } of parts) {
    if (lastIndex < start) {
      const text = message.slice(lastIndex, start)
      segments.push(...text.split(''))
    }

    const animatedUrl = `https://static-cdn.jtvnw.net/emoticons/v2/${id}/animated/dark/3.0`
    const staticUrl = `https://static-cdn.jtvnw.net/emoticons/v2/${id}/static/dark/3.0`

    const img = `
      <img 
        src="${animatedUrl}" 
        onerror="this.onerror=null;this.src='${staticUrl}'" 
        style="height: 1em; vertical-align: middle;" 
      />
    `.trim()
    
    segments.push(img)
    lastIndex = end + 1
  }

  if (lastIndex < message.length) {
    const text = message.slice(lastIndex)
    segments.push(...text.split(''))
  }

  return segments
}

function startTypingEffect(onFinish?: () => void) {
  if (typingInterval) clearInterval(typingInterval)
  
  // Also clear any message timeout when starting to type a new message
  if (clearMessageTimeout) {
    window.clearTimeout(clearMessageTimeout)
    clearMessageTimeout = undefined
  }

  const container = typingContainer.value
  if (!container) return

  // 先清空
  container.innerHTML = ''
  let index = 0
  let lineBuffer: (string | HTMLElement)[] = []
  let isWaitingBeforeNewLine = false

  typingInterval = setInterval(() => {
    if (isWaitingBeforeNewLine) return
    if (index >= fullSegments.value.length) {
      clearInterval(typingInterval)
      onFinish?.()
      return
    }

    const next = fullSegments.value[index]

    const el = document.createElement('span')
    if (next.startsWith('<img')) {
      // emote HTML → 真實元素
      const wrapper = document.createElement('div')
      wrapper.innerHTML = next
      const img = wrapper.firstElementChild! as HTMLElement
      lineBuffer.push(img)
      container.appendChild(img)
    } else {
      el.textContent = next
      lineBuffer.push(el)
      container.appendChild(el)
    }

    // 檢查是否 overflow
    const willOverflow = container.scrollWidth > container.clientWidth
    if (willOverflow) {
      isWaitingBeforeNewLine = true

      setTimeout(() => {
        container.innerHTML = ''
        lineBuffer = []
        isWaitingBeforeNewLine = false
      }, props.messageLineDuration * 1000)

      return
    }

    index++
  }, props.typingSpeed)
}

function testTypingEffect() {
  messageQueue.value.push({
    displayName: 'TestUser',
    segments: parseMessageWithEmotes(
      'Hello, this is a test message with an emote! Kappa',
      { '25': ['0-4'] }
    )
  })

  if (!isTyping) displayNextMessage()
}

defineExpose({
  testTypingEffect
})

onMounted(setupClient)

function checkTags(tags: tmi.ChatUserstate) {
  const username = tags['username'];
  // 黑名單(username)
  if (props.blackList && username && 
  props.blackList.map(name => name).includes(username)) {
    return false;
  }
  // 是否開啟限制
  if (!props.isLimitDisplay) {
    return true;
  }
  // 白名單(username)
  if (props.whiteList && username && 
  props.whiteList.map(name => name).includes(username)) {
    return true;
  }
  // 頻道擁有者
  if (props.displayBroadcaster && (tags['badges']?.broadcaster)) {
    return true;
  }
  // 大劍
  if (props.displayMod && (tags.mod || tags['badges']?.moderator)) {
    return true;
  }
  // VIP
  if (props.displayVip && (tags.vip || tags['badges']?.vip)) {
    return true;
  }
  // 創建者
  if (props.displayFounder && tags['badges']?.founder) {
    return true;
  }
  // 層級2/層級3訂閱 和訂閱時長
  const subTier = Math.floor(Number(tags['badges']?.subscriber) / 1000); // 訂閱層級：1, 2, 3
  const subMonth = Number(tags['badge-info']?.subscriber) % 1000; // 總訂閱月份
  if (props.displayTier2Sub && subTier === 2) {
    return true;
  }
  if (props.displayTier3Sub && subTier === 3) {
    return true;
  }
  if (props.displaySubs && subMonth >= props.subMonthsLimit) {
    return true;
  }
  // 小奇點
  const donatedBits = Number(tags['badges']?.bits);
  if (props.displayBits && donatedBits >= props.cheerBitsLimit) {
    return true;
  }
  return false;
}
</script>
