<script setup>
import { ref, onMounted } from 'vue';
import HeartPuzzle from './components/HeartPuzzle.vue';
import Welcome from './components/Welcome.vue';
import MemoryJar from './components/MemoryJar.vue';
import MusicPlayer from './components/MusicPlayer.vue';
import WelcomeOverlay from './components/WelcomeOverlay.vue';
import TrainGallery from './components/TrainGallery.vue';

// Track if the overlay has been closed
const overlayHasBeenClosed = ref(false);

// Handle overlay close event
function handleOverlayClose() {
  // Ensure we're at the top of the page
  window.scrollTo({ top: 0, behavior: 'instant' });
  
  // Set overlay as closed to reveal content
  overlayHasBeenClosed.value = true;
  
  // Refresh scroll reveal to detect newly added content
  import('./utils/scrollReveal').then(module => {
    setTimeout(() => {
      module.refreshScrollReveal();
    }, 200);
  });
}
</script>

<template>
  <WelcomeOverlay @overlay-close="handleOverlayClose" />
  
  <main>
    <div v-if="overlayHasBeenClosed">
      <Welcome v-scroll-reveal/>
    </div>
    
    <div v-if="overlayHasBeenClosed">
      <HeartPuzzle v-scroll-reveal/>
    </div>
    
    <div v-if="overlayHasBeenClosed">
      <MemoryJar v-scroll-reveal/>
    </div>
    
    <div v-if="overlayHasBeenClosed">
      <TrainGallery v-scroll-reveal/>
    </div>
  </main>
  
  <MusicPlayer v-if="overlayHasBeenClosed" v-scroll-reveal/>
</template>

<style>
.section-hidden {
  opacity: 0;
  transform: translateY(30px);
  transition: opacity 0.8s ease, transform 0.8s ease;
}

.section-visible {
  opacity: 1;
  transform: translateY(0);
  transition: opacity 0.8s ease, transform 0.8s ease;
}
</style>
