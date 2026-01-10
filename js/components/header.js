const PAGE_ACTIONS = {
  default: {
    text: "Посмотреть сохранённые квизы",
    href: "/quizzes.html",
    class: "button_secondary",
  },
  quizzes: {
    text: "Добавить квиз",
    href: "/index.html",
    class: "button_primary",
  },
};

function getCurrentPageKey() {
  if (location.pathname.includes("quizzes")) return "quizzes";
  return "default";
}

export function initHeader() {
  const actionBtn = document.querySelector(".header__action-btn");
  const burgerBtn = document.querySelector(".header__burger");
  const mobileNav = document.querySelector(".header__nav--mobile");
  const mobileLinkTemplate = document.querySelector(
    "#header-nav-link-template"
  );

  if (!actionBtn || !burgerBtn || !mobileNav || !mobileLinkTemplate) return;

  const pageKey = getCurrentPageKey();
  const action = PAGE_ACTIONS[pageKey];

  if (action) {
    actionBtn.textContent = action.text;
    actionBtn.href = action.href;
    actionBtn.classList.forEach((cls) => {
      if (cls.startsWith("button_")) actionBtn.classList.remove(cls);
    });
    if (action.class) actionBtn.classList.add(action.class);
  }

  Object.values(PAGE_ACTIONS).forEach((item) => {
    const clone = mobileLinkTemplate.content.cloneNode(true);
    const link = clone.querySelector("a");
    link.textContent = item.text;
    link.href = item.href;
    mobileNav.appendChild(clone);
  });

  burgerBtn.addEventListener("click", () => {
    const isActive = mobileNav.classList.toggle("active");
    burgerBtn.setAttribute("aria-expanded", String(isActive));
    burgerBtn.classList.toggle("active", isActive);
    mobileNav.setAttribute("aria-hidden", String(!isActive));
  });
}
