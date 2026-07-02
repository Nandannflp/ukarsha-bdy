document.addEventListener('DOMContentLoaded', () => {
    // --- 1. Theme Toggle (Light/Dark Mode) ---
    const themeToggleBtn = document.getElementById('theme-toggle');
    const body = document.body;
    
    // Check local storage for theme preference
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
        body.classList.replace('light-mode', 'dark-mode');
        themeToggleBtn.textContent = '☀️';
    }

    themeToggleBtn.addEventListener('click', () => {
        if (body.classList.contains('light-mode')) {
            body.classList.replace('light-mode', 'dark-mode');
            themeToggleBtn.textContent = '☀️';
            localStorage.setItem('theme', 'dark');
        } else {
            body.classList.replace('dark-mode', 'light-mode');
            themeToggleBtn.textContent = '🌙';
            localStorage.setItem('theme', 'light');
        }
    });

    // --- 2. Scroll Progress Bar ---
    const progressBar = document.querySelector('.scroll-progress');
    window.addEventListener('scroll', () => {
        const scrollTop = window.scrollY;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const scrollPercent = (scrollTop / docHeight) * 100;
        progressBar.style.width = scrollPercent + '%';
    });

    // --- 3. Background Flowers Generator ---
    const flowersContainer = document.getElementById('bg-flowers-container');
    const numFlowers = 15;
    for (let i = 0; i < numFlowers; i++) {
        const flower = document.createElement('div');
        flower.classList.add('bg-flower');
        flower.style.left = Math.random() * 100 + 'vw';
        flower.style.top = Math.random() * 100 + 'vh';
        flower.style.transform = `scale(${Math.random() * 0.5 + 0.5}) rotate(${Math.random() * 360}deg)`;
        flowersContainer.appendChild(flower);
    }

    // --- 4. Falling Stars Canvas (Snow-like effect for Dark Mode) ---
    const canvas = document.getElementById('starsCanvas');
    const ctx = canvas.getContext('2d');
    let width, height;
    let stars = [];

    function resizeCanvas() {
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;
    }
    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();

    function createStars() {
        stars = [];
        for (let i = 0; i < 150; i++) {
            stars.push({
                x: Math.random() * width,
                y: Math.random() * height,
                radius: Math.random() * 1.5 + 0.5,
                vy: Math.random() * 1 + 0.5,
                opacity: Math.random()
            });
        }
    }
    createStars();

    function drawStars() {
        ctx.clearRect(0, 0, width, height);
        // Only draw if dark mode is active to save resources
        if (body.classList.contains('dark-mode')) {
            ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
            stars.forEach(star => {
                ctx.beginPath();
                ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
                ctx.fill();

                star.y += star.vy;
                if (star.y > height) {
                    star.y = 0;
                    star.x = Math.random() * width;
                }
            });
        }
        requestAnimationFrame(drawStars);
    }
    drawStars();

    // --- 5. GSAP Scroll Animations ---
    gsap.registerPlugin(ScrollTrigger);

    const sections = document.querySelectorAll('.story-section');
    
    sections.forEach(section => {
        gsap.to(section, {
            scrollTrigger: {
                trigger: section,
                start: "top 80%", // trigger when top of section hits 80% of viewport
                end: "bottom 20%",
                toggleActions: "play none none reverse" // Play animation on scroll down, reverse on scroll up
            },
            opacity: 1,
            y: 0,
            duration: 1,
            ease: "power3.out"
        });
    });

    // Special animation for the Speed Skater section
    gsap.to('.skater', {
        scrollTrigger: {
            trigger: "#section-5",
            start: "top 60%"
        },
        x: 50,
        scale: 1.5,
        duration: 0.5,
        ease: "back.out(1.7)"
    });

    // --- 6. The Plot Twist / Surprise Mechanics ---
    const surpriseBtn = document.getElementById('surprise-btn');
    const mainContent = document.getElementById('main-content');
    const surpriseMode = document.getElementById('surprise-mode');
    
    surpriseBtn.addEventListener('click', () => {
        // Hide main content
        mainContent.style.display = 'none';
        progressBar.style.display = 'none';
        themeToggleBtn.style.display = 'none';
        
        // Show surprise section
        surpriseMode.classList.remove('hidden');
        
        // Ensure scroll is at top
        window.scrollTo(0, 0);
        
        // Launch Confetti
        launchConfetti();
        
        // GSAP entry animations for surprise text
        gsap.from(".animate-pop", { scale: 0, opacity: 0, duration: 1, ease: "elastic.out(1, 0.3)", delay: 0.2 });
        gsap.from(".animate-slide", { y: 50, opacity: 0, duration: 0.8, ease: "power2.out", delay: 0.6 });
        gsap.from(".animate-fade", { opacity: 0, duration: 1, delay: 1.2 });
        gsap.from(".media-item", { 
            scale: 0.8, 
            opacity: 0, 
            duration: 0.5, 
            stagger: 0.1, 
            delay: 1.5,
            ease: "back.out(1.5)"
        });
    });

    function launchConfetti() {
        const duration = 5000;
        const animationEnd = Date.now() + duration;
        const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 3000 };

        function randomInRange(min, max) {
            return Math.random() * (max - min) + min;
        }

        const interval = setInterval(function() {
            const timeLeft = animationEnd - Date.now();

            if (timeLeft <= 0) {
                return clearInterval(interval);
            }

            const particleCount = 50 * (timeLeft / duration);
            // Confetti originating from two sides
            confetti(Object.assign({}, defaults, { particleCount, origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 } }));
            confetti(Object.assign({}, defaults, { particleCount, origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 } }));
        }, 250);
    }
});
