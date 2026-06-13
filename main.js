document.addEventListener('DOMContentLoaded', () => {
    // 1. Page Fade In
    document.body.classList.add('page-fade-in');

    // 3. Floating Parallax Shapes (Hero Background)
    const hero = document.querySelector('.hero-section');
    const shapes = document.querySelectorAll('.shape');
    if (hero && shapes.length > 0 && window.innerWidth > 1024) {
        hero.addEventListener('mousemove', (e) => {
            const { width, height } = hero.getBoundingClientRect();
            const offX = (e.clientX - width / 2) / width;
            const offY = (e.clientY - height / 2) / height;
            
            shapes.forEach((shape, index) => {
                const depth = (index + 1) * 25;
                const moveX = offX * depth;
                const moveY = offY * depth;
                shape.style.transform = `translate(${moveX}px, ${moveY}px)`;
            });
        });
    }

    // 4. Header Scroll Frosted Glass Effect
    const header = document.querySelector('header');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });

    // 5. Mobile Hamburger Drawer Menu
    const hamburger = document.getElementById('hamburger-menu');
    const navMenu = document.getElementById('nav-menu');
    if (hamburger && navMenu) {
        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('active');
            navMenu.classList.toggle('mobile-open');
        });
        
        // Close menu when clicking navigation links
        const navLinks = document.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                hamburger.classList.remove('active');
                navMenu.classList.remove('mobile-open');
            });
        });
    }

    // 6. Scroll Trigger Reveal Animations
    const revealElements = document.querySelectorAll('.reveal');
    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });

    revealElements.forEach(el => {
        revealObserver.observe(el);
    });

    // 7. Stat Counters Animation
    const stats = document.querySelectorAll('.counter-number');
    const animateCounters = () => {
        stats.forEach(counter => {
            const target = +counter.getAttribute('data-target');
            const duration = 2000; // ms
            const step = (target / duration) * 10;
            let current = 0;
            
            const updateCount = () => {
                current += step;
                if (current < target) {
                    counter.innerText = Math.ceil(current);
                    setTimeout(updateCount, 10);
                } else {
                    // Make sure it displays precisely the target (with + or % if specified in html text layout)
                    counter.innerText = target;
                }
            };
            updateCount();
        });
    };

    const statsSection = document.querySelector('.stats-bar-section');
    if (statsSection && stats.length > 0) {
        const statsObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    animateCounters();
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.6 });
        statsObserver.observe(statsSection);
    }

    // 8. Client Logos Infinite Marquee Loop
    const marqueeTrack = document.getElementById('marquee-track');
    if (marqueeTrack) {
        // Clone the content of marqueeTrack once to make seamless infinite loop
        const innerHTML = marqueeTrack.innerHTML;
        marqueeTrack.innerHTML = innerHTML + innerHTML;
    }

    // 9. Client Reviews Auto-Playing & Draggable Carousel
    const reviewsCarousel = document.getElementById('reviews-carousel');
    if (reviewsCarousel) {
        let isDown = false;
        let startX;
        let scrollLeft;
        let autoplayInterval;

        const startAutoplay = () => {
            autoplayInterval = setInterval(() => {
                // Scroll right slightly
                const cardWidth = 424; // Card width + gap
                const currentScroll = reviewsCarousel.scrollLeft;
                const maxScroll = reviewsCarousel.scrollWidth - reviewsCarousel.clientWidth;
                
                if (currentScroll >= maxScroll - 10) {
                    reviewsCarousel.scrollTo({ left: 0, behavior: 'smooth' });
                } else {
                    reviewsCarousel.scrollBy({ left: cardWidth, behavior: 'smooth' });
                }
            }, 4000);
        };

        const stopAutoplay = () => {
            clearInterval(autoplayInterval);
        };

        // Autoplay initiation
        startAutoplay();
        
        reviewsCarousel.addEventListener('mouseenter', stopAutoplay);
        reviewsCarousel.addEventListener('mouseleave', startAutoplay);

        // Mouse Drag scroll
        reviewsCarousel.addEventListener('mousedown', (e) => {
            isDown = true;
            reviewsCarousel.style.cursor = 'grabbing';
            startX = e.pageX - reviewsCarousel.offsetLeft;
            scrollLeft = reviewsCarousel.scrollLeft;
        });

        reviewsCarousel.addEventListener('mouseleave', () => {
            isDown = false;
            reviewsCarousel.style.cursor = 'grab';
        });

        reviewsCarousel.addEventListener('mouseup', () => {
            isDown = false;
            reviewsCarousel.style.cursor = 'grab';
        });

        reviewsCarousel.addEventListener('mousemove', (e) => {
            if (!isDown) return;
            e.preventDefault();
            const x = e.pageX - reviewsCarousel.offsetLeft;
            const walk = (x - startX) * 1.5; // Scroll speed
            reviewsCarousel.scrollLeft = scrollLeft - walk;
        });
    }

    // 10. Portfolio Filtering Logic (work.html)
    const filterButtons = document.querySelectorAll('.filter-btn');
    const portfolioCards = document.querySelectorAll('.portfolio-card');
    
    if (filterButtons.length > 0 && portfolioCards.length > 0) {
        filterButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                // Set active class
                filterButtons.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                
                const filter = btn.getAttribute('data-filter');
                
                portfolioCards.forEach(card => {
                    const category = card.getAttribute('data-category');
                    if (filter === 'all' || category === filter) {
                        card.style.display = 'block';
                        // Add subtle reveal effect
                        setTimeout(() => {
                            card.style.opacity = '1';
                            card.style.transform = 'scale(1)';
                        }, 50);
                    } else {
                        card.style.opacity = '0';
                        card.style.transform = 'scale(0.8)';
                        setTimeout(() => {
                            card.style.display = 'none';
                        }, 300);
                    }
                });
            });
        });
    }

    // 11. FAQ Accordion Logic (faq.html)
    const faqItems = document.querySelectorAll('.faq-item');
    if (faqItems.length > 0) {
        faqItems.forEach(item => {
            const headerBtn = item.querySelector('.faq-header');
            const content = item.querySelector('.faq-content');
            
            headerBtn.addEventListener('click', () => {
                const isOpen = item.classList.contains('active');
                
                // Close all other items first
                faqItems.forEach(otherItem => {
                    otherItem.classList.remove('active');
                    otherItem.querySelector('.faq-content').style.maxHeight = null;
                });
                
                // Toggle current item
                if (!isOpen) {
                    item.classList.add('active');
                    content.style.maxHeight = content.scrollHeight + 'px';
                }
            });
        });
    }

    // 12. Contact Form Submission Handling (contact.html)
    const contactForm = document.getElementById('contact-form');
    const successMsg = document.getElementById('success-message');
    if (contactForm && successMsg) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            // Basic fields grab
            const name = document.getElementById('name').value;
            const email = document.getElementById('email').value;
            const project = document.getElementById('project').value;
            
            // Perform dummy loading on the button
            const submitBtn = contactForm.querySelector('.form-btn');
            const originalText = submitBtn.innerHTML;
            submitBtn.disabled = true;
            submitBtn.innerHTML = 'Sending... <i class="fas fa-spinner fa-spin"></i>';
            
            // Simulate API request
            setTimeout(() => {
                submitBtn.disabled = false;
                submitBtn.innerHTML = originalText;
                
                // Reset form
                contactForm.reset();
                
                // Hide form and show success message
                contactForm.style.display = 'none';
                successMsg.style.display = 'block';
                
                // Smooth scroll to top of form section
                successMsg.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }, 1500);
        });
    }
});
