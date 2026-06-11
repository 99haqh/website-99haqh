(function () {
    var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

    if (reduceMotion.matches) {
        return;
    }

    var root = document.documentElement;
    var scene = document.querySelector("[data-parallax-scene]");
    var gallery = document.querySelector("[data-parallax-gallery]");
    var parallaxItems = Array.prototype.slice.call(document.querySelectorAll("[data-parallax]"));
    var galleryItems = gallery ? Array.prototype.slice.call(gallery.querySelectorAll("[data-depth]")) : [];
    var pointerX = 0;
    var pointerY = 0;
    var ticking = false;

    parallaxItems.forEach(function (item) {
        item.style.setProperty("--depth", item.getAttribute("data-parallax"));
    });

    galleryItems.forEach(function (item) {
        item.style.setProperty("--gallery-depth", item.getAttribute("data-depth"));
    });

    function clamp(value, min, max) {
        return Math.max(min, Math.min(max, value));
    }

    function update() {
        ticking = false;

        if (scene) {
            var sceneRect = scene.getBoundingClientRect();
            var sceneProgress = clamp(-sceneRect.top / Math.max(sceneRect.height, 1), -0.2, 1.2);
            root.style.setProperty("--scroll-y", (sceneProgress * 72).toFixed(2) + "px");
        }

        root.style.setProperty("--mouse-x", pointerX.toFixed(2) + "px");
        root.style.setProperty("--mouse-y", pointerY.toFixed(2) + "px");

        if (gallery) {
            var galleryRect = gallery.getBoundingClientRect();
            var windowHeight = window.innerHeight || 1;
            var galleryProgress = clamp((windowHeight - galleryRect.top) / (windowHeight + galleryRect.height), 0, 1);
            gallery.style.setProperty("--gallery-y", ((galleryProgress - 0.5) * 80).toFixed(2) + "px");
        }
    }

    function requestUpdate() {
        if (!ticking) {
            ticking = true;
            window.requestAnimationFrame(update);
        }
    }

    window.addEventListener("scroll", requestUpdate, { passive: true });
    window.addEventListener("resize", requestUpdate);

    window.addEventListener("pointermove", function (event) {
        var width = window.innerWidth || 1;
        var height = window.innerHeight || 1;
        pointerX = clamp((event.clientX / width - 0.5) * 42, -24, 24);
        pointerY = clamp((event.clientY / height - 0.5) * 34, -20, 20);
        requestUpdate();
    }, { passive: true });

    window.addEventListener("pointerleave", function () {
        pointerX = 0;
        pointerY = 0;
        requestUpdate();
    });

    requestUpdate();
})();
