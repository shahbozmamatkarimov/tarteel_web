<template>
  <nav class="shadow bg-white fixed top-0 w-full  p-[0.833vw] flex justify-between items-center gap-10">
    <button><img src="@/assets/svg/nav/menu.svg" alt=""></button>
    <div class="flex items-center gap2">
      <button><img src="@/assets/svg/nav/saved.svg" alt=""></button>
      <button><img src="@/assets/svg/nav/notification.svg" alt=""></button>
      <button><img src="@/assets/svg/nav/settings.svg" alt=""></button>
    </div>
  </nav>
  <main>
    <section class="text-center py-[64px]">
      <h2 class="text-xl font-bold mb-[0.208vw]">🎙 Quran Recitation Checker</h2>
      <p class="text-gray-700 mb-[0.208vw]">Try reciting the Ayah below:</p>
      <ol>
        <li class="text-end" v-for="(ayah, ayah_index) in ayah.ayahs">
          <ul class="flex gap-1" dir="auto">
            <li v-if="checkWords[ayah_index]?.length && transcript.length"
              :class="i.status == 'correct' ? 'green' : 'red'" v-for="i in checkWords[ayah_index]">
              {{ i.word }}
            </li>
            <li v-else v-for="(i, index) in ayah.text.split(' ')">
              <span>
                {{ i }}
              </span>
            </li>
          </ul>
        </li>
      </ol>
      <p class="mt-[0.833vw] text-gray-600">Transcribed: "{{ transcript }}"</p>
      {{ checkWords }}
    </section>
  </main>
  <footer class="shadow bg-white fixed bottom-0 w-full  p-[0.833vw] flex justify-between items-center gap-10">
    <div class="flex gap2">
      <button><img src="@/assets/svg/footer/show.svg" alt=""></button>
      <button><img src="@/assets/svg/footer/hide.svg" alt=""></button>
      <button><img src="@/assets/svg/footer/arrow.svg" alt=""></button>
      <button><img src="@/assets/svg/footer/darrow.svg" alt=""></button>
    </div>
    <div class="flex gap2 recording-container">
      <button v-if="!isListening" @click="startListening"><img src="@/assets/svg/footer/unmutemic.svg" alt=""></button>
      <div v-else class="relative flex items-center justify-center">
        <button @click="stopListening"><img src="@/assets/svg/footer/mic.svg" alt=""></button>
        <p @click="stopListening" :style="{
          transform: 'scale(' + scaleValue + ')',
          opacity: +opacityValue * 5,
          border: `${opacityValue * 400}px solid red`,
        }" class="absolute rounded-full cursor-pointer"></p>
      </div>
    </div>
  </footer>
</template>

<script setup>
import { useSpeechRecognition } from "~/composables/useSpeechRecognition";
import { compareText } from "~/utils/compareText";
import { ref, computed, watchEffect } from "vue";
// import { getPage } from "~/api/pages";
// import { apiRequest }

const { transcript, isListening, startListening, stopListening, scaleValue, opacityValue } = useSpeechRecognition();

const ayah = ref(""); // Example ayah
const currentIndex = ref(0);
const currentLength = ref(0);
// Using a computed property for words
// const words = computed(async () => await compareText(ayah, transcript.value));

// Instead of using watch, use watchEffect to reactively update checkWords
const checkWords = ref({});
watch(() => transcript.value, () => {
  // setTimeout(() => {
  let changeTranscript = transcript.value;
  changeTranscript = changeTranscript.trim()?.split(" ");
  changeTranscript = changeTranscript.filter(str => str.trim() !== '');
  console.log(changeTranscript.slice(currentLength.value)?.join(' '), 2303);
  changeTranscript = changeTranscript.slice(currentLength.value)?.join(' ');
  let comparedText = compareText(ayah.value, changeTranscript, currentIndex.value, currentLength.value)
  if (comparedText) {
    checkWords.value[currentIndex.value] = comparedText[currentIndex.value];
    currentIndex.value = comparedText.index;
    if (comparedText.length > 0) {
      currentLength.value += comparedText.length;
    }
  }
  // }, 5000);
});

onBeforeMount(async () => {
  ayah.value = await apiRequest({
    url: `page/1/quran-uthmani`,
    method: 'get',
  });;
  console.log(ayah.value);
})
</script>

<style lang="scss" scoped>
.red {
  color: red;
}

.green {
  color: green;
}

.ayah {
  display: flex;
}

.shadow {
  --shadow:
    0rem .9rem 1rem hsl(0 0% 100% / .75),
    0rem .1rem 1rem hsl(0 0% 85% / .5);
  box-shadow: var(--shadow);
}
</style>
