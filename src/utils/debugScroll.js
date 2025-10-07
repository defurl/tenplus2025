/**
 * Debug utility for scroll reveal animations
 */

// This function can be called from the browser console to debug scroll reveal issues
export function debugScrollReveal() {
  // Find all scroll-reveal elements
  const revealElements = document.querySelectorAll('.scroll-reveal');
  console.log(`Found ${revealElements.length} scroll-reveal elements`);
  
  // Add debug class to visualize them
  revealElements.forEach((el, index) => {
    el.classList.add('scroll-reveal-debug');
    console.log(`Element ${index}:`, el, 
      `Has animate class: ${el.classList.contains('animate')}`,
      `Is visible: ${isElementInViewport(el)}`);
  });
  
  // Create a log for elements with animate class
  const animatedElements = document.querySelectorAll('.animate');
  console.log(`Found ${animatedElements.length} animated elements`);
  
  return {
    revealElements,
    animatedElements
  };
}

// Helper function to check if element is in viewport
function isElementInViewport(el) {
  const rect = el.getBoundingClientRect();
  
  return (
    rect.top >= 0 &&
    rect.left >= 0 &&
    rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
    rect.right <= (window.innerWidth || document.documentElement.clientWidth)
  );
}

// Add to window for console access
if (typeof window !== 'undefined') {
  window.debugScrollReveal = debugScrollReveal;
}