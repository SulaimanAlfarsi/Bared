/**
 * Bared Ice Tea Website
 * Features: flavor themes, light/dark mode, mobile menu, form handling, GSAP animations
 */

class BaredWebsite {
    constructor() {
        this.flavors = [
            {
                name: 'raspberry',
                label: 'Raspberry & Pomegranate',
                heroImage: 'pic/tot.png',
                themeColor: '#d91f5c'
            },
            {
                name: 'mango',
                label: 'Mango',
                heroImage: 'pic/mango.png',
                themeColor: '#ea580c'
            },
            {
                name: 'peach',
                label: 'Peach & Passion',
                heroImage: 'pic/p_and_p.png',
                themeColor: '#0284c7'
            }
        ];

        this.currentFlavor = this.flavors[0];
        this.colorMode = 'light';
        this.mobileMenuOpen = false;
        this.reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        this.init();
    }

    init() {
        this.loadPreferences();
        this.setupEventListeners();
        this.setupFormHandling();
        this.setupSmoothScrolling();
        this.setupImageLoading();
        this.setupGsapAnimations();
        this.hideLoadingOverlay();
    }

    setupEventListeners() {
        document.querySelectorAll('[data-flavor]').forEach(control => {
            control.addEventListener('click', () => {
                this.setFlavor(control.dataset.flavor, true);
                this.savePreferences();
            });
        });

        const themeToggle = document.querySelector('#theme-toggle');
        if (themeToggle) {
            themeToggle.addEventListener('click', () => {
                this.setColorMode(this.colorMode === 'light' ? 'dark' : 'light', true);
                this.savePreferences();
            });
        }

        const menuIcon = document.querySelector('#menu-icon');
        const navList = document.querySelector('.navlist');

        if (menuIcon && navList) {
            menuIcon.addEventListener('click', () => this.toggleMobileMenu());
        }

        document.querySelectorAll('.navlist a').forEach(link => {
            link.addEventListener('click', () => {
                if (this.mobileMenuOpen) this.closeMobileMenu();
            });
        });

        document.addEventListener('click', (event) => {
            if (!this.mobileMenuOpen || !menuIcon || !navList) return;
            if (!menuIcon.contains(event.target) && !navList.contains(event.target)) {
                this.closeMobileMenu();
            }
        });

        window.addEventListener('resize', this.debounce(() => {
            if (window.innerWidth > 768 && this.mobileMenuOpen) {
                this.closeMobileMenu();
            }
        }, 250));

        window.addEventListener('scroll', this.throttle(() => this.handleScroll(), 100));

        document.addEventListener('keydown', (event) => {
            if (event.key === 'Escape' && this.mobileMenuOpen) {
                this.closeMobileMenu();
            }
        });
    }

    setFlavor(flavorName, animate = false) {
        const nextFlavor = this.flavors.find(flavor => flavor.name === flavorName) || this.flavors[0];
        this.currentFlavor = nextFlavor;

        document.body.classList.remove('theme-raspberry', 'theme-mango', 'theme-peach');
        document.body.classList.add(`theme-${nextFlavor.name}`);

        const themeMeta = document.querySelector('meta[name="theme-color"]');
        const tileMeta = document.querySelector('meta[name="msapplication-TileColor"]');
        if (themeMeta) themeMeta.setAttribute('content', nextFlavor.themeColor);
        if (tileMeta) tileMeta.setAttribute('content', nextFlavor.themeColor);

        this.updateFlavorControls();
        this.updateHeroFlavor(nextFlavor, animate);
    }

    updateFlavorControls() {
        document.querySelectorAll('[data-flavor]').forEach(control => {
            const isActive = control.dataset.flavor === this.currentFlavor.name;
            control.classList.toggle('active', isActive);
            control.setAttribute('aria-pressed', String(isActive));
        });
    }

    updateHeroFlavor(flavor, animate = false) {
        const heroBottle = document.querySelector('.hero-bottle');
        const heroFlavorName = document.querySelector('.hero-flavor-name');

        const applyContent = () => {
            if (heroBottle) {
                heroBottle.src = flavor.heroImage;
                heroBottle.alt = `${flavor.label} Bared ice tea bottle`;
            }
            if (heroFlavorName) {
                heroFlavorName.textContent = flavor.label;
            }
        };

        if (!animate || this.reduceMotion || typeof gsap === 'undefined' || !heroBottle) {
            applyContent();
            return;
        }

        gsap.to([heroBottle, heroFlavorName], {
            y: 14,
            autoAlpha: 0,
            duration: 0.18,
            ease: 'power2.in',
            onComplete: () => {
                applyContent();
                gsap.fromTo([heroBottle, heroFlavorName],
                    { y: -18, autoAlpha: 0, scale: 0.96 },
                    { y: 0, autoAlpha: 1, scale: 1, duration: 0.52, stagger: 0.06, ease: 'back.out(1.7)' }
                );
            }
        });
    }

    setColorMode(mode, animate = false) {
        this.colorMode = mode === 'dark' ? 'dark' : 'light';
        document.body.classList.toggle('mode-dark', this.colorMode === 'dark');
        document.body.classList.toggle('mode-light', this.colorMode === 'light');
        document.documentElement.style.colorScheme = this.colorMode;

        const themeToggle = document.querySelector('#theme-toggle');
        if (themeToggle) {
            themeToggle.classList.toggle('bx-moon', this.colorMode === 'light');
            themeToggle.classList.toggle('bx-sun', this.colorMode === 'dark');
            themeToggle.setAttribute('aria-label', this.colorMode === 'light' ? 'Switch to dark mode' : 'Switch to light mode');
            themeToggle.setAttribute('title', this.colorMode === 'light' ? 'Dark mode' : 'Light mode');
        }

        if (animate && !this.reduceMotion && typeof gsap !== 'undefined') {
            gsap.fromTo('body', { opacity: 0.92 }, { opacity: 1, duration: 0.24, ease: 'power2.out' });
        }
    }

    toggleMobileMenu() {
        this.mobileMenuOpen = !this.mobileMenuOpen;
        const navList = document.querySelector('.navlist');
        const menuIcon = document.querySelector('#menu-icon');

        if (!navList || !menuIcon) return;

        navList.classList.toggle('open', this.mobileMenuOpen);
        menuIcon.classList.toggle('bx-x', this.mobileMenuOpen);
        menuIcon.setAttribute('aria-expanded', String(this.mobileMenuOpen));
        document.body.style.overflow = this.mobileMenuOpen ? 'hidden' : '';
    }

    closeMobileMenu() {
        if (!this.mobileMenuOpen) return;

        this.mobileMenuOpen = false;
        const navList = document.querySelector('.navlist');
        const menuIcon = document.querySelector('#menu-icon');

        if (!navList || !menuIcon) return;

        navList.classList.remove('open');
        menuIcon.classList.remove('bx-x');
        menuIcon.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
    }

    handleScroll() {
        const header = document.querySelector('header');
        if (header) {
            header.classList.toggle('header-scrolled', window.scrollY > 80);
        }
    }

    setupSmoothScrolling() {
        document.querySelectorAll('a[href^="#"]').forEach(link => {
            link.addEventListener('click', (event) => {
                const targetId = link.getAttribute('href');

                if (!targetId || targetId === '#') {
                    event.preventDefault();
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                    return;
                }

                const targetElement = document.querySelector(targetId);
                if (!targetElement) return;

                event.preventDefault();
                const header = document.querySelector('header');
                const headerHeight = header ? header.offsetHeight : 0;
                const targetPosition = targetElement.offsetTop - headerHeight - 20;

                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            });
        });
    }

    setupFormHandling() {
        const contactForm = document.querySelector('.contact-form');
        if (!contactForm) return;

        contactForm.addEventListener('submit', (event) => {
            event.preventDefault();
            this.handleFormSubmission(contactForm);
        });

        contactForm.querySelectorAll('input, textarea').forEach(input => {
            input.addEventListener('blur', () => this.validateField(input));
            input.addEventListener('input', () => this.clearFieldError(input));
        });
    }

    handleFormSubmission(form) {
        const formData = new FormData(form);
        const data = Object.fromEntries(formData);

        if (!this.validateForm(data)) return;

        const submitBtn = form.querySelector('.submit-btn');
        const originalText = submitBtn.textContent;
        submitBtn.textContent = 'Sending...';
        submitBtn.disabled = true;
        form.classList.add('loading');

        setTimeout(() => {
            this.showNotification('Message sent successfully!', 'success');
            form.reset();
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
            form.classList.remove('loading');
        }, 900);
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
        let errorMessage = '';

        if (fieldName === 'name' && value.length < 2) {
            errorMessage = 'Name must be at least 2 characters long';
        }

        if (fieldName === 'email' && !this.isValidEmail(value)) {
            errorMessage = 'Please enter a valid email address';
        }

        if (fieldName === 'message' && value.length < 10) {
            errorMessage = 'Message must be at least 10 characters long';
        }

        if (errorMessage) {
            this.showFieldError(field, errorMessage);
            return false;
        }

        this.clearFieldError(field);
        return true;
    }

    showFieldError(field, message) {
        this.clearFieldError(field);

        const errorDiv = document.createElement('div');
        errorDiv.className = 'field-error';
        errorDiv.textContent = message;
        field.style.borderColor = '#ef4444';
        field.parentNode.appendChild(errorDiv);
    }

    clearFieldError(field) {
        const existingError = field.parentNode.querySelector('.field-error');
        if (existingError) existingError.remove();
        field.style.borderColor = '';
    }

    isValidEmail(email) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    }

    showNotification(message, type = 'info') {
        document.querySelectorAll('.notification').forEach(notification => notification.remove());

        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.textContent = message;

        Object.assign(notification.style, {
            position: 'fixed',
            top: '20px',
            right: '20px',
            padding: '12px 20px',
            borderRadius: '8px',
            color: 'white',
            fontWeight: '600',
            zIndex: '9999',
            transform: 'translateX(100%)',
            transition: 'transform 0.3s ease',
            backgroundColor: type === 'success' ? '#10b981' : type === 'error' ? '#ef4444' : this.currentFlavor.themeColor
        });

        document.body.appendChild(notification);

        requestAnimationFrame(() => {
            notification.style.transform = 'translateX(0)';
        });

        setTimeout(() => {
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => notification.remove(), 300);
        }, 4200);
    }

    setupGsapAnimations() {
        if (this.reduceMotion || typeof gsap === 'undefined') return;

        if (typeof ScrollTrigger !== 'undefined') {
            gsap.registerPlugin(ScrollTrigger);
        }

        const heroTimeline = gsap.timeline({ defaults: { ease: 'power3.out' } });
        heroTimeline
            .from('.logo, .navlist li, .flavor-btn, .h-main > *', { y: -18, autoAlpha: 0, duration: 0.46, stagger: 0.04 })
            .from('.hero-kicker', { y: 20, autoAlpha: 0, duration: 0.48 }, '-=0.18')
            .from('.hero-text h1', { y: 46, autoAlpha: 0, duration: 0.72 }, '-=0.18')
            .from('.hero-text h2, .hero-text p', { y: 26, autoAlpha: 0, duration: 0.54, stagger: 0.08 }, '-=0.34')
            .from('.hero-actions > *', { y: 20, autoAlpha: 0, duration: 0.44, stagger: 0.06 }, '-=0.24')
            .from('.box', { y: 26, autoAlpha: 0, scale: 0.96, duration: 0.5, stagger: 0.08 }, '-=0.22')
            .from('.hero-bottle-stage', { y: 34, autoAlpha: 0, clipPath: 'inset(12% 0% 12% 0%)', duration: 0.7 }, '-=0.66')
            .from('.hero-bottle', { y: 62, autoAlpha: 0, rotate: 4, scale: 0.9, duration: 0.78 }, '-=0.52')
            .from('.hero-badge, .hero-flavor-name', { y: 16, autoAlpha: 0, duration: 0.42, stagger: 0.06 }, '-=0.32');

        gsap.to('.hero-bottle', {
            y: -14,
            rotate: 1.4,
            duration: 3,
            repeat: -1,
            yoyo: true,
            ease: 'sine.inOut'
        });

        if (typeof ScrollTrigger === 'undefined') return;

        gsap.utils.toArray('.about-section, .products-section, .contact-section').forEach(section => {
            const elements = section.querySelectorAll('h2, .about-text p, .feature, .product-card, .contact-item, .contact-form');
            gsap.fromTo(elements,
                { y: 30, autoAlpha: 0 },
                {
                    scrollTrigger: {
                        trigger: section,
                        start: 'top 78%',
                        toggleActions: 'play none none none'
                    },
                    y: 0,
                    autoAlpha: 1,
                    duration: 0.52,
                    stagger: 0.06,
                    ease: 'power2.out',
                    clearProps: 'opacity,visibility,transform'
                }
            );
        });
    }

    loadPreferences() {
        const savedFlavor = localStorage.getItem('bared-flavor-theme') || 'raspberry';
        const savedMode = localStorage.getItem('bared-color-mode') || 'light';
        this.setFlavor(savedFlavor, false);
        this.setColorMode(savedMode, false);
    }

    savePreferences() {
        localStorage.setItem('bared-flavor-theme', this.currentFlavor.name);
        localStorage.setItem('bared-color-mode', this.colorMode);
    }

    setupImageLoading() {
        document.querySelectorAll('img[loading="lazy"]').forEach(img => {
            if (img.complete) {
                img.classList.add('loaded');
            } else {
                img.addEventListener('load', () => img.classList.add('loaded'), { once: true });
            }
        });
    }

    hideLoadingOverlay() {
        const loadingOverlay = document.getElementById('loading-overlay');
        if (!loadingOverlay) return;

        setTimeout(() => {
            loadingOverlay.classList.add('hidden');
            setTimeout(() => loadingOverlay.remove(), 500);
        }, 450);
    }

    debounce(func, wait) {
        let timeout;
        return (...args) => {
            clearTimeout(timeout);
            timeout = setTimeout(() => func(...args), wait);
        };
    }

    throttle(func, limit) {
        let inThrottle;
        return (...args) => {
            if (inThrottle) return;
            func(...args);
            inThrottle = true;
            setTimeout(() => {
                inThrottle = false;
            }, limit);
        };
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new BaredWebsite();
});
