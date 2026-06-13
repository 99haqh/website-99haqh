(function () {
    var prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    var root = document.documentElement;
    var hero = document.querySelector("[data-parallax-scene]");
    var preview = document.querySelector("[data-preview-parallax]");
    var revealItems = Array.prototype.slice.call(document.querySelectorAll(".reveal"));
    var previewItems = preview ? Array.prototype.slice.call(preview.querySelectorAll("[data-depth]")) : [];
    var ticking = false;

    previewItems.forEach(function (item) {
        item.style.setProperty("--depth", item.getAttribute("data-depth"));
    });

    function clamp(value, min, max) {
        return Math.max(min, Math.min(max, value));
    }

    function updateParallax() {
        ticking = false;

        if (prefersReducedMotion) {
            return;
        }

        if (hero) {
            var heroRect = hero.getBoundingClientRect();
            var heroProgress = clamp(-heroRect.top / Math.max(heroRect.height, 1), -0.2, 1.25);
            root.style.setProperty("--hero-shift", (heroProgress * 120).toFixed(2) + "px");
        }

        if (preview) {
            var previewRect = preview.getBoundingClientRect();
            var viewportHeight = window.innerHeight || 1;
            var previewProgress = clamp((viewportHeight - previewRect.top) / (viewportHeight + previewRect.height), 0, 1);
            root.style.setProperty("--preview-shift", ((previewProgress - 0.5) * 130).toFixed(2) + "px");
        }
    }

    function requestParallaxUpdate() {
        if (!ticking) {
            ticking = true;
            window.requestAnimationFrame(updateParallax);
        }
    }

    if ("IntersectionObserver" in window) {
        var revealObserver = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    entry.target.classList.add("is-visible");
                    revealObserver.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.18,
            rootMargin: "0px 0px -8% 0px"
        });

        revealItems.forEach(function (item) {
            revealObserver.observe(item);
        });
    } else {
        revealItems.forEach(function (item) {
            item.classList.add("is-visible");
        });
    }

    window.addEventListener("scroll", requestParallaxUpdate, { passive: true });
    window.addEventListener("resize", requestParallaxUpdate);
    requestParallaxUpdate();
})();
