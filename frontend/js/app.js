document.addEventListener('DOMContentLoaded', () => {

    // ==========================================
    // NAVBAR SCROLL BEHAVIOR
    // ==========================================
    const navbar = document.querySelector('.custom-navbar');

    window.addEventListener('scroll', () => {
        if (window.scrollY > 40) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });
    // ==========================================
    // MOBILE MENU NAV TOGGLER
    // ==========================================
    const mobileToggle = document.getElementById('mobileNavToggle');
    const navMenu = document.getElementById('navbarMenu');
    if (mobileToggle && navMenu) {
        mobileToggle.addEventListener('click', (e) => {
            e.stopPropagation();
            navMenu.classList.toggle('active');

            // Toggle hamburger animation
            const spans = mobileToggle.querySelectorAll('span');
            if (navMenu.classList.contains('active')) {
                spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
                spans[1].style.opacity = '0';
                spans[2].style.transform = 'rotate(-45deg) translate(7px, -7px)';
            } else {
                spans[0].style.transform = 'none';
                spans[1].style.opacity = '1';
                spans[2].style.transform = 'none';
            }
        });
        // Close menu when clicking links
        navMenu.querySelectorAll('.navbar-link').forEach(link => {
            link.addEventListener('click', () => {
                navMenu.classList.remove('active');
                const spans = mobileToggle.querySelectorAll('span');
                spans[0].style.transform = 'none';
                spans[1].style.opacity = '1';
                spans[2].style.transform = 'none';
            });
        });
        // Close menu when clicking outside
        document.addEventListener('click', (e) => {
            if (navMenu.classList.contains('active') && !navMenu.contains(e.target) && !mobileToggle.contains(e.target)) {
                navMenu.classList.remove('active');
                const spans = mobileToggle.querySelectorAll('span');
                spans[0].style.transform = 'none';
                spans[1].style.opacity = '1';
                spans[2].style.transform = 'none';
            }
        });
    }
    // ==========================================
    // Active Navigation Highlight
    // ==========================================

    const sections = document.querySelectorAll("section");

    window.addEventListener("scroll", () => {

        let current = "";

        sections.forEach(section => {

            const sectionTop = section.offsetTop - 150;

            if (window.scrollY >= sectionTop) {
                current = section.getAttribute("id");
            }

        });

        document.querySelectorAll(".navbar-link").forEach(link => {

            link.classList.remove("active");

            if (link.getAttribute("href") === `#${current}`) {
                link.classList.add("active");
            }

        });

    });
    // ==========================================
    // CUSTOM SECURITY TIPS SLIDER (CAROUSEL)
    // ==========================================
    const track = document.getElementById('carouselTrack');
    const slides = Array.from(document.querySelectorAll('.carousel-slide'));
    const prevBtn = document.getElementById('carouselPrev');
    const nextBtn = document.getElementById('carouselNext');
    const indicatorContainer = document.getElementById('carouselIndicators');
    let currentSlideIndex = 0;
    let autoPlayInterval;
    if (track && slides.length > 0) {
        // Create indicators dynamically
        slides.forEach((_, idx) => {
            const indicator = document.createElement('div');
            indicator.classList.add('indicator');
            if (idx === 0) indicator.classList.add('active');
            indicator.addEventListener('click', () => {
                goToSlide(idx);
                resetAutoPlay();
            });
            indicatorContainer.appendChild(indicator);
        });
        const indicators = Array.from(indicatorContainer.querySelectorAll('.indicator'));
        const updateSlidePosition = () => {
            track.style.transform = `translateX(-${currentSlideIndex * 100}%)`;

            // Update indicators
            indicators.forEach((ind, idx) => {
                if (idx === currentSlideIndex) {
                    ind.classList.add('active');
                } else {
                    ind.classList.remove('active');
                }
            });
        };
        const goToSlide = (index) => {
            currentSlideIndex = index;
            updateSlidePosition();
        };
        const nextSlide = () => {
            if (currentSlideIndex === slides.length - 1) {
                currentSlideIndex = 0;
            } else {
                currentSlideIndex++;
            }
            updateSlidePosition();
        };
        const prevSlide = () => {
            if (currentSlideIndex === 0) {
                currentSlideIndex = slides.length - 1;
            } else {
                currentSlideIndex--;
            }
            updateSlidePosition();
        };
        nextBtn.addEventListener('click', () => {
            nextSlide();
            resetAutoPlay();
        });
        prevBtn.addEventListener('click', () => {
            prevSlide();
            resetAutoPlay();
        });
        // Autoplay logic
        const startAutoPlay = () => {
            autoPlayInterval = setInterval(nextSlide, 6000); // Change slide every 6 seconds
        };
        const resetAutoPlay = () => {
            clearInterval(autoPlayInterval);
            startAutoPlay();
        };
        startAutoPlay();
        // Pause on Hover
        const carousel = document.querySelector('.carousel-container');
        carousel.addEventListener('mouseenter', () => clearInterval(autoPlayInterval));
        carousel.addEventListener('mouseleave', () => {
            clearInterval(autoPlayInterval);
            startAutoPlay();
        });
    }
    /* ==========================
   SCROLL REVEAL
========================== */

    const revealElements = document.querySelectorAll(
        ".reveal, .reveal-left, .reveal-right, .reveal-scale"
    );

    const revealObserver = new IntersectionObserver(

        (entries) => {

            entries.forEach(entry => {

                if (entry.isIntersecting) {
                    entry.target.classList.add("active");
                    revealObserver.unobserve(entry.target);
                }

            });

        },

        {
            threshold: 0.15
        }

    );

    revealElements.forEach(element => {

        revealObserver.observe(element);

    });
    // ==========================================
    // MODULES TAG FILTER
    // ==========================================
    const filterButtons = document.querySelectorAll('.filter-btn');
    const moduleCards = document.querySelectorAll('.module-card');
    if (filterButtons.length > 0 && moduleCards.length > 0) {
        filterButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                // Update active state on buttons
                filterButtons.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                const filterValue = btn.getAttribute('data-filter');
                // Animate and filter cards
                moduleCards.forEach(card => {
                    const cardCategory = card.getAttribute('data-category');

                    if (filterValue === 'all' || cardCategory === filterValue) {
                        card.style.display = 'flex';
                        // Small timeout to trigger scale-in transition
                        setTimeout(() => {
                            card.style.opacity = '1';
                            card.style.transform = 'scale(1)';
                        }, 50);
                    } else {
                        card.style.opacity = '0';
                        card.style.transform = 'scale(0.95)';
                        // Wait for transition to complete before hiding
                        setTimeout(() => {
                            card.style.display = 'none';
                        }, 300);
                    }
                });
            });
        });
    }
    /* ==========================================
   MODULE POPUP
========================================== */

    const modal = document.getElementById("moduleModal");
    const modalBody = document.getElementById("modalBody");
    const closeModal = document.getElementById("closeModal");
    const modalOverlay = document.getElementById("modalOverlay");

    document.querySelectorAll(".module-card").forEach(card => {

        card.addEventListener("click", () => {

            const title = card.dataset.title;
            const description = card.dataset.description;
            const duration = card.dataset.duration;
            const objectives = card.dataset.objectives.split("|");
            const video = card.dataset.video;

            let listItems = "";

            objectives.forEach(item => {

                listItems += `<li>${item}</li>`;

            });

            modalBody.innerHTML = `

            <h2 class="modal-title">${title}</h2>

            <p class="modal-description">
                ${description}
            </p>
              <iframe width="100%" height="350" src="${video}" title="YouTube video" frameborder="0" allowfullscreen> </iframe>

            <div class="modal-duration">
                Duration: ${duration}
            </div>

            <h3>Learning Objectives</h3>

            <ul class="modal-list">
                ${listItems}
            </ul>
            


        `;

            modal.classList.add("active");

        });

    });

    closeModal.addEventListener("click", () => {
        modal.classList.remove("active");
    });

    modalOverlay.addEventListener("click", () => {
        modal.classList.remove("active");
    });
    // ==========================================
    // SECURITY GUARD FOR ASSESSMENT LINK
    // ==========================================
    const assessmentBtn = document.getElementById('assessmentBtn');
    const Assessments = document.getElementById('Assessments');
    [Assessments, assessmentBtn].forEach(Btn => {
        if (Btn) {
            Btn.addEventListener('click', (e) => {
                if (localStorage.getItem('isLoggedIn') !== 'true') {
                    e.preventDefault();
                    alert('Please login or create an account to access the assessment.');

                }
                else {
                    window.location.href = 'Quiz.html';
                }

            });
        }
    });

    /* ==========================================
       LOGIN / SIGNUP POPUP
    ========================================== */

    const authModal = document.getElementById("authModal");
    const accessPort = document.getElementById("accessPortal");
    const loginBtn = document.getElementById("navLoginBtn");
    const signupBtn = document.getElementById("navSignupBtn");
    const createAccountLink = document.getElementById("createAccountLink");

    const loginForm = document.getElementById("loginForm");
    const signupForm = document.getElementById("signupForm");

    const closeAuthBtn = document.querySelector(".close-modal");
    [loginBtn, accessPort].forEach(Btn => {
        if (Btn) {

            Btn.addEventListener("click", (e) => {

                e.preventDefault();

                authModal.classList.add("active");

                loginForm.classList.remove("hidden");
                signupForm.classList.add("hidden");

            });

        }
    });

    [signupBtn, createAccountLink].forEach(btn => {
        if (btn) {
            btn.addEventListener("click", (e) => {
                e.preventDefault();

                authModal.classList.add("active");

                signupForm.classList.remove("hidden");
                loginForm.classList.add("hidden");
            });
        }
    });


    if (closeAuthBtn) {

        closeAuthBtn.addEventListener("click", () => {

            authModal.classList.remove("active");

        });

    }

    document.getElementById("showSignup")
        ?.addEventListener("click", (e) => {

            e.preventDefault();

            loginForm.classList.add("hidden");
            signupForm.classList.remove("hidden");

        });

    document.getElementById("showLogin")
        ?.addEventListener("click", (e) => {

            e.preventDefault();

            signupForm.classList.add("hidden");
            loginForm.classList.remove("hidden");

        });

    window.addEventListener("click", (e) => {

        if (e.target === authModal) {

            authModal.classList.remove("active");

        }

    });
});
document.querySelectorAll('a[href^="#"]').forEach(anchor => {

    anchor.addEventListener('click', function (e) {

        e.preventDefault();

        document.querySelector(
            this.getAttribute('href')
        ).scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });

    });

});
// stats
const counters = document.querySelectorAll(".counter");

const counterObserver = new IntersectionObserver((entries) => {

    entries.forEach(entry => {

        if (entry.isIntersecting) {

            const counter = entry.target;
            const target = +counter.dataset.target;

            let count = 0;

            const updateCounter = () => {

                count += target / 80;

                if (count < target) {

                    counter.innerText = Math.ceil(count);

                    requestAnimationFrame(updateCounter);

                } else {

                    counter.innerText = target;

                }

            };

            updateCounter();

            counterObserver.unobserve(counter);

        }

    });

}, { threshold: 0.5 });


counters.forEach(counter => {
    counterObserver.observe(counter);
});

document.addEventListener("DOMContentLoaded", () => {
    const user = JSON.parse(localStorage.getItem("user"));

    if (user) {
        showLoggedInUser();
    }
});


// =========================
// Login State Functions
// =========================

function showLoggedInUser() {
    const user = JSON.parse(localStorage.getItem("user"));

    if (!user) return;

    document.getElementById("guestPanel").style.display = "none";

    document.getElementById("userName").textContent =
        user.full_name || user.name;

    document.getElementById("userPanel").style.display = "flex";
}
function logout() {
    localStorage.removeItem("user");
    localStorage.removeItem("isLoggedIn");
    window.location.href = "index.html";
}

//toast popup
function showToast(message) {
    const toast = document.getElementById("toast");

    toast.textContent = message;
    toast.classList.add("show");

    setTimeout(() => {
        toast.classList.remove("show");
    }, 1500); // 1.5 seconds
}