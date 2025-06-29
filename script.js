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
    
    const applyForm = document.getElementById('apply-form');
    if (applyForm) {
        applyForm.addEventListener('submit', handleApplyFormSubmit);
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
    submitEmployeeRequestForm(formData);
}

function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function submitEmployeeRequestForm(formData) {
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
        return response.json();
    })
    .then(data => {
        if (data.success) {
            // Show success message
            showFormMessage(data.message, 'success');
            
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
}, 250);

const throttledScroll = throttle(() => {
    // Handle any scroll-specific logic here
}, 100);

window.addEventListener('resize', debouncedResize);
window.addEventListener('scroll', throttledScroll);

// Initialize all functionality when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    
    // Initialize all features
    initMobileMenu();
    initFormHandling();
    initCheckboxHandling();
    initCircularSplitButton();
    initPopupFormHandling();
    initSmoothScrolling();
    initScrollAnimations();
    initFormEnhancements();
    initHeaderScrollEffect();
    initLoadingScreen();
    
    // Add some CSS classes for enhanced styling
    document.body.classList.add('js-loaded');
});

// Handle form submission for contact info section
document.addEventListener('click', (e) => {
    if (e.target.matches('.contact-btn') || e.target.matches('.btn-contact')) {
        e.preventDefault();
        
        // Show popup instead of scrolling to form
        const circularPopup = document.getElementById('circular-popup');
        if (circularPopup) {
            circularPopup.classList.add('active');
            document.body.style.overflow = 'hidden';
            
            // Set title to Personel Talebi
            const popupTitle = document.getElementById('popup-title');
            if (popupTitle) {
                popupTitle.textContent = 'Personel Talebi';
            }
            
            // Focus on first input
            setTimeout(() => {
                const firstInput = circularPopup.querySelector('input');
                if (firstInput) {
                    firstInput.focus();
                }
            }, 500);
        }
    }
});

// Service tags click handler (if needed for analytics)
document.addEventListener('click', (e) => {
    if (e.target.matches('.service-tags span')) {
        const service = e.target.textContent;
        
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

// Circular Split Button Functionality
function initCircularSplitButton() {
    const splitButton = document.getElementById('split-button');
    const circularPopup = document.getElementById('circular-popup');
    const popupClose = document.getElementById('popup-close');
    const popupTitle = document.getElementById('popup-title');
    const splitButtonTop = document.querySelector('.split-button-top');
    const splitButtonBottom = document.querySelector('.split-button-bottom');

    if (!splitButton || !circularPopup) return;

    // Handle split button clicks
    function handleSplitButtonClick(e) {
        e.preventDefault();
        e.stopPropagation();
        
        const target = e.target.closest('[data-action]');
        if (!target) return;

        const action = target.getAttribute('data-action');
        
        // Add click animation
        splitButton.classList.add('clicked');
        setTimeout(() => {
            splitButton.classList.remove('clicked');
        }, 300);

        // Set popup title and show appropriate form based on action
        const requestForm = document.getElementById('request-form');
        const applyForm = document.getElementById('apply-form');
        
        if (action === 'employee-request') {
            popupTitle.textContent = 'Personel Talebi';
            if (requestForm) requestForm.style.display = 'block';
            if (applyForm) applyForm.style.display = 'none';
        } else if (action === 'apply') {
            popupTitle.textContent = 'İş Başvurusu';
            if (requestForm) requestForm.style.display = 'none';
            if (applyForm) applyForm.style.display = 'block';
        }

        // Show popup
        setTimeout(() => {
            showCircularPopup();
        }, 150);
    }

    // Show circular popup
    function showCircularPopup() {
        circularPopup.classList.add('active');
        document.body.style.overflow = 'hidden';
        
        // Re-initialize checkboxes after popup is shown
        setTimeout(() => {
            initCheckboxHandling();
            const firstInput = circularPopup.querySelector('input');
            if (firstInput) {
                firstInput.focus();
            }
        }, 500);
    }

    // Hide circular popup
    function hideCircularPopup() {
        circularPopup.classList.remove('active');
        document.body.style.overflow = '';
        
        // Reset form
        const form = circularPopup.querySelector('form');
        if (form) {
            form.reset();
            hideFormMessage();
        }
    }

    // Event listeners
    splitButtonTop.addEventListener('click', handleSplitButtonClick);
    splitButtonBottom.addEventListener('click', handleSplitButtonClick);
    
    popupClose.addEventListener('click', (e) => {
        e.preventDefault();
        hideCircularPopup();
    });

    // Close popup when clicking on overlay
    circularPopup.addEventListener('click', (e) => {
        if (e.target === circularPopup) {
            hideCircularPopup();
        }
    });

    // Close popup with Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && circularPopup.classList.contains('active')) {
            hideCircularPopup();
        }
    });

    // Prevent popup from closing when clicking inside content
    const popupContent = circularPopup.querySelector('.popup-content');
    if (popupContent) {
        popupContent.addEventListener('click', (e) => {
            e.stopPropagation();
        });
    }
}

// Update form handling to work with popup
function initPopupFormHandling() {
    const circularPopup = document.getElementById('circular-popup');
    if (!circularPopup) return;

    const requestForm = circularPopup.querySelector('#request-form');
    if (requestForm) {
        requestForm.addEventListener('submit', handleFormSubmit);
    }
}

// Update showFormMessage to work with popup
function showFormMessage(message, type) {
    const circularPopup = document.getElementById('circular-popup');
    const requestForm = circularPopup ? circularPopup.querySelector('#request-form') : document.getElementById('request-form');
    
    if (!requestForm) return;

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
    requestForm.insertBefore(messageDiv, requestForm.firstChild);

    // If popup is active, ensure message is visible
    if (circularPopup && circularPopup.classList.contains('active')) {
        const popupBottom = circularPopup.querySelector('.popup-bottom');
        if (popupBottom) {
            popupBottom.scrollTop = 0;
        }
    }
}

// Update hideFormMessage to work with popup
function hideFormMessage() {
    const circularPopup = document.getElementById('circular-popup');
    const requestForm = circularPopup ? circularPopup.querySelector('#request-form') : document.getElementById('request-form');
    
    if (!requestForm) return;

    const message = requestForm.querySelector('.form-message');
    if (message) {
        message.style.opacity = '0';
        setTimeout(() => {
            message.remove();
        }, 300);
    }
}

// Apply Form Handler
function handleApplyFormSubmit(e) {
    e.preventDefault();
    
    const applyForm = document.getElementById('apply-form');
    if (!applyForm) return;
    
    // Get form data
    const formData = new FormData(applyForm);
    const name = formData.get('name');
    const email = formData.get('email');
    
    // Get all selected work locations
    const workLocationCheckboxes = applyForm.querySelectorAll('input[name="workLocation"]:checked');
    const workLocations = Array.from(workLocationCheckboxes).map(cb => cb.value);
    
    // Get all selected skills
    const skillsCheckboxes = applyForm.querySelectorAll('input[name="skills"]:checked');
    const skills = Array.from(skillsCheckboxes).map(cb => cb.value);

    // Basic validation
    if (!name.trim()) {
        showApplyFormMessage('Lütfen adınızı ve soyadınızı giriniz.', 'error');
        return;
    }

    if (!email.trim()) {
        showApplyFormMessage('Lütfen e-posta adresinizi giriniz.', 'error');
        return;
    }

    if (!isValidEmail(email)) {
        showApplyFormMessage('Lütfen geçerli bir e-posta adresi giriniz.', 'error');
        return;
    }

    if (workLocations.length === 0) {
        showApplyFormMessage('Lütfen çalışabileceğiniz en az bir bölge seçiniz.', 'error');
        return;
    }

    if (skills.length === 0) {
        showApplyFormMessage('Lütfen yapabileceğiniz en az bir iş türü seçiniz.', 'error');
        return;
    }

    // Submit form with arrays
    submitApplyFormToBackend(name, email, workLocations, skills);
}

function submitApplyFormToBackend(name, email, workLocations, skills) {
    const applyForm = document.getElementById('apply-form');
    const submitBtn = applyForm.querySelector('.btn-primary');
    const originalText = submitBtn.textContent;
    submitBtn.textContent = 'Gönderiliyor...';
    submitBtn.disabled = true;

    // Create form data with arrays for backend
    const params = new URLSearchParams();
    params.append('name', name);
    params.append('email', email);
    
    // Add each work location as separate parameter
    workLocations.forEach(location => {
        params.append('workLocation', location);
    });
    
    // Add each skill as separate parameter
    skills.forEach(skill => {
        params.append('skills', skill);
    });

    // Submit to backend endpoint
    fetch('https://atli-app-10e5b634de0b.herokuapp.com/api/v1/public/employee-application', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: params
    })
    .then(response => {
        return response.json();
    })
    .then(data => {
        if (data.success) {
            // Show success message
            showApplyFormMessage(data.message, 'success');
            
            // Reset form
            applyForm.reset();
            
            // Close popup after 3 seconds
            setTimeout(() => {
                const circularPopup = document.getElementById('circular-popup');
                if (circularPopup) {
                    circularPopup.classList.remove('active');
                    document.body.style.overflow = '';
                }
            }, 3000);
        } else {
            throw new Error(data.message || 'Başvuru gönderimi başarısız oldu');
        }
    })
    .catch(error => {
        console.error('Apply form submission error:', error);
        showApplyFormMessage(error.message || 'Başvuru gönderilirken bir hata oluştu. Lütfen tekrar deneyiniz.', 'error');
    })
    .finally(() => {
        // Reset button
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
    });
}

function showApplyFormMessage(message, type) {
    const applyForm = document.getElementById('apply-form');
    if (!applyForm) return;

    // Remove existing message
    const existingMessage = applyForm.querySelector('.form-message');
    if (existingMessage) {
        existingMessage.remove();
    }

    // Create new message element
    const messageDiv = document.createElement('div');
    messageDiv.className = `form-message ${type}`;
    messageDiv.textContent = message;

    // Insert message at the top of the form
    applyForm.insertBefore(messageDiv, applyForm.firstChild);

    // If popup is active, ensure message is visible
    const circularPopup = document.getElementById('circular-popup');
    if (circularPopup && circularPopup.classList.contains('active')) {
        const popupBottom = circularPopup.querySelector('.popup-bottom');
        if (popupBottom) {
            popupBottom.scrollTop = 0;
        }
    }
}

// Checkbox interaction handling
function initCheckboxHandling() {
    const checkboxItems = document.querySelectorAll('.checkbox-item');
    
    checkboxItems.forEach(item => {
        const checkbox = item.querySelector('input[type="checkbox"]');
        
        if (checkbox) {
            // Handle checkbox change
            checkbox.addEventListener('change', () => {
                if (checkbox.checked) {
                    item.classList.add('checked');
                } else {
                    item.classList.remove('checked');
                }
            });
            
            // Handle clicking on the label
            item.addEventListener('click', (e) => {
                if (e.target !== checkbox) {
                    e.preventDefault();
                    checkbox.checked = !checkbox.checked;
                    checkbox.dispatchEvent(new Event('change'));
                }
            });
        }
    });
}

// Export functions for testing (if needed)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        isValidEmail,
        handleFormSubmit,
        showFormMessage,
        hideFormMessage,
        initCircularSplitButton,
        initPopupFormHandling
    };
}
