// DOM Elements
const burger = document.querySelector('.burger');
const nav = document.querySelector('.nav-links');
const navLinks = document.querySelectorAll('.nav-links li');
const header = document.querySelector('header');
const contactForm = document.getElementById('contactForm');

// Toggle Navigation
function toggleNav() {
    // Toggle nav
    nav.classList.toggle('active');

    // Animate links
    navLinks.forEach((link, index) => {
        if (link.style.animation) {
            link.style.animation = '';
        } else {
            link.style.animation = `navLinkFade 0.5s ease forwards ${index / 7 + 0.3}s`;
        }
    });

    // Burger animation
    burger.classList.toggle('active');
}

// Scroll Effects
function scrollFunction() {
    if (document.body.scrollTop > 50 || document.documentElement.scrollTop > 50) {
        header.classList.add('scrolled');
    } else {
        header.classList.remove('scrolled');
    }
}

// Smooth Scroll for Navigation Links
function smoothScroll(e) {
    e.preventDefault();

    // Close mobile menu if open
    if (nav.classList.contains('active')) {
        toggleNav();
    }

    const targetId = this.getAttribute('href');
    const targetPosition = document.querySelector(targetId).offsetTop;
    const startPosition = window.pageYOffset;
    const distance = targetPosition - startPosition - 70; // Adjust for header height
    const duration = 1000;
    let start = null;

    function animation(currentTime) {
        if (start === null) start = currentTime;
        const timeElapsed = currentTime - start;
        const run = ease(timeElapsed, startPosition, distance, duration);
        window.scrollTo(0, run);
        if (timeElapsed < duration) requestAnimationFrame(animation);
    }

    // Easing function
    function ease(t, b, c, d) {
        t /= d / 2;
        if (t < 1) return c / 2 * t * t + b;
        t--;
        return -c / 2 * (t * (t - 2) - 1) + b;
    }

    requestAnimationFrame(animation);
}

// Form Validation and Submission
function handleFormSubmit(e) {
    // Prevent default form submission
    e.preventDefault();

    // Get form values
    const name = document.getElementById('name').value.trim();
    const email = document.getElementById('email').value.trim();
    const subject = document.getElementById('subject').value.trim();
    const message = document.getElementById('message').value.trim();

    // Simple validation
    if (name === '' || email === '' || subject === '' || message === '') {
        showFormAlert('Veuillez remplir tous les champs', 'error');
        return;
    }

    // Email validation
    if (!isValidEmail(email)) {
        showFormAlert('Veuillez entrer une adresse email valide', 'error');
        return;
    }

    // Show loading state on button
    const submitButton = document.querySelector('#contactForm button[type="submit"]');
    if (submitButton) {
        submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Envoi en cours...';
        submitButton.disabled = true;
    }

    // Create FormData object
    const formData = new FormData(contactForm);

    // Add hidden fields that were previously in the HTML form
    formData.append('_subject', 'Nouveau message du portfolio');
    formData.append('_captcha', 'false');

    // Submit form data using fetch API
    fetch('https://formsubmit.co/4780941f2534607dd8ef1dc01bc664c1', {
        method: 'POST',
        body: formData
    })
    .then(response => {
        if (response.ok) {
            // Show success message
            showFormAlert('Votre message a été envoyé avec succès!', 'success');

            // Reset form
            contactForm.reset();
        } else {
            // Show error message
            showFormAlert('Une erreur est survenue. Veuillez réessayer.', 'error');
        }
    })
    .catch(error => {
        // Show error message
        showFormAlert('Une erreur est survenue. Veuillez réessayer.', 'error');
        console.error('Error:', error);
    })
    .finally(() => {
        // Reset button state
        if (submitButton) {
            submitButton.innerHTML = 'Envoyer';
            submitButton.disabled = false;
        }
    });
}

// Helper function to validate email
function isValidEmail(email) {
    const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
}

// Show form alert message
function showFormAlert(message, type) {
    // Check if alert already exists and remove it
    const existingAlert = document.querySelector('.form-alert');
    if (existingAlert) {
        existingAlert.remove();
    }

    // Create alert element
    const alertElement = document.createElement('div');
    alertElement.className = `form-alert ${type}`;
    alertElement.textContent = message;

    // Insert alert before the form
    contactForm.parentNode.insertBefore(alertElement, contactForm);

    // Remove alert after 3 seconds
    setTimeout(() => {
        alertElement.remove();
    }, 3000);
}

// Skill Animation on Scroll
function animateSkillsOnScroll() {
    const skillsSection = document.querySelector('.skills');
    const skillBars = document.querySelectorAll('.skill-progress');

    // Check if skills section is in viewport
    const sectionPosition = skillsSection.getBoundingClientRect().top;
    const screenPosition = window.innerHeight / 1.3;

    if (sectionPosition < screenPosition) {
        skillBars.forEach(bar => {
            const width = bar.style.width;
            bar.style.width = '0';
            setTimeout(() => {
                bar.style.transition = 'width 1s ease';
                bar.style.width = width;
            }, 100);
        });

        // Remove event listener once animation is triggered
        window.removeEventListener('scroll', animateSkillsOnScroll);
    }
}

// Project Filter (if needed in the future)
function filterProjects(category) {
    const projects = document.querySelectorAll('.project-card');

    projects.forEach(project => {
        const projectCategories = project.dataset.categories.split(',');

        if (category === 'all' || projectCategories.includes(category)) {
            project.style.display = 'block';
        } else {
            project.style.display = 'none';
        }
    });
}

// This function has been removed as we now handle the success message directly in the form submission

// Event Listeners
document.addEventListener('DOMContentLoaded', function() {
    // Mobile Navigation
    burger.addEventListener('click', toggleNav);

    // Smooth Scroll for Navigation Links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', smoothScroll);
    });

    // Header Scroll Effect
    window.addEventListener('scroll', scrollFunction);

    // Form Submission
    if (contactForm) {
        contactForm.addEventListener('submit', handleFormSubmit);
    }

    // Animate skills on scroll
    window.addEventListener('scroll', animateSkillsOnScroll);

    // Add CSS for form alerts
    const style = document.createElement('style');
    style.textContent = `
        .form-alert {
            padding: 12px;
            border-radius: 5px;
            margin-bottom: 20px;
            font-weight: 500;
        }
        .form-alert.success {
            background-color: rgba(16, 185, 129, 0.1);
            color: #10b981;
            border: 1px solid #10b981;
        }
        .form-alert.error {
            background-color: rgba(239, 68, 68, 0.1);
            color: #ef4444;
            border: 1px solid #ef4444;
        }
        @keyframes navLinkFade {
            from {
                opacity: 0;
                transform: translateX(50px);
            }
            to {
                opacity: 1;
                transform: translateX(0);
            }
        }
    `;
    document.head.appendChild(style);
});
