/**
 * Modern JavaScript for Bared Ice Tea Website
 * Features: Dark mode, mobile menu, smooth scrolling, form handling, animations
 */

class BaredWebsite {
    constructor() {
        this.darkMode = false;
        this.mobileMenuOpen = false;
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.initializeScrollReveal();
        this.setupFormHandling();
        this.setupSmoothScrolling();
        this.setupIntersectionObserver();
        this.setupImageLoading();
        this.loadTheme();
        this.hideLoadingOverlay();
    }

    setupEventListeners() {
        // Dark mode toggle
        const darkModeBtn = document.querySelector('#darkmode');
        if (darkModeBtn) {
            darkModeBtn.addEventListener('click', () => this.toggleDarkMode());
        }

        // Mobile menu toggle
        const menuIcon = document.querySelector('#menu-icon');
        const navList = document.querySelector('.navlist');
        
        if (menuIcon && navList) {
            menuIcon.addEventListener('click', () => this.toggleMobileMenu());
        }

        // Close mobile menu when clicking on links
        const navLinks = document.querySelectorAll('.navlist a');
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                if (this.mobileMenuOpen) {
                    this.closeMobileMenu();
                }
            });
        });

        // Close mobile menu when clicking outside
        document.addEventListener('click', (e) => {
            if (this.mobileMenuOpen && 
                !menuIcon.contains(e.target) && 
                !navList.contains(e.target)) {
                this.closeMobileMenu();
            }
        });

        // Handle window resize
        window.addEventListener('resize', this.debounce(() => {
            if (window.innerWidth > 768 && this.mobileMenuOpen) {
                this.closeMobileMenu();
            }
        }, 250));

        // Handle scroll events
        window.addEventListener('scroll', this.throttle(() => {
            this.handleScroll();
        }, 100));

        // Handle keyboard navigation
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.mobileMenuOpen) {
                this.closeMobileMenu();
            }
        });
    }

    toggleDarkMode() {
        this.darkMode = !this.darkMode;
        document.body.classList.toggle('dark', this.darkMode);
        
        const darkModeBtn = document.querySelector('#darkmode');
        const logoImg = document.querySelector('.logo img');
        const heroImg = document.querySelector('.hero-img img');
        
        if (darkModeBtn) {
            darkModeBtn.classList.toggle('bx-moon', !this.darkMode);
            darkModeBtn.classList.toggle('bx-sun', this.darkMode);
        }

        // Update images for dark mode
        if (logoImg) {
            logoImg.src = this.darkMode ? 'pic/Bared.png' : 'pic/SL.png';
            logoImg.alt = this.darkMode ? 'Bared Dark Logo' : 'Bared Light Logo';
        }

        if (heroImg) {
            heroImg.src = this.darkMode ? 'pic/tot.png' : 'pic/p_and_p.png';
            heroImg.alt = this.darkMode ? 'Dark Mode Hero Image' : 'Light Mode Hero Image';
        }

        // Force image reload to ensure they display properly
        this.forceImageReload();

        // Save theme preference
        this.saveTheme();
    }

    forceImageReload() {
        // Force reload of all product images to ensure they display
        const allImages = document.querySelectorAll('img');
        allImages.forEach(img => {
            const originalSrc = img.src;
            img.src = '';
            setTimeout(() => {
                img.src = originalSrc;
                img.classList.add('loaded');
            }, 100);
        });
    }

    toggleMobileMenu() {
        this.mobileMenuOpen = !this.mobileMenuOpen;
        const navList = document.querySelector('.navlist');
        const menuIcon = document.querySelector('#menu-icon');
        
        if (navList && menuIcon) {
            navList.classList.toggle('open', this.mobileMenuOpen);
            menuIcon.classList.toggle('bx-x', this.mobileMenuOpen);
            menuIcon.setAttribute('aria-expanded', this.mobileMenuOpen);
            
            // Prevent body scroll when menu is open
            document.body.style.overflow = this.mobileMenuOpen ? 'hidden' : '';
        }
    }

    closeMobileMenu() {
        if (this.mobileMenuOpen) {
            this.mobileMenuOpen = false;
            const navList = document.querySelector('.navlist');
            const menuIcon = document.querySelector('#menu-icon');
            
            if (navList && menuIcon) {
                navList.classList.remove('open');
                menuIcon.classList.remove('bx-x');
                menuIcon.setAttribute('aria-expanded', 'false');
                document.body.style.overflow = '';
            }
        }
    }

    handleScroll() {
        const header = document.querySelector('header');
        const scrollY = window.scrollY;
        
        if (header) {
            if (scrollY > 100) {
                header.style.background = this.darkMode 
                    ? 'rgba(17, 24, 39, 0.98)' 
                    : 'rgba(255, 255, 255, 0.98)';
                header.style.backdropFilter = 'blur(20px)';
    } else {
                header.style.background = this.darkMode 
                    ? 'rgba(17, 24, 39, 0.95)' 
                    : 'rgba(255, 255, 255, 0.95)';
                header.style.backdropFilter = 'blur(10px)';
            }
        }
    }

    setupSmoothScrolling() {
        const links = document.querySelectorAll('a[href^="#"]');
        
        links.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const targetId = link.getAttribute('href');
                const targetElement = document.querySelector(targetId);
                
                if (targetElement) {
                    const headerHeight = document.querySelector('header').offsetHeight;
                    const targetPosition = targetElement.offsetTop - headerHeight - 20;
                    
                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });
                }
            });
        });
    }

    setupFormHandling() {
        const contactForm = document.querySelector('.contact-form');
        
        if (contactForm) {
            contactForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleFormSubmission(contactForm);
            });

            // Add real-time validation
            const inputs = contactForm.querySelectorAll('input, textarea');
            inputs.forEach(input => {
                input.addEventListener('blur', () => this.validateField(input));
                input.addEventListener('input', () => this.clearFieldError(input));
            });
        }
    }

    handleFormSubmission(form) {
        const formData = new FormData(form);
        const data = Object.fromEntries(formData);
        
        // Validate form
        if (!this.validateForm(data)) {
            return;
        }

        // Show loading state
        const submitBtn = form.querySelector('.submit-btn');
        const originalText = submitBtn.textContent;
        submitBtn.textContent = 'Sending...';
        submitBtn.disabled = true;
        form.classList.add('loading');

        // Simulate form submission (replace with actual API call)
        setTimeout(() => {
            this.showNotification('Message sent successfully!', 'success');
            form.reset();
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
            form.classList.remove('loading');
        }, 2000);
    }

    validateForm(data) {
        const errors = [];
        
        if (!data.name || data.name.trim().length < 2) {
            errors.push('Name must be at least 2 characters long');
        }
        
        if (!data.email || !this.isValidEmail(data.email)) {
            errors.push('Please enter a valid email address');
        }
        
        if (!data.message || data.message.trim().length < 10) {
            errors.push('Message must be at least 10 characters long');
        }

        if (errors.length > 0) {
            this.showNotification(errors.join(', '), 'error');
            return false;
        }
        
        return true;
    }

    validateField(field) {
        const value = field.value.trim();
        const fieldName = field.name;
        let isValid = true;
        let errorMessage = '';

        switch (fieldName) {
            case 'name':
                if (value.length < 2) {
                    isValid = false;
                    errorMessage = 'Name must be at least 2 characters long';
                }
                break;
            case 'email':
                if (!this.isValidEmail(value)) {
                    isValid = false;
                    errorMessage = 'Please enter a valid email address';
                }
                break;
            case 'message':
                if (value.length < 10) {
                    isValid = false;
                    errorMessage = 'Message must be at least 10 characters long';
                }
                break;
        }

        if (!isValid) {
            this.showFieldError(field, errorMessage);
        } else {
            this.clearFieldError(field);
        }

        return isValid;
    }

    showFieldError(field, message) {
        this.clearFieldError(field);
        
        const errorDiv = document.createElement('div');
        errorDiv.className = 'field-error';
        errorDiv.textContent = message;
        errorDiv.style.color = '#ef4444';
        errorDiv.style.fontSize = '0.875rem';
        errorDiv.style.marginTop = '0.25rem';
        
        field.style.borderColor = '#ef4444';
        field.parentNode.appendChild(errorDiv);
    }

    clearFieldError(field) {
        const existingError = field.parentNode.querySelector('.field-error');
        if (existingError) {
            existingError.remove();
        }
        field.style.borderColor = '';
    }

    isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    showNotification(message, type = 'info') {
        // Remove existing notifications
        const existingNotifications = document.querySelectorAll('.notification');
        existingNotifications.forEach(notification => notification.remove());

        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.textContent = message;
        
        // Style the notification
        Object.assign(notification.style, {
            position: 'fixed',
            top: '20px',
            right: '20px',
            padding: '12px 20px',
            borderRadius: '8px',
            color: 'white',
            fontWeight: '500',
            zIndex: '9999',
            transform: 'translateX(100%)',
            transition: 'transform 0.3s ease',
            backgroundColor: type === 'success' ? '#10b981' : type === 'error' ? '#ef4444' : '#3b82f6'
        });

        document.body.appendChild(notification);

        // Animate in
        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
        }, 100);

        // Auto remove after 5 seconds
        setTimeout(() => {
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => notification.remove(), 300);
        }, 5000);
    }

    initializeScrollReveal() {
        if (typeof ScrollReveal !== 'undefined') {
            const sr = ScrollReveal({
                distance: '30px',
                duration: 800,
                easing: 'ease-in-out',
                reset: false,
                mobile: true
            });

            // Reveal elements with staggered timing
            sr.reveal('.hero-text', { 
                delay: 200, 
                origin: 'left',
                interval: 100
            });
            
            sr.reveal('.hero-img', { 
                delay: 400, 
                origin: 'right' 
            });
            
            sr.reveal('.box', { 
                delay: 600, 
                origin: 'bottom',
                interval: 200
            });
            
            sr.reveal('.about-text', { 
                delay: 200, 
                origin: 'left' 
            });
            
            sr.reveal('.about-features', { 
                delay: 400, 
                origin: 'right' 
            });
            
            sr.reveal('.product-card', { 
                delay: 200, 
                origin: 'bottom',
                interval: 200
            });
            
            sr.reveal('.contact-info', { 
                delay: 200, 
                origin: 'left' 
            });
            
            sr.reveal('.contact-form', { 
                delay: 400, 
                origin: 'right' 
            });
        }
    }

    setupIntersectionObserver() {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate-in');
                }
            });
        }, observerOptions);

        // Observe elements for animation
        const animateElements = document.querySelectorAll('.feature, .product-card, .contact-item');
        animateElements.forEach(el => observer.observe(el));
    }

    loadTheme() {
        const savedTheme = localStorage.getItem('bared-theme');
        if (savedTheme === 'dark') {
            this.darkMode = true;
            document.body.classList.add('dark');
            
            const darkModeBtn = document.querySelector('#darkmode');
            const logoImg = document.querySelector('.logo img');
            const heroImg = document.querySelector('.hero-img img');
            
            if (darkModeBtn) {
                darkModeBtn.classList.replace('bx-moon', 'bx-sun');
            }
            
            if (logoImg) {
                logoImg.src = 'pic/Bared.png';
            }
            
            if (heroImg) {
                heroImg.src = 'pic/tot.png';
            }
        }
        
        // Ensure dark mode button is visible
        const darkModeBtn = document.querySelector('#darkmode');
        if (darkModeBtn) {
            darkModeBtn.style.display = 'block';
            darkModeBtn.style.visibility = 'visible';
        }
    }

    saveTheme() {
        localStorage.setItem('bared-theme', this.darkMode ? 'dark' : 'light');
    }

    setupImageLoading() {
        const lazyImages = document.querySelectorAll('img[loading="lazy"]');
        
        if ('IntersectionObserver' in window) {
            const imageObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        img.addEventListener('load', () => {
                            img.classList.add('loaded');
                        });
                        imageObserver.unobserve(img);
                    }
                });
            });

            lazyImages.forEach(img => imageObserver.observe(img));
        } else {
            // Fallback for older browsers
            lazyImages.forEach(img => {
                img.addEventListener('load', () => {
                    img.classList.add('loaded');
                });
            });
        }
    }

    hideLoadingOverlay() {
        const loadingOverlay = document.getElementById('loading-overlay');
        if (loadingOverlay) {
            // Hide loading overlay after a short delay to ensure smooth transition
            setTimeout(() => {
                loadingOverlay.classList.add('hidden');
                setTimeout(() => {
                    loadingOverlay.remove();
                }, 500);
            }, 1000);
        }
    }

    // Utility functions
    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    throttle(func, limit) {
        let inThrottle;
        return function() {
            const args = arguments;
            const context = this;
            if (!inThrottle) {
                func.apply(context, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    }
}

// Initialize the website when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new BaredWebsite();
});

// Add CSS for animations
const style = document.createElement('style');
style.textContent = `
    .animate-in {
        animation: fadeInUp 0.6s ease-out forwards;
    }
    
    @keyframes fadeInUp {
        from {
            opacity: 0;
            transform: translateY(30px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
    
    .loading {
        opacity: 0.6;
        pointer-events: none;
    }
    
    .field-error {
        color: #ef4444;
        font-size: 0.875rem;
        margin-top: 0.25rem;
    }
`;
document.head.appendChild(style);