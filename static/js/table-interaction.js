// table-interaction.js
document.addEventListener('DOMContentLoaded', function () {
  const tables = document.querySelectorAll('table.clickable');
  tables.forEach(function (table) {
    const rows = table.querySelectorAll('tbody tr[data-href]');
    rows.forEach(function (row) {
      row.addEventListener('click', function () {
        const href = row.getAttribute('data-href');
        if (href) {
          window.location.href = href;
        }
      });
      // Keyboard accessibility
      row.setAttribute('tabindex', '0');
      row.addEventListener('keypress', function (e) {
        if (e.key === 'Enter' || e.key === ' ') {
          row.click();
        }
      });
    });
  });
});
