const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

const revealItems = document.querySelectorAll(".reveal");

if (!prefersReducedMotion) {
  revealItems.forEach((item) => {
    const delay = item.dataset.delay;
    if (delay) {
      item.style.setProperty("--delay", `${delay}ms`);
    }
  });

  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          revealObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.16 }
  );

  revealItems.forEach((item) => revealObserver.observe(item));

  const parallaxItems = document.querySelectorAll(".parallax-layer");
  let ticking = false;

  const updateParallax = () => {
    const scrollY = window.scrollY;

    parallaxItems.forEach((item) => {
      const speed = Number(item.dataset.speed || 0);
      const offset = scrollY * speed;
      item.style.setProperty("--parallax-y", `${offset}px`);

      if (item.classList.contains("side-left")) {
        item.style.transform = `translate3d(0, ${offset}px, 0) rotate(-8deg)`;
      } else if (item.classList.contains("side-right")) {
        item.style.transform = `translate3d(0, ${offset}px, 0) rotate(8deg)`;
      } else {
        item.style.transform = `translate3d(0, ${offset}px, 0)`;
      }
    });

    ticking = false;
  };

  const requestParallax = () => {
    if (!ticking) {
      window.requestAnimationFrame(updateParallax);
      ticking = true;
    }
  };

  window.addEventListener("scroll", requestParallax, { passive: true });
  updateParallax();
} else {
  revealItems.forEach((item) => item.classList.add("is-visible"));
}
