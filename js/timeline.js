document.addEventListener('DOMContentLoaded', function() {
  // Initialize timeline items with their types
  const timelineItems = document.querySelectorAll('.timeline-item');
  
  // Add event listeners to filter buttons
  const filterButtons = document.querySelectorAll('.timeline-filter-btn');
  
  function filterTimeline(filter) {
    // Update active button
    filterButtons.forEach(btn => {
      if (btn.getAttribute('data-filter') === filter) {
        btn.classList.add('active');
      } else {
        btn.classList.remove('active');
      }
    });
    
    // Filter items
    timelineItems.forEach(item => {
      const itemType = item.getAttribute('data-type');
      
      if (filter === 'all' || itemType === filter) {
        item.style.display = 'block';
        item.classList.add('visible');
      } else {
        item.style.display = 'none';
        item.classList.remove('visible');
      }
    });
    
    // Re-apply animations for visible items
    const visibleItems = document.querySelectorAll(`.timeline-item[data-type="${filter}"], .timeline-item[data-type="${filter === 'all' ? 'work' : filter}"], .timeline-item[data-type="${filter === 'all' ? 'education' : filter}"]`);
    visibleItems.forEach(item => {
      item.style.animation = 'none';
      item.offsetHeight; // Trigger reflow
      item.style.animation = null;
    });
  }
  
  // Add click handlers to filter buttons
  filterButtons.forEach(button => {
    button.addEventListener('click', function() {
      const filter = this.getAttribute('data-filter');
      filterTimeline(filter);
    });
  });
  
  // Set initial state (show all)
  filterTimeline('all');
  
  // Add intersection observer for scroll animations
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  }, {
    threshold: 0.1
  });
  
  // Observe all timeline items
  timelineItems.forEach(item => {
    observer.observe(item);
  });
});
