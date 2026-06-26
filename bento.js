/**
 * BENTO / ACCORDION — Feature 2
 *
 * Single source of truth: activeIndex
 * Desktop: hover updates activeIndex → panel reveals
 * Mobile:  click toggles activeIndex → accordion opens
 * Resize:  activeIndex survives breakpoint crossing (Context Lock)
 *
 * No global re-renders. JS only sets data-active and aria-expanded.
 */
(function () {
  'use strict';

  var MOBILE_BREAKPOINT = 700;
  var activeIndex = 0; // single source of truth
  var nodes = [];

  function isMobile() {
    return window.innerWidth <= MOBILE_BREAKPOINT;
  }

  function applyActive(index) {
    activeIndex = index;
    nodes.forEach(function (node, i) {
      var isActive = (i === index);
      node.dataset.active = String(isActive);
      node.setAttribute('aria-expanded', String(isActive));
    });
  }

  function handleDesktopHover(index) {
    if (!isMobile()) {
      applyActive(index);
    }
  }

  function handleClick(index) {
    if (isMobile()) {
      // On mobile: toggle. Click active node closes it.
      if (activeIndex === index) {
        applyActive(-1); // collapse all
      } else {
        applyActive(index);
      }
    } else {
      // On desktop: click also activates (accessibility)
      applyActive(index);
    }
  }

  // Resize handler — Context Lock
  var lastWasMobile = null;

  function onResize() {
    var nowMobile = isMobile();

    if (nowMobile === lastWasMobile) return; // only act on breakpoint crossing
    lastWasMobile = nowMobile;

    // Re-apply current activeIndex to new layout
    // If collapsed (activeIndex === -1), open first on desktop
    if (!nowMobile && activeIndex < 0) {
      applyActive(0);
    } else {
      applyActive(activeIndex);
    }
  }

  document.addEventListener('DOMContentLoaded', function () {
    nodes = Array.from(document.querySelectorAll('.bento-node'));
    if (nodes.length === 0) return;

    lastWasMobile = isMobile();

    nodes.forEach(function (node, index) {
      // Hover (desktop)
      node.addEventListener('mouseenter', function () {
        handleDesktopHover(index);
      });

      // Click/tap (mobile + keyboard accessibility on desktop)
      node.addEventListener('click', function () {
        handleClick(index);
      });

      // Keyboard activation
      node.addEventListener('keydown', function (e) {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          handleClick(index);
        }
        // Arrow key navigation between nodes
        if (e.key === 'ArrowDown' || e.key === 'ArrowRight') {
          e.preventDefault();
          var next = (index + 1) % nodes.length;
          nodes[next].focus();
          handleClick(next);
        }
        if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') {
          e.preventDefault();
          var prev = (index - 1 + nodes.length) % nodes.length;
          nodes[prev].focus();
          handleClick(prev);
        }
      });

      // Chevron button inside node
      var chevron = node.querySelector('.bento-node__chevron');
      if (chevron) {
        chevron.addEventListener('click', function (e) {
          e.stopPropagation(); // node's own click handles it
          handleClick(index);
        });
      }
    });

    // Set initial state
    applyActive(0);

    // Listen for resize (debounced)
    var resizeTimer;
    window.addEventListener('resize', function () {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(onResize, 50);
    });
  });
})();
