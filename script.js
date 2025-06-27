// DOM Elements
const hamburger = document.getElementById('hamburger');
const navMenu = document.getElementById('nav-menu');
const requestForm = document.getElementById('request-form');

// Mobile Menu Toggle
function initMobileMenu() {
    if (hamburger && navMenu) {
        hamburger.addEventListener('click', () => {
            navMenu.classList.toggle('active');
            hamburger.classList.toggle('active');
        });

        // Close menu when clicking on a link
        const navLinks = navMenu.querySelectorAll('a');
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                navMenu.classList.remove('active');
                hamburger.classList.remove('active');
            });
        });

        // Close menu when clicking outside
        document.addEventListener('click', (e) => {
            if (!hamburger.contains(e.target) && !navMenu.contains(e.target)) {
                navMenu.classList.remove('active');
                hamburger.classList.remove('active');
            }
        });
    }
}

// Form Validation and Submission
function initFormHandling() {
    if (requestForm) {
        requestForm.addEventListener('submit', handleFormSubmit);
    }
}

function handleFormSubmit(e) {
    e.preventDefault();
    
    // Get form data
    const formData = new FormData(requestForm);
    const company = formData.get('company');
    const email = formData.get('email');
    const location = formData.get('location');
    const description = formData.get('description');

    // Basic validation
    if (!company || !email || !location) {
        showFormMessage('Lütfen tüm zorunlu alanları doldurun.', 'error');
        return;
    }

    // Email validation
    if (!isValidEmail(email)) {
        showFormMessage('Lütfen geçerli bir e-posta adresi girin.', 'error');
        return;
    }    // Submit form to backend
    submitFormToBackend(formData);
}

function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function submitFormToBackend(formData) {
    // Show loading state
    const submitBtn = requestForm.querySelector('.btn-primary');
    const originalText = submitBtn.textContent;
    submitBtn.textContent = 'Gönderiliyor...';
    submitBtn.disabled = true;

    // Convert FormData to URLSearchParams for form-encoded data
    const params = new URLSearchParams();
    params.append('company', formData.get('company'));
    params.append('email', formData.get('email'));
    params.append('location', formData.get('location'));
    params.append('description', formData.get('description') || '');

    // Submit to your backend endpoint
    fetch('https://atli-app-10e5b634de0b.herokuapp.com/api/v1/public/employee-request', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: params
    })
    .then(response => {
        console.log('Response:', response);
        return response.json();
    })
    .then(data => {
        if (data.success) {
            // Show success message
            showFormMessage(data.message, 'success');
            console.log('Form submitted successfully:', data);
            
            // Reset form
            requestForm.reset();
            
            // Auto-hide success message after 5 seconds
            setTimeout(() => {
                hideFormMessage();
            }, 5000);
        } else {
            throw new Error(data.message || 'Form gönderimi başarısız oldu');
        }
    })
    .catch(error => {
        console.error('Form submission error:', error);
        showFormMessage(error.message || 'Form gönderimi sırasında bir hata oluştu. Lütfen tekrar deneyin.', 'error');
    })
    .finally(() => {
        // Reset button
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
    });
}

function showFormMessage(message, type) {
    // Remove existing message
    const existingMessage = requestForm.querySelector('.form-message');
    if (existingMessage) {
        existingMessage.remove();
    }

    // Create new message element
    const messageDiv = document.createElement('div');
    messageDiv.className = `form-message ${type}`;
    messageDiv.textContent = message;

    // Insert message at the top of the form
    const formContainer = requestForm.querySelector('.form-container') || requestForm;
    formContainer.insertBefore(messageDiv, formContainer.firstChild);

    // Scroll to message
    messageDiv.scrollIntoView({ behavior: 'smooth', block: 'center' });
}

function hideFormMessage() {
    const message = requestForm.querySelector('.form-message');
    if (message) {
        message.style.opacity = '0';
        setTimeout(() => {
            message.remove();
        }, 300);
    }
}

// Smooth Scrolling for Internal Links
function initSmoothScrolling() {
    const links = document.querySelectorAll('a[href^="#"]');
    links.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href').substring(1);
            const targetElement = document.getElementById(targetId);
            
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

// Intersection Observer for Animations
function initScrollAnimations() {
    const animatedElements = document.querySelectorAll('.fade-in, .service-card, .value-item, .sector-card, .company-card, .testimonial-card, .stat-card');
    
    if (animatedElements.length === 0) return;

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });

    animatedElements.forEach(el => {
        el.classList.add('fade-in');
        observer.observe(el);
    });
}

// Form Input Enhancements
function initFormEnhancements() {
    const inputs = document.querySelectorAll('input, select, textarea');
    
    inputs.forEach(input => {
        // Add focus/blur effects
        input.addEventListener('focus', () => {
            input.parentElement.classList.add('focused');
        });

        input.addEventListener('blur', () => {
            input.parentElement.classList.remove('focused');
            
            // Validate on blur
            if (input.hasAttribute('required') && !input.value.trim()) {
                input.parentElement.classList.add('error');
            } else {
                input.parentElement.classList.remove('error');
            }
        });

        // Real-time email validation
        if (input.type === 'email') {
            input.addEventListener('input', () => {
                if (input.value && !isValidEmail(input.value)) {
                    input.parentElement.classList.add('error');
                } else {
                    input.parentElement.classList.remove('error');
                }
            });
        }
    });
}

// Header Scroll Effect
function initHeaderScrollEffect() {
    const header = document.querySelector('.header');
    if (!header) return;

    let lastScrollY = window.scrollY;

    window.addEventListener('scroll', () => {
        const currentScrollY = window.scrollY;
        
        if (currentScrollY > 100) {
            header.style.backgroundColor = 'rgba(255, 255, 255, 0.95)';
            header.style.backdropFilter = 'blur(10px)';
        } else {
            header.style.backgroundColor = '#ffffff';
            header.style.backdropFilter = 'none';
        }

        lastScrollY = currentScrollY;
    });
}

// Loading Screen (optional)
function initLoadingScreen() {
    window.addEventListener('load', () => {
        const loadingScreen = document.querySelector('.loading-screen');
        if (loadingScreen) {
            loadingScreen.style.opacity = '0';
            setTimeout(() => {
                loadingScreen.remove();
            }, 500);
        }
    });
}

// Utility Functions
function debounce(func, wait) {
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

function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    }
}

// Performance Optimization
const debouncedResize = debounce(() => {
    // Handle any resize-specific logic here
    console.log('Window resized');
}, 250);

const throttledScroll = throttle(() => {
    // Handle any scroll-specific logic here
}, 100);

window.addEventListener('resize', debouncedResize);
window.addEventListener('scroll', throttledScroll);

// Initialize all functionality when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    console.log('AtlıDepoHizmetleri.com - JavaScript loaded');
    
    // Initialize all features
    initMobileMenu();
    initFormHandling();
    initSmoothScrolling();
    initScrollAnimations();
    initFormEnhancements();
    initHeaderScrollEffect();
    initLoadingScreen();
    
    // Add some CSS classes for enhanced styling
    document.body.classList.add('js-loaded');
    
    // Console welcome message
    console.log(`
    🏭 AtlıDepoHizmetleri.com
    📧 İletişim: info@atlidepohizmetleri.com
    📱 Responsive Design ✓
    🎯 Modern JavaScript ✓
    `);
});

// Handle form submission for contact info section
document.addEventListener('click', (e) => {
    if (e.target.matches('.contact-btn') || e.target.matches('.btn-contact')) {
        e.preventDefault();
        
        // Scroll to form
        const form = document.getElementById('request-form');
        if (form) {
            form.scrollIntoView({ behavior: 'smooth', block: 'center' });
            
            // Focus on first input
            setTimeout(() => {
                const firstInput = form.querySelector('input');
                if (firstInput) {
                    firstInput.focus();
                }
            }, 1000);
        }
    }
});

// Service tags click handler (if needed for analytics)
document.addEventListener('click', (e) => {
    if (e.target.matches('.service-tags span')) {
        const service = e.target.textContent;
        console.log(`Service clicked: ${service}`);
        
        // In a real application, you might send this to analytics
        // gtag('event', 'service_interest', {
        //     'service_name': service
        // });
    }
});

// Error handling
window.addEventListener('error', (e) => {
    console.error('JavaScript error:', e.error);
});

// Unhandled promise rejection handling
window.addEventListener('unhandledrejection', (e) => {
    console.error('Unhandled promise rejection:', e.reason);
});

// Export functions for testing (if needed)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        isValidEmail,
        handleFormSubmit,
        showFormMessage,
        hideFormMessage
    };
}
