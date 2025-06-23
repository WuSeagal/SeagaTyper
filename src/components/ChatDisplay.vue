<template>
  <div class="chat-container">
    <div>
      <p class="chat-display" :style="fontStyle" v-html="displayedHtml"></p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
import tmi from 'tmi.js'

const props = withDefaults(defineProps<{ 
  targetUser: string,
  channel: string,
  typingSpeed?: number,
  fontSize?: number,
  fontColor?: string,
  fontWeight?: string,
  messageDuration?: number,
}>(), {
  typingSpeed: 50, // 預設打字速度
  fontSize: 12, // 預設字體大小
  fontColor: '#000000',
  fontWeight: 'normal',
  messageDuration: 0, // 預設為 0秒 表示不清除
})

const fullSegments = ref<(string)[]>([])
const displayedHtml = ref('')
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
    if (tags['display-name']?.toLowerCase() === props.targetUser.toLowerCase()) {
      fullSegments.value = parseMessageWithEmotes(message, tags.emotes)
      startTypingEffect()
    }
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
    const img = `<img src="https://static-cdn.jtvnw.net/emoticons/v1/${id}/3.0" style="height: 1em; vertical-align: middle;" />`
    segments.push(img)
    lastIndex = end + 1
  }

  if (lastIndex < message.length) {
    const text = message.slice(lastIndex)
    segments.push(...text.split(''))
  }

  return segments
}

function startTypingEffect() {
  if (typingInterval) clearInterval(typingInterval)

  displayedHtml.value = ''
  let index = 0

  typingInterval = setInterval(() => {
    if (index < fullSegments.value.length) {
      displayedHtml.value += fullSegments.value[index]
      index++
    } else {
      clearInterval(typingInterval)
    }
  }, props.typingSpeed)

  if (props.messageDuration > 0) {
    clearMessageTimeout && clearTimeout(clearMessageTimeout)

    clearMessageTimeout = setTimeout(() => {
      displayedHtml.value = ''
    }, props.messageDuration * 1000)
  }
}

function testTypingEffect() {
  fullSegments.value = parseMessageWithEmotes(
    'Hello, this is a test message with an emote! Kappa',
    { '25': ['0-4'] } // 模擬一個 emote
  )
  startTypingEffect()
}

defineExpose({
  testTypingEffect
})

onMounted(setupClient)
</script>
