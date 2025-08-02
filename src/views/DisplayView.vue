<template>
  <ChatDisplay 
    :channel="channel"
    :showName="showName"
    :typingSpeed="typingSpeed"
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
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import ChatDisplay from '@/components/ChatDisplay.vue'
import { decodeConfig } from '@/utils/configEncoder';

const channel = ref('')
const typingSpeed = ref(50);
const fontSize = ref(12);
const fontColor = ref('#000000')
const fontWeight = ref('normal')
const fontFamily = ref("'Cubic 11', sans-serif") // 預設Cubic 11
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
const cheerBitsLimit = ref<number>(0);

onMounted(async () => {
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
</script>

<style scoped>
</style>