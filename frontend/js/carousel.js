/**
 * Carousel Component
 * Handles switching between slides in the sidebar carousel
 */

class Carousel {
    constructor() {
        this.slides = document.querySelectorAll('.carousel-slide');
        this.dots = document.querySelectorAll('.carousel-dots .dot');
        this.currentIndex = 0;

        this.init();
    }

    init() {
        if (this.slides.length === 0) return;

        // Add click events to dots
        this.dots.forEach((dot, index) => {
            dot.addEventListener('click', () => {
                this.goToSlide(index);
            });
        });

        console.log('🎠 Carousel initialized');
    }

    goToSlide(index) {
        // Remove active class from current
        this.slides[this.currentIndex].classList.remove('active');
        this.dots[this.currentIndex].classList.remove('active');

        // Update index
        this.currentIndex = index;

        // Add active class to new
        this.slides[this.currentIndex].classList.add('active');
        this.dots[this.currentIndex].classList.add('active');
    }
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        window.carousel = new Carousel();
    });
} else {
    window.carousel = new Carousel();
}
