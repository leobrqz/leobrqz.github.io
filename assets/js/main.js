const SIDEBAR_BREAKPOINT_PX = 1024;

document.addEventListener('DOMContentLoaded', function() {
    initSidebarNavigation();
    initTOC();

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

function initSidebarNavigation() {
    const sidebar = document.querySelector('.sidebar');
    const collapseToggle = document.querySelector('.sidebar-toggle');
    const collapseIcon = document.querySelector('.sidebar-toggle-icon');
    const menuButton = document.getElementById('sidebar-menu-btn');
    const menuIcon = menuButton ? menuButton.querySelector('.sidebar-menu-icon') : null;
    const overlay = document.getElementById('sidebar-overlay');
    const navLinks = document.querySelectorAll('.sidebar .nav-link');
    const body = document.body;
    const root = document.documentElement;
    const wideViewportQuery = window.matchMedia(`(min-width: ${SIDEBAR_BREAKPOINT_PX}px)`);
    if (!sidebar || !root) return;

    const COLLAPSE_ICON_EXPANDED = 'fa-chevron-left';
    const COLLAPSE_ICON_COLLAPSED = 'fa-chevron-right';
    const MENU_ICON_CLOSED = 'fa-bars';
    const MENU_ICON_OPEN = 'fa-xmark';
    const STORAGE_KEY = 'sidebarCollapsed';

    function setCollapsed(collapsed) {
        if (!wideViewportQuery.matches) {
            sidebar.classList.remove('sidebar--collapsed');
            root.classList.remove('sidebar-collapsed');
            if (collapseIcon) {
                collapseIcon.classList.remove(COLLAPSE_ICON_COLLAPSED);
                collapseIcon.classList.add(COLLAPSE_ICON_EXPANDED);
            }
            if (collapseToggle) {
                collapseToggle.setAttribute('aria-expanded', 'true');
            }
            return;
        }

        if (collapsed) {
            sidebar.classList.add('sidebar--collapsed');
            root.classList.add('sidebar-collapsed');
            if (collapseIcon) {
                collapseIcon.classList.remove(COLLAPSE_ICON_EXPANDED);
                collapseIcon.classList.add(COLLAPSE_ICON_COLLAPSED);
            }
            if (collapseToggle) {
                collapseToggle.setAttribute('aria-expanded', 'false');
            }
        } else {
            sidebar.classList.remove('sidebar--collapsed');
            root.classList.remove('sidebar-collapsed');
            if (collapseIcon) {
                collapseIcon.classList.remove(COLLAPSE_ICON_COLLAPSED);
                collapseIcon.classList.add(COLLAPSE_ICON_EXPANDED);
            }
            if (collapseToggle) {
                collapseToggle.setAttribute('aria-expanded', 'true');
            }
        }
        try {
            localStorage.setItem(STORAGE_KEY, String(collapsed));
        } catch (e) {}
    }

    function setDrawerOpen(open) {
        const isOpen = Boolean(open) && !wideViewportQuery.matches;
        body.classList.toggle('sidebar-open', isOpen);

        if (menuButton) {
            menuButton.setAttribute('aria-expanded', String(isOpen));
            menuButton.setAttribute('aria-label', isOpen ? 'Close navigation menu' : 'Open navigation menu');
            menuButton.setAttribute('title', isOpen ? 'Close navigation menu' : 'Open navigation menu');
        }

        if (overlay) {
            overlay.setAttribute('aria-hidden', String(!isOpen));
        }

        if (menuIcon) {
            menuIcon.classList.remove(isOpen ? MENU_ICON_CLOSED : MENU_ICON_OPEN);
            menuIcon.classList.add(isOpen ? MENU_ICON_OPEN : MENU_ICON_CLOSED);
        }
    }

    let savedCollapsed = false;
    try {
        savedCollapsed = localStorage.getItem(STORAGE_KEY) === 'true';
    } catch (e) {
        savedCollapsed = false;
    }

    function syncSidebarMode() {
        if (wideViewportQuery.matches) {
            setDrawerOpen(false);
            setCollapsed(savedCollapsed);
            return;
        }

        setDrawerOpen(false);
        setCollapsed(false);
    }

    if (collapseToggle) {
        collapseToggle.addEventListener('click', function() {
            if (!wideViewportQuery.matches) return;

            const collapsed = sidebar.classList.contains('sidebar--collapsed');
            const nextCollapsed = !collapsed;
            savedCollapsed = nextCollapsed;
            setCollapsed(nextCollapsed);
        });
    }

    if (menuButton) {
        menuButton.addEventListener('click', function() {
            if (wideViewportQuery.matches) return;
            setDrawerOpen(!body.classList.contains('sidebar-open'));
        });
    }

    if (overlay) {
        overlay.addEventListener('click', function() {
            setDrawerOpen(false);
        });
    }

    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            if (!wideViewportQuery.matches) {
                setDrawerOpen(false);
            }
        });
    });

    document.addEventListener('keydown', function(event) {
        if (event.key === 'Escape' && body.classList.contains('sidebar-open')) {
            setDrawerOpen(false);
        }
    });

    if (typeof wideViewportQuery.addEventListener === 'function') {
        wideViewportQuery.addEventListener('change', syncSidebarMode);
    } else if (typeof wideViewportQuery.addListener === 'function') {
        wideViewportQuery.addListener(syncSidebarMode);
    }

    syncSidebarMode();
}

// TOC functionality
let tocScrollHandler = null;
let tocCurrentActive = null;
let tocTicking = false;

function initTOC() {
    const tocLinks = document.querySelectorAll('.toc-link:not([data-toc-initialized])');
    if (tocLinks.length === 0) return;
    
    tocLinks.forEach(link => {
        link.setAttribute('data-toc-initialized', 'true');
        
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href').substring(1);
            const target = document.getElementById(targetId);
            if (target) {
                const offset = 80;
                const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - offset;
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
    
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
            
            const scrollPos = window.scrollY + 100;
            const windowHeight = window.innerHeight;
            const documentHeight = document.documentElement.scrollHeight;
            const scrollBottom = window.scrollY + windowHeight;
            
            // Find the section that's currently in view
            let activeSection = null;
            
            const isNearBottom = scrollBottom >= documentHeight - (windowHeight * 0.3);
            
            // Get the last section's position
            const lastSection = sections[sections.length - 1];
            if (lastSection) {
                const lastSectionTop = lastSection.element.offsetTop;
                const lastSectionBottom = lastSection.element.offsetTop + lastSection.element.offsetHeight;
                const lastSectionRect = lastSection.element.getBoundingClientRect();
                
                const isPastLastSectionTop = scrollPos >= lastSectionTop;
                const isLastSectionVisible = lastSectionRect.top < windowHeight && lastSectionRect.bottom > 0;
                const isAtVeryBottom = scrollBottom >= documentHeight - 50; // Within 50px of absolute bottom
                
                if (isPastLastSectionTop || isNearBottom || isAtVeryBottom || 
                    (isLastSectionVisible && scrollPos >= lastSectionTop - 200)) {
                    activeSection = lastSection.link;
                }
            }
            
            if (!activeSection) {
                for (let i = sections.length - 1; i >= 0; i--) {
                    const { element, link } = sections[i];
                    const top = element.offsetTop;
                    const rect = element.getBoundingClientRect();
                    
                    const sectionTopThreshold = top - 150;
                    
                    if (scrollPos >= sectionTopThreshold) {
                        // This handles cases where the section is small (collapsed projects)
                        if (i === sections.length - 1) {
                            activeSection = link;
                        } else {
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
        
        updateActiveSection();
    }
}
