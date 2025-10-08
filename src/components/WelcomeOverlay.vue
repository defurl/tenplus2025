<template>
  <Transition name="overlay">
    <div v-if="isVisible" class="welcome-overlay">
      <div class="overlay-content">
        <h1 class="fancy-font fade-in">Welcome,</h1>
        <p class="fancy-font subtitle fade-in">ready to relive tenplus?</p>
        <button @click="startTransition" class="enter-button fancy-font fade-in">
          Explore
        </button>
      </div>
    </div>
  </Transition>
</template>

<script setup>
import { ref, watch, onMounted, onBeforeUnmount } from 'vue';

const isVisible = ref(true);
const emit = defineEmits(['overlayClose']);

// Function to prevent scrolling
function preventScroll() {
  document.body.style.overflow = 'hidden';
}

// Function to allow scrolling
function allowScroll() {
  document.body.style.overflow = 'auto';
}

// Watch for visibility changes
watch(isVisible, (newValue) => {
  if (newValue) {
    preventScroll();
  } else {
    allowScroll();
  }
});

// Set up scroll prevention on mount
onMounted(() => {
  preventScroll();
});

// Clean up on unmount
onBeforeUnmount(() => {
  allowScroll();
});

function startTransition() {
  // Scroll to top before transition starts
  window.scrollTo({ top: 0, behavior: 'instant' });
  
  // Hide overlay
  isVisible.value = false;
  
  // Emit overlay close event after transition completes
  setTimeout(() => {
    // Force one more scroll to top just before emitting
    window.scrollTo({ top: 0, behavior: 'instant' });
    emit('overlayClose');
  }, 1500);
}
</script>

<style scoped>
.welcome-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(107, 79, 79, 1);
  z-index: 1000;
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
}

/* Vue transition classes */
.overlay-enter-active,
.overlay-leave-active {
  transition: opacity 1.2s ease;
}

.overlay-enter-from,
.overlay-leave-to {
  opacity: 0;
}

.overlay-content {
  padding: 2rem;
}

.overlay-content h1 {
  font-size: 4rem;
  color: #F5EFE6;
  margin-bottom: 1rem;
}

.overlay-content .subtitle {
  font-size: 2.5rem;
  color: #F5EFE6;
  margin-bottom: 3rem;
  opacity: 1;
}

.enter-button {
  background-color: transparent;
  border: 2px solid #F5EFE6;
  color: #F5EFE6;
  padding: 0.75rem 2.5rem;
  font-size: 1.75rem;
  cursor: pointer;
  transition: all 0.3s ease;
  border-radius: 4px;
}

.enter-button:hover {
  background-color: #F5EFE6;
  color: #6B4F4F;
  transform: scale(1.05);
}

@media (min-width: 768px) {
  .overlay-content h1 {
    font-size: 6rem;
  }
  
  .overlay-content .subtitle {
    font-size: 3.5rem;
  }
}
</style>