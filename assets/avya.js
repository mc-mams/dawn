/* AVYA — barre d'achat collante (mobile)
   Reprend l'état du bouton principal (variante, rupture) et le déclenche. */
(function () {
  const bar = document.querySelector('[data-avya-sticky-atc]');
  if (!bar) return;

  const stickyButton = bar.querySelector('[data-avya-sticky-button]');
  const stickyPrice = bar.querySelector('[data-avya-sticky-price]');
  const getMainButton = () => document.querySelector('[id^="ProductSubmitButton-"]');
  const getMainPrice = () => {
    const price = document.querySelector('.product__info-container .price');
    if (!price) return null;
    return price.classList.contains('price--on-sale')
      ? price.querySelector('.price__sale .price-item--last')
      : price.querySelector('.price__regular .price-item--regular');
  };

  let observed = getMainButton();
  if (!observed || !stickyButton) return;
  bar.hidden = false;

  const sync = () => {
    const mainButton = getMainButton();
    if (!mainButton) return;
    stickyButton.disabled = mainButton.disabled;
    const label = mainButton.querySelector('span');
    if (label && label.textContent.trim()) stickyButton.textContent = label.textContent.trim();
    const mainPrice = getMainPrice();
    if (mainPrice && stickyPrice) stickyPrice.textContent = mainPrice.textContent.trim();
  };

  const visibility = new IntersectionObserver(
    ([entry]) => {
      const passed = !entry.isIntersecting && entry.boundingClientRect.top < 0;
      bar.classList.toggle('is-visible', passed);
      if (passed) sync();
    },
    { threshold: 0 }
  );
  visibility.observe(observed);

  // Dawn peut remplacer le bloc produit au changement de variante : on se ré-accroche.
  new MutationObserver(() => {
    const current = getMainButton();
    if (current && current !== observed) {
      visibility.unobserve(observed);
      observed = current;
      visibility.observe(observed);
    }
    sync();
  }).observe(document.querySelector('.product__info-container') || document.body, {
    attributes: true,
    childList: true,
    subtree: true,
  });

  stickyButton.addEventListener('click', () => {
    const mainButton = getMainButton();
    if (mainButton && !mainButton.disabled) mainButton.click();
  });
})();
