import { validateQuizJson } from '../utils/validation';
import { showToast } from './toast';

export function initJsonForm() {
  const form = document.querySelector('.json-form');
  const textarea = document.querySelector('.json-form__textarea');

  if (!form || !textarea) return;

  form.addEventListener('submit', (event) => {
    event.preventDefault();

    textarea.classList.remove('json-form__textarea--error');

    const jsonString = textarea.value.trim();

    const validationResult = validateQuizJson(jsonString);

    if (!validationResult.isValid) {
      showToast(validationResult.error);
      textarea.classList.add('json-form__textarea--error');
      return;
    }
    const quizData = validationResult.data;

    // TBD сохранение в IndexedDB
    console.log('Валидный тест:', quizData);
    window.location.href = '/quizzes.html';
  });
}
