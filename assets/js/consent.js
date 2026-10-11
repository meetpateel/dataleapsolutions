/**
* Cookie consent
*
* The only third party that sets cookies on this site is Google reCAPTCHA v3,
* which protects the contact and career forms from spam. It is never loaded
* until the visitor accepts, and even then only on pages that have a form.
*/
(function () {
  "use strict";

  const STORAGE_KEY = 'dataleap-cookie-consent';
  const RECAPTCHA_SITE_KEY = '6LeQ7oMsAAAAALHmLgRSsAhAGBUVmgcJnqL_WhIh';

  let recaptchaPromise = null;

  function getChoice() {
    try {
      return localStorage.getItem(STORAGE_KEY);
    } catch (e) {
      return null;
    }
  }

  function setChoice(value) {
    try {
      localStorage.setItem(STORAGE_KEY, value);
    } catch (e) {
      // Storage blocked: the choice still applies for this page view.
    }
    currentChoice = value;
  }

  let currentChoice = getChoice();

  function hasForms() {
    return document.querySelector('.php-email-form') !== null;
  }

  function loadRecaptcha() {
    if (currentChoice !== 'accepted') {
      return Promise.reject(new Error('consent'));
    }
    if (!recaptchaPromise) {
      recaptchaPromise = new Promise(function (resolve, reject) {
        const script = document.createElement('script');
        script.src = 'https://www.google.com/recaptcha/api.js?render=' + RECAPTCHA_SITE_KEY;
        script.async = true;
        script.onload = function () { resolve(); };
        script.onerror = function () {
          recaptchaPromise = null;
          reject(new Error('load'));
        };
        document.head.appendChild(script);
      });
    }
    return recaptchaPromise;
  }

  function closeBanner() {
    const banner = document.getElementById('cookie-banner');
    if (banner) {
      banner.remove();
    }
  }

  function showBanner() {
    if (document.getElementById('cookie-banner')) return;

    const banner = document.createElement('div');
    banner.id = 'cookie-banner';
    banner.className = 'cookie-banner';
    banner.setAttribute('role', 'dialog');
    banner.setAttribute('aria-labelledby', 'cookie-banner-title');
    banner.setAttribute('aria-describedby', 'cookie-banner-text');
    banner.innerHTML =
      '<h2 id="cookie-banner-title">Cookies on this site</h2>' +
      '<p id="cookie-banner-text">We don\'t use analytics, advertising, or tracking cookies. ' +
      'Our contact and career forms use Google reCAPTCHA to block spam, which sets cookies and sends data to Google. ' +
      'It only loads if you accept. If you decline, you can still reach us by email. ' +
      '<a href="cookie-policy.html">Cookie Policy</a></p>' +
      '<div class="cookie-actions">' +
      '<button type="button" data-choice="accepted">Accept reCAPTCHA</button>' +
      '<button type="button" data-choice="rejected">Decline</button>' +
      '</div>';

    banner.querySelectorAll('button[data-choice]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        setChoice(btn.getAttribute('data-choice'));
        closeBanner();
      });
    });

    document.body.appendChild(banner);
  }

  document.addEventListener('DOMContentLoaded', function () {
    if (!currentChoice) {
      showBanner();
    }

    document.querySelectorAll('.cookie-settings-btn').forEach(function (btn) {
      btn.addEventListener('click', function () {
        showBanner();
        const first = document.querySelector('#cookie-banner button');
        if (first) first.focus();
      });
    });

    // Warm up reCAPTCHA once someone starts filling in a form.
    if (hasForms()) {
      document.querySelectorAll('.php-email-form').forEach(function (form) {
        form.addEventListener('focusin', function () {
          loadRecaptcha().catch(function () {});
        }, { once: true });
      });
    }
  });

  window.DataLeapConsent = {
    hasRecaptchaConsent: function () { return currentChoice === 'accepted'; },
    loadRecaptcha: loadRecaptcha,
    showBanner: showBanner,
    recaptchaSiteKey: RECAPTCHA_SITE_KEY
  };

})();
