<template>
  <div>
    <input v-model="text" placeholder="Matn kiriting" />
    <button @click="playAudio">🔊 Ovoz chiqar</button>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const text = ref('')

const playAudio = () => {
  if (!text.value.trim()) return

  // Max: ~200 characters, Google TTS doesn't support long text in this endpoint
  const baseUrl = 'https://translate.google.com/translate_tts'
  const url = `${baseUrl}?ie=UTF-8&q=${encodeURIComponent(text.value)}&tl=uz&client=tw-ob`

  const audio = new Audio(url)
  audio.play().catch(err => {
    console.error('Audio play failed:', err)
    alert('Ovoz chiqarib bo‘lmadi. Iltimos, boshqa brauzerda urinib ko‘ring.')
  })
}
</script>
