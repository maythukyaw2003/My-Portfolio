/* ── Reveal on scroll ── */
const revealItems = document.querySelectorAll(".reveal");
const navLinks = document.querySelectorAll(".nav-pill a");
const sections = document.querySelectorAll("section[id]");

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add("visible");
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.16 });

revealItems.forEach((item, index) => {
  item.style.transitionDelay = `${Math.min(index * 70, 280)}ms`;
  revealObserver.observe(item);
});

const activeObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (!entry.isIntersecting) return;
    navLinks.forEach((link) => {
      link.classList.toggle("active", link.getAttribute("href") === `#${entry.target.id}`);
    });
  });
}, { rootMargin: "-35% 0px -55% 0px" });

sections.forEach((section) => activeObserver.observe(section));

/* ── Projects Carousel ── */
(function () {
  const track = document.querySelector(".carousel-track");
  const viewport = document.querySelector(".carousel-viewport");
  const prevBtn = document.querySelector(".carousel-prev");
  const nextBtn = document.querySelector(".carousel-next");
  const dotsContainer = document.getElementById("carouselDots");

  if (!track || !viewport || !prevBtn || !nextBtn || !dotsContainer) return;

  const cards = Array.from(track.querySelectorAll(".project-card"));
  const total = cards.length;
  let current = 0;

  function visibleCount() {
    const vw = window.innerWidth;
    if (vw <= 680) return 1;
    if (vw <= 1024) return 2;
    return 3;
  }

  function maxIndex() {
    return Math.max(0, total - visibleCount());
  }

  function cardWidth() {
    if (cards.length === 0) return 0;
    return cards[0].getBoundingClientRect().width;
  }

  function gapPx() {
    const gap = parseInt(getComputedStyle(track).gap, 10);
    return isNaN(gap) ? 22 : gap;
  }

  function buildDots() {
    dotsContainer.innerHTML = "";
    const count = maxIndex() + 1;
    for (let i = 0; i < count; i++) {
      const btn = document.createElement("button");
      btn.className = "carousel-dot" + (i === 0 ? " active" : "");
      btn.setAttribute("aria-label", `Go to project ${i + 1}`);
      btn.addEventListener("click", () => goTo(i));
      dotsContainer.appendChild(btn);
    }
  }

  function updateDots() {
    const dots = dotsContainer.querySelectorAll(".carousel-dot");
    dots.forEach((d, i) => d.classList.toggle("active", i === current));
  }

  function goTo(index) {
    current = Math.max(0, Math.min(index, maxIndex()));
    const offset = current * (cardWidth() + gapPx());
    track.style.transform = `translateX(-${offset}px)`;
    prevBtn.disabled = current === 0;
    nextBtn.disabled = current >= maxIndex();
    updateDots();
  }

  prevBtn.addEventListener("click", () => goTo(current - 1));
  nextBtn.addEventListener("click", () => goTo(current + 1));

  let resizeTimer;
  window.addEventListener("resize", () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      current = Math.min(current, maxIndex());
      buildDots();
      goTo(current);
    }, 120);
  });

  buildDots();
  goTo(0);
})();
