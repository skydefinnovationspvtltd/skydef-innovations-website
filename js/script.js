const menuToggle = document.getElementById("menuToggle");
const navLinks = document.getElementById("navLinks");
const navItems = document.querySelectorAll(".nav-links a");
const revealItems = document.querySelectorAll(".reveal");
const currentPage = document.body.dataset.page || "index.html";
const liveSignals = document.querySelectorAll("[data-rotate-text]");
const typingSignals = document.querySelectorAll("[data-typing-text]");
const missionDashboards = document.querySelectorAll(".mission-dashboard");

const injectExperienceShell = () => {
    const loader = document.createElement("div");
    loader.className = "cinematic-loader";
    loader.innerHTML = `
        <div class="loader-core">
            <div class="loader-rings">
                <span></span>
                <span></span>
                <span></span>
            </div>
            <div class="loader-drone-path"></div>
            <p class="loader-label">Skydef Innovations Pvt Ltd</p>
            <strong class="loader-title">Command Center Initializing</strong>
            <div class="loader-status">
                <span>AI GRID</span>
                <span>DRONE LINK</span>
                <span>CYBER MESH</span>
            </div>
        </div>
    `;

    const transition = document.createElement("div");
    transition.className = "page-transition";

    const particles = document.createElement("div");
    particles.className = "particle-field";

    for (let i = 0; i < 28; i += 1) {
        const particle = document.createElement("span");
        particle.style.setProperty("--x", `${Math.random() * 100}%`);
        particle.style.setProperty("--size", `${2 + Math.random() * 5}px`);
        particle.style.setProperty("--delay", `${Math.random() * 8}s`);
        particle.style.setProperty("--duration", `${8 + Math.random() * 10}s`);
        particle.style.setProperty("--drift", `${-60 + Math.random() * 120}px`);
        particles.appendChild(particle);
    }

    document.body.prepend(loader);
    document.body.appendChild(transition);
    document.body.appendChild(particles);
};

injectExperienceShell();

const closeMenu = () => {
    if (navLinks) {
        navLinks.classList.remove("open");
    }

    if (menuToggle) {
        menuToggle.classList.remove("active");
        menuToggle.setAttribute("aria-expanded", "false");
    }
};

if (menuToggle && navLinks) {
    menuToggle.setAttribute("aria-expanded", "false");
    menuToggle.addEventListener("click", () => {
        navLinks.classList.toggle("open");
        menuToggle.classList.toggle("active");
        menuToggle.setAttribute("aria-expanded", navLinks.classList.contains("open") ? "true" : "false");
    });
}

navItems.forEach((item) => {
    if (item.getAttribute("href") === currentPage) {
        item.classList.add("active");
    }

    item.addEventListener("click", closeMenu);
});

if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.classList.add("visible");
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.12, rootMargin: "0px 0px -60px 0px" });

    revealItems.forEach((item) => observer.observe(item));
} else {
    const revealOnScroll = () => {
        revealItems.forEach((item) => {
            const top = item.getBoundingClientRect().top;

            if (top < window.innerHeight - 90) {
                item.classList.add("visible");
            }
        });
    };

    window.addEventListener("scroll", revealOnScroll);
    window.addEventListener("load", revealOnScroll);
}

liveSignals.forEach((signal) => {
    const values = (signal.dataset.rotateText || "")
        .split("|")
        .map((value) => value.trim())
        .filter(Boolean);

    if (values.length < 2) {
        return;
    }

    let index = 0;

    window.setInterval(() => {
        index = (index + 1) % values.length;
        signal.textContent = values[index];
    }, 2400);
});

typingSignals.forEach((signal) => {
    const values = (signal.dataset.typingText || "")
        .split("|")
        .map((value) => value.trim())
        .filter(Boolean);

    if (!values.length) {
        return;
    }

    let phraseIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let pauseUntil = 0;

    const tick = () => {
        const phrase = values[phraseIndex];
        const now = Date.now();

        if (now < pauseUntil) {
            window.setTimeout(tick, 90);
            return;
        }

        if (isDeleting) {
            charIndex = Math.max(0, charIndex - 1);
        } else {
            charIndex = Math.min(phrase.length, charIndex + 1);
        }

        signal.textContent = phrase.slice(0, charIndex);

        if (!isDeleting && charIndex === phrase.length) {
            isDeleting = true;
            pauseUntil = now + 1500;
            window.setTimeout(tick, 90);
            return;
        }

        if (isDeleting && charIndex === 0) {
            isDeleting = false;
            phraseIndex = (phraseIndex + 1) % values.length;
            pauseUntil = now + 250;
            window.setTimeout(tick, 120);
            return;
        }

        window.setTimeout(tick, isDeleting ? 28 : 52);
    };

    signal.textContent = "";
    tick();
});

missionDashboards.forEach((dashboard) => {
    const resetParallax = () => {
        dashboard.style.setProperty("--parallax-x", "0px");
        dashboard.style.setProperty("--parallax-y", "0px");
    };

    dashboard.addEventListener("pointermove", (event) => {
        if (window.innerWidth < 1024) {
            resetParallax();
            return;
        }

        const rect = dashboard.getBoundingClientRect();
        const offsetX = ((event.clientX - rect.left) / rect.width - 0.5) * 18;
        const offsetY = ((event.clientY - rect.top) / rect.height - 0.5) * 18;
        dashboard.style.setProperty("--parallax-x", `${offsetX.toFixed(2)}px`);
        dashboard.style.setProperty("--parallax-y", `${offsetY.toFixed(2)}px`);
    });

    dashboard.addEventListener("pointerleave", resetParallax);
    window.addEventListener("resize", () => {
        if (window.innerWidth < 1024) {
            resetParallax();
        }
    });
});

document.querySelectorAll("a[href$='.html']").forEach((link) => {
    link.addEventListener("click", (event) => {
        const href = link.getAttribute("href");

        if (!href || href === currentPage || event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) {
            return;
        }

        event.preventDefault();
        document.body.classList.add("page-leaving");
        closeMenu();

        window.setTimeout(() => {
            window.location.href = href;
        }, 420);
    });
});

window.addEventListener("resize", () => {
    if (window.innerWidth >= 1024) {
        closeMenu();
    }
});

window.addEventListener("load", () => {
    document.body.classList.add("page-ready");

    const loader = document.querySelector(".cinematic-loader");
    if (loader) {
        window.setTimeout(() => {
            loader.classList.add("loader-hidden");
            window.setTimeout(() => {
                loader.remove();
            }, 900);
        }, 900);
    }
});
