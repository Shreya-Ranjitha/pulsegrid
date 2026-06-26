/**
 * LOADER — Entry orchestration
 * Adds 'entry-ready' to body on next paint.
 * Total animation timeline ≤ 500ms from class add.
 */
(function () {
  'use strict';

  function kickOffEntry() {
    requestAnimationFrame(function () {
      document.body.classList.add('entry-ready');
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', kickOffEntry);
  } else {
    kickOffEntry();
  }
})();
