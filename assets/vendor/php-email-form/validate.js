/**
* Form Validation & AJAX Submission (Formspree + reCAPTCHA)
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

      // Check reCAPTCHA if present
      let recaptcha = thisForm.querySelector('.g-recaptcha');
      if (recaptcha && typeof grecaptcha !== 'undefined') {
        let response = grecaptcha.getResponse(
          grecaptcha.getWidgetId ? undefined : undefined
        );
        // Find the correct widget ID for this form's recaptcha
        let widgetId = recaptcha.dataset.widgetId;
        if (widgetId !== undefined) {
          response = grecaptcha.getResponse(parseInt(widgetId));
        } else {
          response = grecaptcha.getResponse();
        }
        if (!response) {
          displayError(thisForm, 'Please complete the "I\'m not a robot" check.');
          return;
        }
      }

      thisForm.querySelector('.loading').classList.add('d-block');
      thisForm.querySelector('.error-message').classList.remove('d-block');
      thisForm.querySelector('.sent-message').classList.remove('d-block');

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
            // Hide the form and show success message
            thisForm.querySelector('.sent-message').classList.add('d-block');
            thisForm.classList.add('form-submitted');
          } else {
            throw new Error('Form submission failed. Please try again.');
          }
        })
        .catch(function (error) {
          displayError(thisForm, error);
          // Reset reCAPTCHA on error
          if (typeof grecaptcha !== 'undefined') {
            grecaptcha.reset();
          }
        });
    });
  });

  // Store widget IDs when reCAPTCHA renders (for multiple forms on a page)
  if (typeof grecaptcha !== 'undefined') {
    grecaptcha.ready(function () {
      document.querySelectorAll('.g-recaptcha').forEach(function (el, index) {
        el.dataset.widgetId = index;
      });
    });
  }

  function displayError(thisForm, error) {
    thisForm.querySelector('.loading').classList.remove('d-block');
    thisForm.querySelector('.error-message').innerHTML = error;
    thisForm.querySelector('.error-message').classList.add('d-block');
  }

})();
