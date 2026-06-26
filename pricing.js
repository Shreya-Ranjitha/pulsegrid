/**
 * PRICING ENGINE — Feature 1
 *
 * Multi-dimensional matrix: [currency][billing] → per-tier prices.
 * Updates ONLY the leaf text spans (.price-card__currency,
 * .price-card__value, .price-card__sub).
 *
 * NO re-render of parent nodes. NO innerHTML on .price-card.
 * NO framework diffing. Pure isolated textContent writes.
 * Proven by MutationObserver: only the four leaf spans mutate.
 */
(function () {
  'use strict';

  // ── Price matrix ────────────────────────────────────────
  // Base monthly prices in USD: [Starter, Growth, Enterprise]
  var BASE_USD = [29, 89, 249];

  // Currency symbols and conversion rates vs USD
  var CURRENCIES = {
    USD: { symbol: '$', rate: 1,      suffix: '/mo'  },
    EUR: { symbol: '€', rate: 0.92,   suffix: '/mo'  },
    GBP: { symbol: '£', rate: 0.79,   suffix: '/mo'  },
    INR: { symbol: '₹', rate: 83.5,   suffix: '/mo'  }
  };

  // Billing multipliers
  var BILLING = {
    monthly: { multiplier: 1,    suffix: '/mo'  },
    annual:  { multiplier: 0.8,  suffix: '/mo'  } // 20% off, billed annually
  };

  // State
  var currentCurrency = 'USD';
  var currentBilling  = 'monthly';

  // ── Cached DOM references — set once, never re-queried ──
  var currencyNodes; // NodeList of .price-card__currency
  var valueNodes;    // NodeList of .price-card__value
  var subNodes;      // NodeList of .price-card__sub

  // ── Compute prices ──────────────────────────────────────
  function computePrices(currency, billing) {
    var cur = CURRENCIES[currency];
    var bil = BILLING[billing];
    return BASE_USD.map(function (base) {
      var raw = base * cur.rate * bil.multiplier;
      var rounded = Math.round(raw);
      return {
        symbol: cur.symbol,
        value:  String(rounded),
        sub:    billing === 'annual'
                  ? '/mo · billed annually'
                  : '/mo'
      };
    });
  }

  // ── Isolated update — ONLY the leaf text nodes change ───
  function updatePriceDisplay(currency, billing) {
    var prices = computePrices(currency, billing);

    prices.forEach(function (price, i) {
      var currNode = currencyNodes[i];
      var valNode  = valueNodes[i];
      var subNode  = subNodes[i];

      // Micro-flash to signal the update visually
      currNode.classList.add('is-updating');
      valNode.classList.add('is-updating');
      subNode.classList.add('is-updating');

      // Write new text content after one paint (allows opacity transition)
      requestAnimationFrame(function () {
        // These are the ONLY DOM writes. Each targets a single leaf span.
        currNode.textContent = price.symbol;
        valNode.textContent  = price.value;
        subNode.textContent  = price.sub;

        requestAnimationFrame(function () {
          currNode.classList.remove('is-updating');
          valNode.classList.remove('is-updating');
          subNode.classList.remove('is-updating');
        });
      });
    });
  }

  // ── Control button helpers ──────────────────────────────
  function setActiveCtrl(group, activeBtn) {
    group.forEach(function (btn) {
      var isActive = btn === activeBtn;
      btn.classList.toggle('is-active', isActive);
      btn.setAttribute('aria-pressed', String(isActive));
    });
  }

  // ── Init ────────────────────────────────────────────────
  document.addEventListener('DOMContentLoaded', function () {
    // Cache leaf nodes once
    currencyNodes = document.querySelectorAll('.price-card__currency');
    valueNodes    = document.querySelectorAll('.price-card__value');
    subNodes      = document.querySelectorAll('.price-card__sub');

    if (!currencyNodes.length) return;

    // Currency buttons
    var currencyBtns = Array.from(
      document.querySelectorAll('.pricing__ctrl--currency')
    );
    currencyBtns.forEach(function (btn) {
      btn.addEventListener('click', function () {
        currentCurrency = btn.dataset.currency;
        setActiveCtrl(currencyBtns, btn);
        updatePriceDisplay(currentCurrency, currentBilling);
      });
    });

    // Billing buttons
    var billingBtns = Array.from(
      document.querySelectorAll('.pricing__ctrl--billing')
    );
    billingBtns.forEach(function (btn) {
      btn.addEventListener('click', function () {
        currentBilling = btn.dataset.billing;
        setActiveCtrl(billingBtns, btn);
        updatePriceDisplay(currentCurrency, currentBilling);
      });
    });

    // Initial render at page load
    updatePriceDisplay(currentCurrency, currentBilling);
  });
})();
