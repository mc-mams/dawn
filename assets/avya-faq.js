// AVYA — FAQ à onglets (motif WAI-ARIA « tabs », navigation aux flèches).
// Sans JavaScript, toutes les catégories restent affichées l'une sous l'autre.
(function () {
  document.querySelectorAll('[data-avya-faq]').forEach((root) => {
    const tablist = root.querySelector('[role="tablist"]');
    const tabs = Array.from(root.querySelectorAll('[role="tab"]'));
    const panels = Array.from(root.querySelectorAll('[role="tabpanel"]'));
    if (!tablist || tabs.length < 2 || tabs.length !== panels.length) return;

    const select = (index, focus) => {
      tabs.forEach((tab, i) => {
        const active = i === index;
        tab.setAttribute('aria-selected', active ? 'true' : 'false');
        tab.tabIndex = active ? 0 : -1;
        panels[i].hidden = !active;
        if (active && focus) tab.focus();
      });
    };

    tablist.hidden = false;
    root.classList.add('is-tabs');
    tabs.forEach((tab, i) => {
      tab.addEventListener('click', () => select(i, false));
      tab.addEventListener('keydown', (event) => {
        const last = tabs.length - 1;
        let next = null;
        if (event.key === 'ArrowRight') next = i === last ? 0 : i + 1;
        else if (event.key === 'ArrowLeft') next = i === 0 ? last : i - 1;
        else if (event.key === 'Home') next = 0;
        else if (event.key === 'End') next = last;
        if (next === null) return;
        event.preventDefault();
        select(next, true);
      });
    });
    select(0, false);
  });
})();
