<template>
  <ChatDisplay 
    :targetUser="targetUser" 
    :channel="channel" 
    :typingSpeed="typingSpeed"
    :fontSize="fontSize"
    :fontColor="fontColor"
    :fontWeight="fontWeight"
    :lastMessageDuration="lastMessageDuration"
  />
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import ChatDisplay from '@/components/ChatDisplay.vue'

const targetUser = ref('')
const channel = ref('')
const typingSpeed = ref(50);
const fontSize = ref(12);
const fontColor = ref('#000000')
const fontWeight = ref('normal')
const lastMessageDuration = ref(0);

onMounted(async () => {
  const query = new URLSearchParams(location.search);
  typingSpeed.value = Number.isNaN(parseInt(query.get('typingSpeed') || ''))
    ? 50 : parseInt(query.get('typingSpeed') || '');
  fontSize.value = Number.isNaN(parseInt(query.get('fontSize') || ''))
    ? 12 : parseInt(query.get('fontSize') || '');  
  targetUser.value = query.get('user') || ''
  channel.value = query.get('channel') || ''
  fontColor.value = query.get('fontColor') || '#000000'
  fontWeight.value = query.get('fontWeight') || 'normal'
  lastMessageDuration.value = Number.isNaN(parseInt(query.get('lastMessageDuration') || ''))
    ? 0 : parseInt(query.get('lastMessageDuration') || '');
})
</script>

<style scoped>
</style>