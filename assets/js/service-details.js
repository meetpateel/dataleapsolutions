/**
* Service details: switch the visible capability when a sidebar link is clicked
*/
document.addEventListener('DOMContentLoaded', function () {
  const links = document.querySelectorAll('.services-list a[data-capability]');
  const sections = document.querySelectorAll('.capability-detail');

  links.forEach(function (link) {
    link.addEventListener('click', function (event) {
      event.preventDefault();
      const targetId = link.getAttribute('data-capability');

      links.forEach(function (item) {
        item.classList.remove('active');
      });
      link.classList.add('active');

      sections.forEach(function (section) {
        section.classList.add('d-none');
      });

      const targetSection = document.getElementById(targetId);
      if (targetSection) {
        targetSection.classList.remove('d-none');
      }
    });
  });
});
