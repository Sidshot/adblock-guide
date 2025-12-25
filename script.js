// ============================================
// ADBLOCK GUIDE - JAVASCRIPT
// ============================================

document.addEventListener('DOMContentLoaded', function () {
    // Initialize all functionality
    initPlatformTabs();
    initBrowserTabs();
    initAccordion();
    initSmoothScroll();
    initSwitchBrowserLinks();
});

// ============================================
// PLATFORM TABS
// ============================================

function initPlatformTabs() {
    const platformTabs = document.querySelectorAll('.platform-tab');
    const platformContents = document.querySelectorAll('.platform-content');

    platformTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const platform = tab.dataset.platform;

            // Update active tab
            platformTabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');

            // Update active content
            platformContents.forEach(content => {
                content.classList.remove('active');
                if (content.id === platform) {
                    content.classList.add('active');
                }
            });

            // Scroll to platform content smoothly
            const platformSection = document.getElementById('platforms');
            if (platformSection) {
                const offset = 100;
                const elementPosition = platformSection.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - offset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// ============================================
// BROWSER TABS (within each platform)
// ============================================

function initBrowserTabs() {
    const platformContents = document.querySelectorAll('.platform-content');

    platformContents.forEach(platformContent => {
        const browserTabs = platformContent.querySelectorAll('.browser-tab');
        const browserContents = platformContent.querySelectorAll('.browser-content');

        browserTabs.forEach(tab => {
            tab.addEventListener('click', () => {
                const browser = tab.dataset.browser;

                // Update active tab within this platform
                browserTabs.forEach(t => t.classList.remove('active'));
                tab.classList.add('active');

                // Update active content within this platform
                browserContents.forEach(content => {
                    content.classList.remove('active');
                    if (content.id === browser) {
                        content.classList.add('active');
                    }
                });
            });
        });
    });
}

// ============================================
// ACCORDION (Troubleshooting)
// ============================================

function initAccordion() {
    const accordionItems = document.querySelectorAll('.accordion-item');

    accordionItems.forEach(item => {
        const header = item.querySelector('.accordion-header');

        header.addEventListener('click', () => {
            const isActive = item.classList.contains('active');

            // Close all other items
            accordionItems.forEach(i => i.classList.remove('active'));

            // Toggle current item
            if (!isActive) {
                item.classList.add('active');
            }
        });
    });
}

// ============================================
// SMOOTH SCROLL
// ============================================

function initSmoothScroll() {
    const navLinks = document.querySelectorAll('a[href^="#"]');

    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            const href = link.getAttribute('href');

            // Skip if it's just "#" or if it's a switch-browser link
            if (href === '#' || link.classList.contains('switch-browser')) {
                return;
            }

            e.preventDefault();
            const target = document.querySelector(href);

            if (target) {
                const offset = 80; // Account for fixed header
                const elementPosition = target.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - offset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// ============================================
// SWITCH BROWSER LINKS
// ============================================

function initSwitchBrowserLinks() {
    const switchLinks = document.querySelectorAll('.switch-browser');

    switchLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetBrowser = link.dataset.target;
            const targetTab = document.querySelector(`.browser-tab[data-browser="${targetBrowser}"]`);

            if (targetTab) {
                targetTab.click();
            }
        });
    });
}

// ============================================
// HEADER SCROLL EFFECT
// ============================================

let lastScroll = 0;
const header = document.querySelector('.header');

window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;

    if (currentScroll > 100) {
        header.style.background = 'rgba(10, 10, 15, 0.95)';
    } else {
        header.style.background = 'rgba(10, 10, 15, 0.8)';
    }

    lastScroll = currentScroll;
});

// ============================================
// UTILITY: Track which step user is on
// ============================================

function trackStepProgress(platformId) {
    const platform = document.getElementById(platformId);
    if (!platform) return;

    const steps = platform.querySelectorAll('.step');
    const observerOptions = {
        root: null,
        rootMargin: '-50% 0px',
        threshold: 0
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const stepNumber = entry.target.querySelector('.step-number');
                if (stepNumber) {
                    stepNumber.style.transform = 'scale(1.1)';
                    stepNumber.style.boxShadow = '0 0 30px rgba(139, 92, 246, 0.5)';
                }
            } else {
                const stepNumber = entry.target.querySelector('.step-number');
                if (stepNumber) {
                    stepNumber.style.transform = 'scale(1)';
                    stepNumber.style.boxShadow = 'none';
                }
            }
        });
    }, observerOptions);

    steps.forEach(step => observer.observe(step));
}

// Initialize step tracking for all platforms
['windows', 'macos', 'ios', 'android'].forEach(trackStepProgress);

// ============================================
// COPY TO CLIPBOARD (for future use)
// ============================================

function copyToClipboard(text) {
    navigator.clipboard.writeText(text).then(() => {
        // Show success message
        showToast('Copied to clipboard!');
    }).catch(err => {
        console.error('Failed to copy:', err);
    });
}

function showToast(message) {
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.textContent = message;
    toast.style.cssText = `
        position: fixed;
        bottom: 20px;
        left: 50%;
        transform: translateX(-50%);
        background: #10b981;
        color: white;
        padding: 12px 24px;
        border-radius: 8px;
        font-weight: 500;
        z-index: 10000;
        animation: slideUp 0.3s ease;
    `;
    document.body.appendChild(toast);

    setTimeout(() => {
        toast.style.animation = 'slideDown 0.3s ease';
        setTimeout(() => toast.remove(), 300);
    }, 2000);
}

// ============================================
// KEYBOARD NAVIGATION
// ============================================

document.addEventListener('keydown', (e) => {
    // ESC to close any open accordion
    if (e.key === 'Escape') {
        document.querySelectorAll('.accordion-item.active').forEach(item => {
            item.classList.remove('active');
        });
    }
});

// ============================================
// ANIMATE ON SCROLL (Optional enhancement)
// ============================================

function initScrollAnimations() {
    const animatedElements = document.querySelectorAll('.benefit-card, .faq-item, .step');

    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
        observer.observe(el);
    });
}

// Initialize scroll animations
initScrollAnimations();
