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

const props = withDefaults(defineProps<{ 
  targetUser: string,
  channel: string,
  typingSpeed?: number,
  fontSize?: number,
  fontColor?: string,
  fontWeight?: string,
  messageLineDuration?: number, // 每次換行間隔
  messageDuration?: number, // 每條訊息完整呈現後的持續時間
  maxMessageAwait?: number, // 最大等待訊息數量
  lastMessageDuration?: number, // 最後一條消息的持續時間
  showName?: boolean
}>(), {
  typingSpeed: 50, // 預設打字速度
  fontSize: 12, // 預設字體大小
  fontColor: '#000000',
  fontWeight: 'normal',
  messageLineDuration: 5, // 預設為 5秒 不可0
  messageDuration: 10, // 預設為 10秒 不可0
  maxMessageAwait: 5, // 預設為5
  lastMessageDuration: 20, // 預設為 20秒 可0(不清除直到有新訊息)
  showName: true // 預設顯示名稱
})

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

    if (props.targetUser) {
      if (tags['display-name']?.toLowerCase() === props.targetUser.toLowerCase()) {
        messageQueue.value.push({ displayName: name, segments })
        if (messageQueue.value.length > props.maxMessageAwait) {
          messageQueue.value.shift()
        }
        if (!isTyping) {
          displayNextMessage()
        }
      }
    } else {
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
  const next = messageQueue.value.shift()
  if (!next) {
    isTyping = false
    // 如果 queue 空了 → 等最後一條的延遲時間後清除畫面
    if (props.lastMessageDuration > 0) {
      clearMessageTimeout = window.setTimeout(() => {
        displayedHtml.value = ''
        currentDisplayName.value = ''
      }, props.lastMessageDuration * 1000)
    }
    return
  }

  isTyping = true
  fullSegments.value = next.segments
  currentDisplayName.value = next.displayName

  startTypingEffect(() => {
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

  displayedHtml.value = ''
  let index = 0
  let lineBuffer: string[] = []
  let isWaitingBeforeNewLine = false
  const container = typingContainer.value

  if (!container) return

  typingInterval = setInterval(() => {
    if (isWaitingBeforeNewLine) return
    if (index >= fullSegments.value.length) {
      clearInterval(typingInterval)
      onFinish?.() // 執行 callback (接續下一句)
      return
    }

    const nextChar = fullSegments.value[index]
    const testLine = [...lineBuffer, nextChar].join('')
    displayedHtml.value = testLine

    nextTick(() => {
      if (!container) return

      const willOverflow = container.scrollWidth > container.clientWidth

      if (willOverflow) {
        isWaitingBeforeNewLine = true

        setTimeout(() => {
          displayedHtml.value = ''
          lineBuffer = []
          isWaitingBeforeNewLine = false
        }, props.messageLineDuration * 1000)

        return
      }

      lineBuffer.push(nextChar)
      displayedHtml.value = lineBuffer.join('')
      index++
    })
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
</script>
