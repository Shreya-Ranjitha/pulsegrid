/**
 * FAQ — Accordion
 * Opens one item at a time. Toggles data-open and aria-expanded.
 */
(function () {
  'use strict';

  document.addEventListener('DOMContentLoaded', function () {
    var items = document.querySelectorAll('.faq__item');
    if (!items.length) return;

    items.forEach(function (item) {
      var trigger = item.querySelector('.faq__trigger');
      if (!trigger) return;

      trigger.addEventListener('click', function () {
        var isOpen = item.dataset.open === 'true';

        // Close all
        items.forEach(function (other) {
          other.dataset.open = 'false';
          var otherTrigger = other.querySelector('.faq__trigger');
          if (otherTrigger) otherTrigger.setAttribute('aria-expanded', 'false');
        });

        // Toggle clicked
        if (!isOpen) {
          item.dataset.open = 'true';
          trigger.setAttribute('aria-expanded', 'true');
        }
      });
    });
  });
})();
