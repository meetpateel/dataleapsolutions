/**
* Form Validation & AJAX Submission (Formspree)
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
            thisForm.reset();
          } else {
            throw new Error('Form submission failed. Please try again.');
          }
        })
        .catch(function (error) {
          displayError(thisForm, error);
        });
    });
  });

  function displayError(thisForm, error) {
    thisForm.querySelector('.loading').classList.remove('d-block');
    thisForm.querySelector('.error-message').innerHTML = error;
    thisForm.querySelector('.error-message').classList.add('d-block');
  }

})();
