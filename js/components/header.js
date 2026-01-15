import { HEADER_ACTIONS } from '../consts/headerActions';

function getCurrentPageKey() {
  if (location.pathname.includes('quizzes')) return 'quizzes';
  return 'default';
}

export function initHeader() {
  const actionBtn = document.querySelector('.header__action');
  const burgerBtn = document.querySelector('.header__burger');
  const mobileNav = document.querySelector('.header__nav');
  const mobileLinkTemplate = document.querySelector(
    '#header-nav-link-template'
  );

  if (!actionBtn || !burgerBtn || !mobileNav || !mobileLinkTemplate) return;

  const pageKey = getCurrentPageKey();
  const action = HEADER_ACTIONS[pageKey];

  if (action) {
    actionBtn.textContent = action.text;
    actionBtn.href = action.href;
    actionBtn.classList.forEach((cls) => {
      if (cls.startsWith('button--')) actionBtn.classList.remove(cls);
    });
    if (action.class) actionBtn.classList.add(action.class);
  }

  Object.values(HEADER_ACTIONS).forEach((item) => {
    const clone = mobileLinkTemplate.content.cloneNode(true);
    const link = clone.querySelector('a');
    link.textContent = item.text;
    link.href = item.href;
    mobileNav.appendChild(clone);
  });

  burgerBtn.addEventListener('click', () => {
    const isActive = mobileNav.classList.toggle('header__nav--active');
    burgerBtn.setAttribute('aria-expanded', String(isActive));
    burgerBtn.classList.toggle('header__burger--active', isActive);
    mobileNav.setAttribute('aria-hidden', String(!isActive));
  });
}
