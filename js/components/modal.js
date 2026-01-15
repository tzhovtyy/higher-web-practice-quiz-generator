// js/components/modal.js

const RESULT_COMMENTS = [
  {
    minRatio: 1,
    text: 'Отличный результат! Вы прекрасно усвоили материал 👏',
  },
  {
    minRatio: 0.7,
    text: 'Хорошая работа! Есть небольшие неточности, но в целом всё отлично.',
  },
  {
    minRatio: 0.4,
    text: 'Неплохо, но стоит повторить материал и попробовать ещё раз.',
  },
  {
    minRatio: 0,
    text: 'Не переживайте — ошибки это часть обучения. Попробуйте пройти тест снова, чтобы закрепить материал и улучшить результат.',
  },
];

export function initResultModal({ score, totalQuestions, onRetry }) {
  const template = document.getElementById('modal-template');

  if (!template) {
    throw new Error('Modal template not found');
  }

  const modalElement = template.content.cloneNode(true);
  const modalRoot = modalElement.querySelector('.modal');
  const messageElement = modalRoot.querySelector('.modal__message');
  const commentElement = modalRoot.querySelector('.modal__comment');
  const retryButton = modalRoot.querySelector('.modal__retry');

  const ratio = score / totalQuestions;

  messageElement.textContent =
    score === totalQuestions
      ? 'Вы ответили правильно на все вопросы 🎉'
      : `Вы ответили правильно на ${score} из ${totalQuestions} вопросов`;

  const comment = RESULT_COMMENTS.find((item) => ratio >= item.minRatio);

  commentElement.textContent = comment.text;

  retryButton.addEventListener('click', () => {
    closeModal(modalRoot);
    onRetry();
  });

  document.body.appendChild(modalRoot);
  lockScroll();

  return modalRoot;
}

function lockScroll() {
  document.body.style.overflow = 'hidden';
}

function unlockScroll() {
  document.body.style.overflow = '';
}

function closeModal(modalElement) {
  unlockScroll();
  modalElement.remove();
}
