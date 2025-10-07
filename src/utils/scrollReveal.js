/**
 * Utility to handle scroll reveal animations
 */

let observer = null;

// Set up Intersection Observer for scroll animations
export function setupScrollReveal() {
  // Clean up existing observer if it exists
  if (observer) {
    observer.disconnect();
    observer = null;
  }

  // Options for the observer
  const options = {
    root: null, // Use the viewport as the root
    rootMargin: '0px 0px -100px 0px', // Trigger slightly before element is in view
    threshold: 0.15 // Trigger when at least 15% of the element is visible
  };

  // Create the observer
  observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      // Add animation class when element enters viewport
      if (entry.isIntersecting) {
        entry.target.classList.add('animate');
        
        // Also reveal nested elements with the animate-item class
        const animateItems = entry.target.querySelectorAll('.animate-item');
        if (animateItems.length > 0) {
          animateItems.forEach((item, index) => {
            // Add staggered animation to nested items
            setTimeout(() => {
              item.classList.add('visible');
            }, index * 150);
          });
        }
        
        // Stop observing after animation is triggered (one-time animation)
        observer.unobserve(entry.target);
      }
    });
  }, options);

  // Observe all elements with scroll-reveal class
  const elements = document.querySelectorAll('.scroll-reveal');
  
  console.log(`Found ${elements.length} scroll-reveal elements to observe`);
  
  elements.forEach(element => {
    // Reset by removing animate class first (in case it was previously added)
    element.classList.remove('animate');
    
    // Reset any nested animate-items
    const animateItems = element.querySelectorAll('.animate-item');
    animateItems.forEach(item => {
      item.classList.remove('visible');
    });
    
    // Start observing
    observer.observe(element);
  });

  return observer;
}

// Create a function to handle dynamic content
export function refreshScrollReveal() {
  // Wait a bit to ensure DOM is updated
  setTimeout(() => {
    setupScrollReveal();
  }, 200);
}

// Initial setup on script load
if (typeof window !== 'undefined') {
  window.addEventListener('load', setupScrollReveal);
  window.addEventListener('resize', refreshScrollReveal);
  
  // Also trigger after a short delay in case DOM is already loaded
  setTimeout(setupScrollReveal, 100);
}