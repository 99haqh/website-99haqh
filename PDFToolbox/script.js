(function () {
  var prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var root = document.documentElement;
  var hero = document.querySelector("[data-parallax-scene]");
  var privacy = document.querySelector(".privacy-section");
  var gallery = document.querySelector("[data-gallery-parallax]");
  var revealItems = Array.prototype.slice.call(document.querySelectorAll(".reveal"));
  var ticking = false;

  function clamp(value, min, max) {
    return Math.max(min, Math.min(max, value));
  }

  function setDelays() {
    revealItems.forEach(function (item) {
      if (item.dataset.delay) {
        item.style.setProperty("--delay", item.dataset.delay + "ms");
      }
    });
  }

  function updateParallax() {
    ticking = false;

    if (prefersReducedMotion) {
      return;
    }

    var viewportHeight = window.innerHeight || 1;

    if (hero) {
      var heroRect = hero.getBoundingClientRect();
      var heroProgress = clamp(-heroRect.top / Math.max(heroRect.height, 1), -0.2, 1.2);
      root.style.setProperty("--hero-shift", (heroProgress * 130).toFixed(2) + "px");
    }

    if (privacy) {
      var privacyRect = privacy.getBoundingClientRect();
      var privacyProgress = clamp((viewportHeight - privacyRect.top) / (viewportHeight + privacyRect.height), 0, 1);
      root.style.setProperty("--privacy-shift", ((privacyProgress - 0.5) * 120).toFixed(2) + "px");
    }

    if (gallery) {
      var galleryRect = gallery.getBoundingClientRect();
      var galleryProgress = clamp((viewportHeight - galleryRect.top) / (viewportHeight + galleryRect.height), 0, 1);
      root.style.setProperty("--gallery-shift", ((galleryProgress - 0.5) * 150).toFixed(2) + "px");
    }
  }

  function requestParallaxUpdate() {
    if (!ticking) {
      ticking = true;
      window.requestAnimationFrame(updateParallax);
    }
  }

  setDelays();

  if ("IntersectionObserver" in window && !prefersReducedMotion) {
    var revealObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            revealObserver.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.16,
        rootMargin: "0px 0px -8% 0px"
      }
    );

    revealItems.forEach(function (item) {
      revealObserver.observe(item);
    });

    window.setTimeout(function () {
      revealItems.forEach(function (item) {
        item.classList.add("is-visible");
      });
    }, 900);
  } else {
    revealItems.forEach(function (item) {
      item.classList.add("is-visible");
    });
  }

  window.addEventListener("scroll", requestParallaxUpdate, { passive: true });
  window.addEventListener("resize", requestParallaxUpdate);
  requestParallaxUpdate();
})();
