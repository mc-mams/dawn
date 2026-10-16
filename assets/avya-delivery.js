// AVYA — dates estimées de la frise de livraison (fiche produit).
// Ajoute des jours ouvrés (hors week-ends) à aujourd'hui, en fourchette (min et max) ;
// les jours fériés ne sont pas pris en compte.
(function () {
  const addBusinessDays = (from, days) => {
    const date = new Date(from);
    let remaining = days;
    while (remaining > 0) {
      date.setDate(date.getDate() + 1);
      const day = date.getDay();
      if (day !== 0 && day !== 6) remaining -= 1;
    }
    return date;
  };

  document.querySelectorAll('[data-avya-delivery]').forEach((root) => {
    const min = parseInt(root.dataset.daysMin, 10);
    const max = parseInt(root.dataset.daysMax, 10);
    if (!min || !max || min < 1 || max < min) return;
    const lang = document.documentElement.lang || 'fr';
    const format = (date) => date.toLocaleDateString(lang, { weekday: 'short', day: 'numeric', month: 'short' });
    const today = new Date();
    const start = root.querySelector('[data-avya-delivery-start]');
    const end = root.querySelector('[data-avya-delivery-end]');
    if (start) start.textContent = format(today);
    if (end) end.textContent = 'entre le ' + format(addBusinessDays(today, min)) + ' et le ' + format(addBusinessDays(today, max));
  });
})();
