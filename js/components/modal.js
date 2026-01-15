import { RESULT_COMMENTS } from '../consts/resultComments';

export function initResultModal({ score, totalQuestions, onRetry }) {
  const template = document.getElementById('modal-template');

  const modalElement = template.content.cloneNode(true);
  const modalRoot = modalElement.querySelector('.modal');
  const messageElement = modalRoot.querySelector('.modal__message');
  const commentElement = modalRoot.querySelector('.modal__comment');

  const ratio = score / totalQuestions;

  messageElement.textContent =
    score === totalQuestions
      ? 'Вы ответили правильно на все вопросы 🎉'
      : `Вы ответили правильно на ${score} из ${totalQuestions} вопросов`;

  const comment = RESULT_COMMENTS.find((item) => ratio >= item.minRatio);

  commentElement.textContent = comment.text;

  bindModalActions(modalRoot, onRetry);

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

function bindModalActions(modalRoot, onRetry) {
  const retryButton = modalRoot.querySelector('.modal__retry');
  const toQuizzesButton = modalRoot.querySelector('.modal__to-quizzes');

  toQuizzesButton.addEventListener('click', () => {
    window.location.href = '/quizzes.html';
  });

  retryButton.addEventListener('click', () => {
    closeModal(modalRoot);
    onRetry();
  });
}
