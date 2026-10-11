/**
* Form Validation & AJAX Submission (Formspree + reCAPTCHA v3)
*/
(function () {
  "use strict";

  let forms = document.querySelectorAll('.php-email-form');

  forms.forEach(function (e) {
    e.addEventListener('submit', function (event) {
      event.preventDefault();

      let thisForm = this;
      let action = thisForm.getAttribute('action');

      if (!action) {
        displayError(thisForm, 'The form action property is not set!');
        return;
      }

      thisForm.querySelector('.loading').classList.add('d-block');
      thisForm.querySelector('.error-message').classList.remove('d-block');
      thisForm.querySelector('.sent-message').classList.remove('d-block');

      // reCAPTCHA is loaded only after cookie consent (see assets/js/consent.js)
      let consent = window.DataLeapConsent;
      if (!consent || !consent.hasRecaptchaConsent()) {
        displayError(thisForm, 'This form uses Google reCAPTCHA to block spam, which needs your cookie consent. ' +
          '<button type="button" class="btn btn-link p-0 align-baseline cookie-consent-open">Review cookie settings</button> ' +
          'or email us at <a href="mailto:info@dataleapsolution.com">info@dataleapsolution.com</a>.');
        let openBtn = thisForm.querySelector('.cookie-consent-open');
        if (openBtn && consent) {
          openBtn.addEventListener('click', function () { consent.showBanner(); });
        }
        return;
      }

      consent.loadRecaptcha().then(function () {
        grecaptcha.ready(function () {
          grecaptcha.execute(consent.recaptchaSiteKey, { action: 'submit' }).then(function (token) {
            let tokenInput = thisForm.querySelector('.g-recaptcha-response');
            if (tokenInput) {
              tokenInput.value = token;
            }
            submitForm(thisForm, action);
          }).catch(function () {
            displayError(thisForm, 'Spam protection check failed. Please try again, or email us at <a href="mailto:info@dataleapsolution.com">info@dataleapsolution.com</a>.');
          });
        });
      }).catch(function () {
        displayError(thisForm, 'Spam protection could not load. Please try again, or email us at <a href="mailto:info@dataleapsolution.com">info@dataleapsolution.com</a>.');
      });
    });
  });

  function submitForm(thisForm, action) {
    let formData = new FormData(thisForm);

    fetch(action, {
      method: 'POST',
      body: formData,
      headers: { 'Accept': 'application/json' }
    })
      .then(function (response) {
        if (response.ok) {
          return response.json();
        } else {
          return response.json().then(function (data) {
            throw new Error(data.errors ? data.errors.map(function (e) { return e.message; }).join(', ') : 'Form submission failed');
          });
        }
      })
      .then(function (data) {
        thisForm.querySelector('.loading').classList.remove('d-block');
        if (data.ok) {
          thisForm.querySelector('.sent-message').classList.add('d-block');
          thisForm.classList.add('form-submitted');
        } else {
          throw new Error('Form submission failed. Please try again.');
        }
      })
      .catch(function (error) {
        displayError(thisForm, error);
      });
  }

  function displayError(thisForm, error) {
    thisForm.querySelector('.loading').classList.remove('d-block');
    thisForm.querySelector('.error-message').innerHTML = error;
    thisForm.querySelector('.error-message').classList.add('d-block');
  }

})();
