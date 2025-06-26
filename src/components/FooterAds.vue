<template lang="pug">
div.ads(v-show="showAd")
    ins(
        class="adsbygoogle ad-slot"
        data-ad-client="ca-pub-1999180837314551"
        data-ad-slot="2096344944"
        data-ad-format="auto"
        data-full-width-responsive="true"
    )
</template>
    
<script setup lang="ts">  
import { onMounted, watch, ref} from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const showAd = ref(true)

const loadAds = () => {
    
    // 檢查是否已經載入過 Google Ads 的腳本
    if (!document.getElementById("adsbygoogleaftermount")) {
      const script = document.createElement("script")
      script.id = "adsbygoogleaftermount"
      script.type = "text/javascript"
      script.async = true
      script.src = "https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js"
      document.head.appendChild(script)
    }

    // push ad
    window.adsbygoogle = window.adsbygoogle || []
    window.adsbygoogle.push({})

    setTimeout(() => {
        const adslot = document.querySelector('.adsbygoogle') as HTMLElement
        const adStatus = adslot.getAttribute('data-ad-status')
        if (!adStatus || adStatus !== 'filled') {
            // 沒載入成功，縮回廣告區域
            showAd.value = false
        }}, 3000)
  }

onMounted(() => {
  loadAds();
});
</script>
    
<style scoped>
.ads {
  /* background-color: black; */
  margin: 20px 0;
  overflow: hidden;
  display: flex;
  justify-content: center;
  max-width: 100%;
}

/* 預設樣式 */
.ad-slot {
  width: 300px;
  height: 200px;
  display: block;
}

@media (max-width: 360px) {
  .ad-slot {
    display: none;
  }
}

@media (min-width: 530px){
  .ad-slot {
    display: block;
    height: 100px;
    width: 468px
  }
}

@media (min-width: 790px){
  .ad-slot {
    display: block;
    height: 90px;
    width: 728px
  }
}

@media (min-width: 1030px) {
  .ad-slot {
    display: block;
    height: 90px;
    width: 970px
  }
}
</style>
    