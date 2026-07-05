document.addEventListener('DOMContentLoaded', () => {
    // 1. Navbar Scroll Effect
    const navbar = document.querySelector('.navbar');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // 2. Swiper Carousel Initialization
    const swiper = new Swiper('.plans-swiper', {
        slidesPerView: 1,
        spaceBetween: 24,
        loop: true,
        autoplay: {
            delay: 4000,
            disableOnInteraction: false,
            pauseOnMouseEnter: true,
        },
        keyboard: {
            enabled: true,
        },
        navigation: {
            nextEl: '.swiper-button-next',
            prevEl: '.swiper-button-prev',
        },
        breakpoints: {
            768: {
                slidesPerView: 2,
            },
            992: {
                slidesPerView: 3,
            },
            1200: {
                slidesPerView: 4,
            },
        },
    });

    // 3. Dynamic Category Filtering
    const filterButtons = document.querySelectorAll('.filter-btn');
    const allSlides = document.querySelectorAll('.plans-swiper .swiper-slide');

    filterButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            // Update active state
            filterButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const filterValue = btn.getAttribute('data-filter');

            // Show/Hide logic
            allSlides.forEach(slide => {
                if (filterValue === 'all') {
                    slide.classList.remove('hidden');
                } else {
                    if (slide.getAttribute('data-category') === filterValue) {
                        slide.classList.remove('hidden');
                    } else {
                        slide.classList.add('hidden');
                    }
                }
            });

            // Update swiper after hiding/showing elements
            swiper.update();
            swiper.slideToLoop(0); // Reset to first slide of current filter
        });
    });


    // 4. Animated Counters for Stats
    const counters = document.querySelectorAll('.stats-strip h2, .stat-number');
    const speed = 50;

    const animateCounters = () => {
        counters.forEach(counter => {
            const updateCount = () => {
                const targetText = counter.getAttribute('data-target-text');
                const target = +targetText.replace(/,/g, '').replace(/\+/g, '').replace(/%/g, '');
                const current = +counter.getAttribute('data-count') || 0;
                
                const hasPlus = targetText.includes('+');
                const hasPercent = targetText.includes('%');
                
                const inc = target / speed;

                if (current < target) {
                    const nextVal = Math.ceil(current + inc);
                    counter.setAttribute('data-count', nextVal);
                    
                    let displayVal = nextVal.toLocaleString('en-IN');
                    if (hasPlus) displayVal += '<span class="text-green">+</span>';
                    if (hasPercent) displayVal += '<span class="text-green">%</span>';

                    counter.innerHTML = displayVal;
                    setTimeout(updateCount, 20);
                } else {
                    // Final formatting
                    let displayVal = target.toLocaleString('en-IN');
                    if (hasPlus) displayVal += '<span class="text-green">+</span>';
                    if (hasPercent) displayVal += '<span class="text-green">%</span>';
                    counter.innerHTML = displayVal;
                }
            };
            
            if (!counter.getAttribute('data-target-text')) {
                counter.setAttribute('data-target-text', counter.innerText);
                counter.innerText = '0';
                updateCount();
            }
        });
    };

    // 5. Intersection Observer for Fade-Ins and Counters
    const observerOptions = {
        threshold: 0.1,
        rootMargin: "0px 0px -50px 0px"
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in-visible');
                
                if (entry.target.classList.contains('stats-strip')) {
                    animateCounters();
                }
                
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    const elementsToAnimate = document.querySelectorAll('.plan-card, .story-card, .officer-card, .pricing-card, .stats-strip');
    elementsToAnimate.forEach(el => {
        el.classList.add('fade-in-hidden');
        observer.observe(el);
    });

    // 6. Toast Notifications for "Get Quote" & "Choose Plan"
    const actionButtons = document.querySelectorAll('.plan-card .btn, .pricing-card .btn');
    
    let toastContainer = document.querySelector('.toast-container');
    if (!toastContainer) {
        toastContainer = document.createElement('div');
        toastContainer.className = 'toast-container position-fixed bottom-0 end-0 p-3';
        toastContainer.style.zIndex = '1055';
        document.body.appendChild(toastContainer);
    }

    actionButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            
            const toastId = 'toast-' + Date.now();
            const toastHTML = `
                <div id="${toastId}" class="toast align-items-center text-bg-success border-0" role="alert" aria-live="assertive" aria-atomic="true">
                    <div class="d-flex">
                        <div class="toast-body">
                            <i class="fa-solid fa-circle-check me-2"></i> Action processed successfully! Redirecting...
                        </div>
                        <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast" aria-label="Close"></button>
                    </div>
                </div>
            `;
            toastContainer.insertAdjacentHTML('beforeend', toastHTML);
            
            const toastEl = document.getElementById(toastId);
            const toast = new bootstrap.Toast(toastEl, { delay: 3000 });
            toast.show();
            
            toastEl.addEventListener('hidden.bs.toast', () => {
                toastEl.remove();
            });
            
            const originalText = btn.innerHTML;
            btn.innerHTML = '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Loading...';
            btn.classList.add('disabled');
            
            setTimeout(() => {
                btn.innerHTML = originalText;
                btn.classList.remove('disabled');
            }, 1000);
        });
    });

    // 6. Expandable Story Cards
    const readMoreBtns = document.querySelectorAll('.read-more-btn');
    readMoreBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            const card = e.target.closest('.story-card');
            if (card) {
                const isExpanded = card.classList.contains('expanded');
                
                if (isExpanded) {
                    card.classList.remove('expanded');
                    btn.innerHTML = 'Read More <i class="fa-solid fa-chevron-down ms-1"></i>';
                } else {
                    card.classList.add('expanded');
                    btn.innerHTML = 'Read Less <i class="fa-solid fa-chevron-up ms-1"></i>';
                }
            }
        });
    });

    // 7. Testimonials Swiper Initialization
    const testimonialsSwiper = new Swiper('.testimonials-swiper', {
        slidesPerView: 1,
        spaceBetween: 30,
        loop: true,
        autoplay: {
            delay: 5000,
            disableOnInteraction: false,
            pauseOnMouseEnter: true,
        },
        pagination: {
            el: '.swiper-pagination',
            clickable: true,
        },
        keyboard: {
            enabled: true,
        }
    });
});