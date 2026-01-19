// Main JavaScript file
document.addEventListener('DOMContentLoaded', function() {
    // Initialize TOC functionality
    initTOC();
    
    // Smooth scroll for anchor links (general)
    document.querySelectorAll('a[href^="#"]:not(.toc-link)').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
});

// TOC functionality - global state for scroll tracking
let tocScrollHandler = null;
let tocCurrentActive = null;
let tocTicking = false;

function initTOC() {
    const tocLinks = document.querySelectorAll('.toc-link:not([data-toc-initialized])');
    if (tocLinks.length === 0) return;
    
    // Smooth scroll on TOC link click with offset
    tocLinks.forEach(link => {
        // Mark as initialized to prevent duplicate handlers
        link.setAttribute('data-toc-initialized', 'true');
        
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href').substring(1);
            const target = document.getElementById(targetId);
            if (target) {
                const offset = 80; // Account for any fixed headers
                const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - offset;
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // Set up scroll tracking only once
    if (!tocScrollHandler) {
        function updateActiveSection() {
            const tocLinks = document.querySelectorAll('.toc-link');
            if (tocLinks.length === 0) return;
            
            const sections = Array.from(tocLinks).map(link => {
                const id = link.getAttribute('href').substring(1);
                return { 
                    id, 
                    element: document.getElementById(id), 
                    link 
                };
            }).filter(s => s.element);
            
            if (sections.length === 0) return;
            
            const scrollPos = window.scrollY + 100; // Offset for highlighting
            const windowHeight = window.innerHeight;
            const documentHeight = document.documentElement.scrollHeight;
            const scrollBottom = window.scrollY + windowHeight;
            
            // Find the section that's currently in view
            let activeSection = null;
            
            // Check if we're at or near the bottom of the page
            // Use a more generous threshold (viewport height) to catch bottom cases
            const isNearBottom = scrollBottom >= documentHeight - (windowHeight * 0.3);
            
            // Get the last section's position
            const lastSection = sections[sections.length - 1];
            if (lastSection) {
                const lastSectionTop = lastSection.element.offsetTop;
                const lastSectionBottom = lastSection.element.offsetTop + lastSection.element.offsetHeight;
                const lastSectionRect = lastSection.element.getBoundingClientRect();
                
                // More lenient detection for last section:
                // 1. If we're past the last section's top, always select it (regardless of bottom)
                // 2. If we're near the bottom of the page, select it
                // 3. If the last section is visible in viewport (even partially), select it
                const isPastLastSectionTop = scrollPos >= lastSectionTop;
                const isLastSectionVisible = lastSectionRect.top < windowHeight && lastSectionRect.bottom > 0;
                const isAtVeryBottom = scrollBottom >= documentHeight - 50; // Within 50px of absolute bottom
                
                if (isPastLastSectionTop || isNearBottom || isAtVeryBottom || 
                    (isLastSectionVisible && scrollPos >= lastSectionTop - 200)) {
                    activeSection = lastSection.link;
                }
            }
            
            // If we haven't selected the last section, do normal scroll tracking
            if (!activeSection) {
                for (let i = sections.length - 1; i >= 0; i--) {
                    const { element, link } = sections[i];
                    const top = element.offsetTop;
                    const rect = element.getBoundingClientRect();
                    
                    // Check if scroll position is past this section's top
                    // Use a more lenient check: within 150px before the top counts as being in the section
                    // This helps with collapsed projects that have small heights
                    const sectionTopThreshold = top - 150;
                    
                    if (scrollPos >= sectionTopThreshold) {
                        // If this is the last section, always select it if we're past its threshold
                        // This handles cases where the section is small (collapsed projects)
                        if (i === sections.length - 1) {
                            activeSection = link;
                        } else {
                            // Otherwise, check if we're before the next section starts
                            // Use threshold for next section too to prevent overlap
                            const nextSectionTop = sections[i + 1].element.offsetTop;
                            const nextSectionThreshold = nextSectionTop - 150;
                            if (scrollPos < nextSectionThreshold) {
                                activeSection = link;
                            }
                        }
                        break;
                    }
                }
            }
            
            // If no section is in view and we're at the top, highlight the first one
            if (!activeSection && window.scrollY < 200) {
                activeSection = sections[0]?.link;
            }
            
            // Update active state
            if (activeSection !== tocCurrentActive) {
                if (tocCurrentActive) {
                    tocCurrentActive.classList.remove('active');
                }
                if (activeSection) {
                    activeSection.classList.add('active');
                }
                tocCurrentActive = activeSection;
            }
            
            tocTicking = false;
        }
        
        // Throttle scroll events for performance
        tocScrollHandler = function() {
            if (!tocTicking) {
                window.requestAnimationFrame(updateActiveSection);
                tocTicking = true;
            }
        };
        
        window.addEventListener('scroll', tocScrollHandler);
        
        // Initial update
        updateActiveSection();
    }
}
