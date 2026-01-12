import { initHeader } from '../components/header';
import { getAllQuizzes } from '../utils/storage.js';
import { getQuestionsDeclented } from '../utils/linguistics.js';

document.addEventListener('DOMContentLoaded', () => {
  initHeader();
  renderQuizzes();
});

function createQuizCardElement(quiz, template) {
  const node = template.content.firstElementChild.cloneNode(true);
  const titleEl = node.querySelector('.quiz-card__title');
  const descriptionEl = node.querySelector('.quiz-card__description');
  const countEl = node.querySelector('.quiz-card__question-count');
  const buttonEl = node.querySelector('.quiz-card__button');

  titleEl.textContent = quiz.title || 'Без названия';
  descriptionEl.textContent = quiz.description || 'Описание отсутствует';

  const questionCount = quiz.questions.length;

  countEl.textContent = `${questionCount} ${getQuestionsDeclented(
    questionCount
  )}`;

  if (buttonEl) {
    buttonEl.type = 'button';
    buttonEl.setAttribute('aria-label', `Пройти "${quiz.title || 'квиз'}"`);
    buttonEl.addEventListener('click', () => {
      const url = new URL('/quiz.html', window.location.origin);
      url.searchParams.set('quizId', quiz.id);
      url.searchParams.set('question', '1');
      window.location.href = url.toString();
    });
  }
  node.setAttribute('role', 'article');
  node.classList.add('quiz-card--item');
  return node;
}

async function renderQuizzes() {
  const placeholderEl = document.querySelector('.quizzes-placeholder');
  const quizzesSection = document.querySelector('.quizzes');
  const container = document.querySelector('.quizzes__container');
  const template = document.querySelector('#quiz-card-template');

  container.innerHTML = '';

  const quizzes = await getAllQuizzes();

  if (!quizzes || quizzes.length === 0) {
    placeholderEl.hidden = false;
    quizzesSection.hidden = true;
    return;
  }

  placeholderEl.hidden = true;
  quizzesSection.hidden = false;

  quizzes.forEach((quiz) => {
    const cardNode = createQuizCardElement(quiz, template);
    container.appendChild(cardNode);
  });
}
