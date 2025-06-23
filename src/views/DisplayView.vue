<template>
  <ChatDisplay 
    :targetUser="targetUser" 
    :channel="channel" 
    :typingSpeed="typingSpeed"
    :fontSize="fontSize"
    :fontColor="fontColor"
    :fontWeight="fontWeight"
    :messageDuration="messageDuration"
  />
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import ChatDisplay from '@/components/ChatDisplay.vue'

const userInfo = ref<any>(null)
const targetUser = ref('')
const channel = ref('')
const typingSpeed = ref(50);
const fontSize = ref(12);
const fontColor = ref('#000000')
const fontWeight = ref('normal')
const messageDuration = ref(0);

onMounted(async () => {
  const query = new URLSearchParams(location.search);
  typingSpeed.value = Number.isNaN(parseInt(query.get('typingSpeed') || ''))
    ? 50 : parseInt(query.get('typingSpeed') || '');
  fontSize.value = Number.isNaN(parseInt(query.get('fontSize') || ''))
    ? 12 : parseInt(query.get('fontSize') || '');  
  targetUser.value = query.get('user') || userInfo?.value.display_name || ''
  channel.value = query.get('channel') || userInfo?.value.login || ''
  fontColor.value = query.get('fontColor') || '#000000'
  fontWeight.value = query.get('fontWeight') || 'normal'
  messageDuration.value = Number.isNaN(parseInt(query.get('messageDuration') || ''))
    ? 0 : parseInt(query.get('messageDuration') || '');
})
</script>

<style scoped>
</style>