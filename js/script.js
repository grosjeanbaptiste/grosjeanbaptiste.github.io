// Global error handler
// Gestionnaire d'erreur global
window.onerror = function(message, source, lineno, colno, error) {
  console.error('Global error:', { message, source, lineno, colno, error });
  // Ensure loading screen is hidden in case of error
  document.body.classList.remove('loading');
  document.body.classList.add('loaded');
  return true; // Prevent default error handling
};

// Gestionnaire pour les promesses non gérées
window.addEventListener('unhandledrejection', function(event) {
  console.error('Promesse rejetée non gérée:', event.reason);
  console.error('Stack:', event.reason?.stack);
});

console.log('Script loaded');

// Simple script to hide loading screen
document.addEventListener('DOMContentLoaded', function() {
  console.log('DOM fully loaded');
  
  // Hide loading screen immediately
  console.log('Removing loading class from body');
  document.body.classList.remove('loading');
  document.body.classList.add('loaded');
  
  // Remove loading screen from DOM after a short delay
  setTimeout(function() {
    console.log('Attempting to remove loading screen');
    const loadingScreen = document.querySelector('.loading');
    console.log('Loading screen element:', loadingScreen);
    
    if (loadingScreen) {
      console.log('Loading screen parent:', loadingScreen.parentNode);
      if (loadingScreen.parentNode) {
        loadingScreen.style.opacity = '0';
        loadingScreen.style.visibility = 'hidden';
        
        // Remove after fade out
        setTimeout(() => {
          loadingScreen.parentNode.removeChild(loadingScreen);
          console.log('Loading screen removed from DOM');
        }, 500);
      }
    } else {
      console.log('No loading screen element found');
    }
  }, 1000);
  
  // Initialize mobile menu toggle
  console.log('Initializing mobile menu');
  const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
  const navMenu = document.querySelector('.nav-menu');
  const navLinks = document.querySelectorAll('.nav-link');
  
  console.log('Mobile menu elements:', { mobileMenuBtn, navMenu, navLinks });
  
  if (mobileMenuBtn && navMenu) {
    mobileMenuBtn.addEventListener('click', function() {
      navMenu.classList.toggle('active');
      const expanded = navMenu.classList.contains('active');
      mobileMenuBtn.setAttribute('aria-expanded', expanded);
    });
    
    // Close mobile menu when clicking on a nav link
    navLinks.forEach(function(link) {
      link.addEventListener('click', function() {
        navMenu.classList.remove('active');
        mobileMenuBtn.setAttribute('aria-expanded', 'false');
      });
    });
  }
});

// Theme Toggle
const userPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
const currentTheme = localStorage.getItem('theme') || (userPrefersDark ? 'dark' : 'light');

const setTheme = (theme) => {
  html.setAttribute('data-theme', theme);
  localStorage.setItem('theme', theme);
  
  // Update theme toggle icon
  const icon = themeToggle?.querySelector('i');
  if (icon) {
    icon.className = theme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
  }
};

// Initialize theme
setTheme(currentTheme);

// Toggle theme
if (themeToggle) {
  themeToggle.addEventListener('click', () => {
    const currentTheme = html.getAttribute('data-theme');
    setTheme(currentTheme === 'dark' ? 'light' : 'dark');
  });
}

// Back to Top Button
window.addEventListener('scroll', () => {
  if (window.pageYOffset > 300) {
    backToTopBtn?.classList.add('show');
  } else {
    backToTopBtn?.classList.remove('show');
  }
});

backToTopBtn?.addEventListener('click', (e) => {
  e.preventDefault();
  window.scrollTo({
    top: 0,
    behavior: 'smooth'
  });
});

// Download CV as PDF
if (downloadCVBtn) {
  downloadCVBtn.addEventListener('click', () => {
    const element = document.documentElement;
    const opt = {
      margin: 10,
      filename: 'Baptiste-Grosjean-CV.pdf',
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
    };

    // Show loading state
    downloadCVBtn.disabled = true;
    downloadCVBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Generating PDF...';

    // Generate PDF
    html2pdf()
      .set(opt)
      .from(element)
      .save()
      .finally(() => {
        // Reset button state
        downloadCVBtn.disabled = false;
        downloadCVBtn.innerHTML = '<i class="fas fa-download"></i> Download CV';
      });
  });
}

// Scroll progress indicator
function updateScrollProgress() {
  const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
  const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
  const scrolled = (winScroll / height) * 100;
  scrollProgress.style.width = scrolled + '%';
}

// Smooth scrolling for anchor links with offset
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    e.preventDefault();
    
    const targetId = this.getAttribute('href');
    if (targetId === '#') return;
    
    const targetElement = document.querySelector(targetId);
    if (!targetElement) return;
    
    const headerOffset = 100; // Height of fixed header + some padding
    const elementPosition = targetElement.getBoundingClientRect().top;
    const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
    
    window.scrollTo({
      top: offsetPosition,
      behavior: 'smooth'
    });
    
    // Close mobile menu if open
    if (navMenu.classList.contains('active')) {
      navMenu.classList.remove('active');
      mobileMenuBtn.setAttribute('aria-expanded', 'false');
    }
  });
});

// Active link highlighting on scroll
const sections = document.querySelectorAll('section[id]');

window.addEventListener('scroll', () => {
  let current = '';
  
  sections.forEach(section => {
    const sectionTop = section.offsetTop - 100;
    const sectionHeight = section.offsetHeight;
    
    if (window.pageYOffset >= sectionTop && window.pageYOffset < sectionTop + sectionHeight) {
      current = `#${section.getAttribute('id')}`;
    }
  });
  
  navLinks.forEach(link => {
    link.classList.remove('active');
    if (link.getAttribute('href') === current) {
      link.classList.add('active');
    }
  });
});

// Contact Form Handling
document.addEventListener('DOMContentLoaded', function() {
  const contactForm = document.getElementById('contactForm');
  if (contactForm) {
    contactForm.addEventListener('submit', async function(e) {
      e.preventDefault();
      
      const formData = new FormData(contactForm);
      const submitButton = contactForm.querySelector('button[type="submit"]');
      const originalButtonText = submitButton.innerHTML;
      const messageDiv = document.getElementById('formMessage');
      
      // Disable submit button and show loading state
      submitButton.disabled = true;
      submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
      messageDiv.style.display = 'none';
      
      try {
        // Simulate form submission (replace with actual fetch/axios call)
        // In a real implementation, you would send the form data to your server
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        // Show success message
        messageDiv.className = 'form-message success';
        messageDiv.textContent = 'Your message has been sent successfully! I\'ll get back to you soon.';
        messageDiv.style.display = 'block';
        
        // Reset form
        contactForm.reset();
        
        // Scroll to message
        messageDiv.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      } catch (error) {
        // Show error message
        messageDiv.className = 'form-message error';
        messageDiv.textContent = 'Oops! Something went wrong. Please try again later or contact me directly via email.';
        messageDiv.style.display = 'block';
        console.error('Form submission error:', error);
      } finally {
        // Re-enable submit button and restore original text
        submitButton.disabled = false;
        submitButton.innerHTML = originalButtonText;
      }
    });
  }
});

// Navbar scroll effect
window.addEventListener('scroll', function() {
  const navbar = document.querySelector('.navbar');
  if (window.scrollY > 50) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }
});

// Initialize tooltips
const initTooltips = () => {
  const tooltipElements = document.querySelectorAll('[data-tooltip]');
  
  tooltipElements.forEach(el => {
    const tooltip = document.createElement('span');
    tooltip.className = 'tooltip';
    tooltip.textContent = el.getAttribute('data-tooltip');
    el.appendChild(tooltip);
    
    el.addEventListener('mouseenter', () => {
      tooltip.classList.add('show');
    });
    
    el.addEventListener('mouseleave', () => {
      tooltip.classList.remove('show');
    });
  });
};

// Enhanced Scroll Reveal Animation with Intersection Observer
const animateOnScroll = () => {
  const elements = document.querySelectorAll('.reveal');
  
  // Use Intersection Observer for better performance
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        // Optional: Unobserve after animation
        // observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.1, // Trigger when 10% of the element is visible
    rootMargin: '0px 0px -50px 0px' // Adjust when the animation triggers
  });

  // Observe all reveal elements
  
  elements.forEach(element => {
    observer.observe(element);
  });
};

// Simple function to hide loading screen
function hideLoadingScreen() {
  const loadingScreen = document.querySelector('.loading');
  if (loadingScreen) {
    loadingScreen.style.opacity = '0';
    loadingScreen.style.visibility = 'hidden';
    
    // Remove from DOM after animation
    setTimeout(() => {
      if (loadingScreen.parentNode) {
        loadingScreen.parentNode.removeChild(loadingScreen);
      }
    }, 500);
  }
  
  // Ensure body classes are set correctly
  document.body.classList.remove('loading');
  document.body.classList.add('loaded');
  document.body.style.overflow = 'auto';
}

// Initialize on DOM content loaded
document.addEventListener('DOMContentLoaded', () => {
  // Initialize DataLoader if it exists
  if (typeof DataLoader !== 'undefined') {
    console.log('Initializing DataLoader...');
    const dataLoader = new DataLoader();
    dataLoader.init();
  } else {
    console.warn('DataLoader is not defined. Make sure data-loader.js is loaded.');
  }

  // Simple initialization
  try {
    // Initialize components
    if (typeof initTooltips === 'function') initTooltips();
    if (typeof animateOnScroll === 'function') animateOnScroll();
    
    // Add scroll event for progress bar
    if (typeof updateScrollProgress === 'function') {
      window.addEventListener('scroll', updateScrollProgress, { passive: true });
    }
    
    // Hide loading screen
    const loadingScreen = document.querySelector('.loading');
    if (loadingScreen) {
      loadingScreen.style.opacity = '0';
      loadingScreen.style.visibility = 'hidden';
      document.body.classList.remove('loading');
      document.body.classList.add('loaded');
      
      // Remove from DOM after animation
      setTimeout(() => {
        if (loadingScreen.parentNode) {
          loadingScreen.parentNode.removeChild(loadingScreen);
        }
      }, 500);
    }
    
    // Initialize mobile menu toggle
    if (mobileMenuBtn && navMenu) {
      mobileMenuBtn.addEventListener('click', () => {
        navMenu.classList.toggle('active');
        const expanded = navMenu.classList.contains('active');
        mobileMenuBtn.setAttribute('aria-expanded', expanded);
      });
    }
    
    // Close mobile menu when clicking on a nav link
    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        if (navMenu) navMenu.classList.remove('active');
        if (mobileMenuBtn) mobileMenuBtn.setAttribute('aria-expanded', 'false');
      });
    });
    
  } catch (error) {
    console.error('Initialization error:', error);
    // Ensure loading screen is hidden in case of error
    document.body.classList.remove('loading');
    document.body.classList.add('loaded');
  }
  
  // Add smooth scroll behavior for anchor links
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;
      
      const targetElement = document.querySelector(targetId);
      if (!targetElement) return;
      
      e.preventDefault();
      
      const headerOffset = 100;
      const elementPosition = targetElement.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
      
      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
      
      // Update URL without jumping
      history.pushState(null, null, targetId);
    });
  });
});

// Initialize on DOM content loaded
document.addEventListener('DOMContentLoaded', () => {
  // Initial progress update
  updateLoadingProgress(30);
  // Set initial theme
  const currentTheme = localStorage.getItem('theme') || 'light';
  setTheme(currentTheme);
  
  // Initialize components
  initTooltips();
  
  // Add animation delay to project cards
  document.querySelectorAll('.project-card').forEach((card, index) => {
    card.style.transitionDelay = `${index * 100}ms`;
  });
  
  // Update progress after components are initialized
  updateLoadingProgress(60);
  
  // Initialize animations after a short delay to allow for initial render
  setTimeout(() => {
    animateOnScroll();
    
    // Final progress update when animations are initialized
    setTimeout(() => {
      updateLoadingProgress(90);
    }, 200);
  }, 100);
  
  // Set current year in footer
  const yearElement = document.getElementById('current-year');
  if (yearElement) {
    yearElement.textContent = new Date().getFullYear();
  }
  
  // Add animation classes to elements with data-animate attribute
  document.querySelectorAll('[data-animate]').forEach(el => {
    const animation = el.getAttribute('data-animate');
    el.classList.add(animation);
    
    // Add delay if specified
    const delay = el.getAttribute('data-delay');
    if (delay) {
      el.style.animationDelay = delay;
    }
  });
  
  // Initialize AOS (Animate On Scroll)
  if (typeof AOS !== 'undefined') {
    AOS.init({
      duration: 800,
      once: true,
      easing: 'ease-out-cubic'
    });
  }
});

// Re-run animations when navigating between pages with turbolinks/pjax
if (typeof Turbo !== 'undefined') {
  document.addEventListener('turbo:load', () => {
    animateOnScroll();
  });
}
