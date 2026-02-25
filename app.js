(function () {
  'use strict';

  function normalizeCategory(value) {
    if (!value) return '';
    return String(value).trim().toUpperCase();
  }

  function setupMobileNav() {
    var toggle = document.querySelector('#mobile-nav-toggle, [data-nav-toggle], .nav-toggle, #nav-toggle');
    var menu = document.querySelector('#primary-nav, [data-nav-menu], .site-nav, #site-nav');

    if (!toggle || !menu) return;

    if (!menu.id) {
      menu.id = 'site-nav-menu';
    }

    toggle.setAttribute('aria-controls', menu.id);
    toggle.setAttribute('aria-expanded', 'false');
    menu.setAttribute('data-state', 'closed');

    function setOpenState(isOpen) {
      menu.classList.toggle('is-open', isOpen);
      toggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
      menu.setAttribute('data-state', isOpen ? 'open' : 'closed');
    }

    function toggleNav() {
      var isOpen = toggle.getAttribute('aria-expanded') === 'true';
      setOpenState(!isOpen);
    }

    toggle.addEventListener('click', function (event) {
      event.preventDefault();
      toggleNav();
    });

    menu.addEventListener('click', function (event) {
      var target = event.target;
      if (!(target instanceof Element)) return;
      if (!target.closest('a')) return;
      setOpenState(false);
    });

    document.addEventListener('keydown', function (event) {
      if (event.key !== 'Escape') return;
      setOpenState(false);
    });
  }

  function setupRevealObserver() {
    var revealNodes = Array.prototype.slice.call(document.querySelectorAll('.reveal, [data-reveal]'));
    if (!revealNodes.length) return;

    function markVisible(element, index) {
      var delay = Math.max(0, index) * 80;
      element.style.transitionDelay = String(delay) + 'ms';
      element.classList.add('is-visible');
    }

    if (!('IntersectionObserver' in window)) {
      revealNodes.forEach(function (node, index) {
        markVisible(node, index);
      });
      return;
    }

    var observer = new IntersectionObserver(
      function (entries, instance) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          var index = revealNodes.indexOf(entry.target);
          markVisible(entry.target, index);
          instance.unobserve(entry.target);
        });
      },
      {
        threshold: 0.15,
        rootMargin: '0px 0px -8% 0px'
      }
    );

    revealNodes.forEach(function (node) {
      observer.observe(node);
    });
  }

  function setupCategoryFilter() {
    var section = document.querySelector('#collections');
    if (!section) return;
    var chips = Array.prototype.slice.call(section.querySelectorAll('[data-filter-chip][data-category]'));
    if (!chips.length) return;
    var items = Array.prototype.slice.call(section.querySelectorAll('[data-filter-item][data-category]'));
    if (!items.length) return;

    function applyFilter(filterName) {
      var current = normalizeCategory(filterName);
      var showAll = current === 'ALL';

      chips.forEach(function (chip) {
        var active = normalizeCategory(chip.getAttribute('data-category')) === current;
        chip.classList.toggle('is-active', active);
        chip.setAttribute('aria-pressed', active ? 'true' : 'false');
      });

      items.forEach(function (item) {
        var itemCategory = normalizeCategory(item.getAttribute('data-category'));
        var isMatch = showAll || itemCategory === current;
        item.hidden = !isMatch;
        item.classList.toggle('is-hidden', !isMatch);
      });
    }

    chips.forEach(function (chip) {
      chip.setAttribute('aria-pressed', 'false');
      chip.addEventListener('click', function (event) {
        event.preventDefault();
        var category = chip.getAttribute('data-category');
        applyFilter(category);
      });
    });

    var initialChip = chips.find(function (chip) {
      return normalizeCategory(chip.getAttribute('data-category')) === 'ALL';
    }) || chips[0];

    if (initialChip) {
      applyFilter(initialChip.getAttribute('data-category'));
    }
  }

  function setupTestimonialRotation() {
    var container = document.querySelector('[data-testimonial-rotator], [data-quote-rotator], .testimonial-rotator');

    if (container) {
      var quoteItems = Array.prototype.slice.call(
        container.querySelectorAll('[data-quote-item], [data-testimonial-item], .testimonial-item, blockquote')
      );

      if (quoteItems.length > 1) {
        var intervalFromData = Number(container.getAttribute('data-interval'));
        var intervalMs = Number.isFinite(intervalFromData) && intervalFromData >= 1500 ? intervalFromData : 4500;
        var activeIndex = 0;

        quoteItems.forEach(function (item, index) {
          var isActive = index === activeIndex;
          item.classList.toggle('is-active', isActive);
          item.hidden = !isActive;
          item.setAttribute('aria-hidden', isActive ? 'false' : 'true');
        });

        window.setInterval(function () {
          quoteItems[activeIndex].classList.remove('is-active');
          quoteItems[activeIndex].hidden = true;
          quoteItems[activeIndex].setAttribute('aria-hidden', 'true');

          activeIndex = (activeIndex + 1) % quoteItems.length;

          quoteItems[activeIndex].classList.add('is-active');
          quoteItems[activeIndex].hidden = false;
          quoteItems[activeIndex].setAttribute('aria-hidden', 'false');
        }, intervalMs);
      }

      return;
    }

    var textNode = document.querySelector('[data-rotating-quote]');
    if (!textNode) return;

    var rawQuotes = textNode.getAttribute('data-quotes');
    if (!rawQuotes) return;

    var quotes = rawQuotes
      .split('||')
      .map(function (part) {
        return part.trim();
      })
      .filter(Boolean);

    if (quotes.length < 2) return;

    var durationFromData = Number(textNode.getAttribute('data-interval'));
    var durationMs = Number.isFinite(durationFromData) && durationFromData >= 1500 ? durationFromData : 4500;
    var currentIndex = 0;

    textNode.textContent = quotes[currentIndex];

    window.setInterval(function () {
      currentIndex = (currentIndex + 1) % quotes.length;
      textNode.textContent = quotes[currentIndex];
    }, durationMs);
  }

  function init() {
    setupMobileNav();
    setupRevealObserver();
    setupCategoryFilter();
    setupTestimonialRotation();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
