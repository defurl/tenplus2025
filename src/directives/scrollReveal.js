import { setupScrollReveal, refreshScrollReveal } from '../utils/scrollReveal';

export const vScrollReveal = {
  mounted(el, binding) {
    // Add scroll-reveal class if not present
    if (!el.classList.contains('scroll-reveal')) {
      el.classList.add('scroll-reveal');
    }
    
    // Apply any custom classes from directive value
    if (binding.value) {
      if (binding.value.fromDirection === 'left') {
        el.querySelectorAll('.animate-item').forEach(item => {
          item.classList.add('animate-from-left');
        });
      } else if (binding.value.fromDirection === 'right') {
        el.querySelectorAll('.animate-item').forEach(item => {
          item.classList.add('animate-from-right');
        });
      }
    }
    
    // Force refresh scroll reveal
    setTimeout(() => {
      setupScrollReveal();
    }, 100);
  },
  updated() {
    // Refresh when component updates
    setTimeout(() => {
      refreshScrollReveal();
    }, 100);
  }
};