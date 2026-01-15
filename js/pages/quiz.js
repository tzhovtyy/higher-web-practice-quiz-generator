import { getQuiz } from '../utils/storage.js';
import { initHeader } from '../components/header.js';
import { renderQuestion } from '../components/question.js';
import { validateAnswer } from '../utils/answerValidation.js';
import { initProgressBar } from '../components/progressBar.js';
import { initResultModal } from '../components/modal.js';

const quizState = {
  score: 0,
  isAnswered: false,
  currentQuestionIndex: 0,
  ui: {
    progressBar: null,
  },
};

document.addEventListener('DOMContentLoaded', async () => {
  initHeader();
  initQuizPage();
});

function getQueryParams() {
  const searchParams = new URLSearchParams(window.location.search);
  return {
    quizId: searchParams.get('quizId'),
    questionIndex: Number(searchParams.get('question')) - 1 || 0,
  };
}

function updateQuestionQueryParam(questionIndex) {
  const url = new URL(window.location.href);
  url.searchParams.set('question', String(questionIndex));
  window.history.pushState({}, '', url.toString());
}

function fillQuizHeader(quiz) {
  const titleElement = document.querySelector('.quiz__title');
  const descriptionElement = document.querySelector('.quiz__description');

  if (titleElement) {
    titleElement.textContent = quiz.title;
  }

  if (descriptionElement) {
    descriptionElement.textContent = quiz.description;
  }
}

function disableQuestionInputs() {
  const inputs = document.querySelectorAll('.quiz__question input');

  inputs.forEach((input) => {
    input.disabled = true;
  });
}

async function initQuizPage() {
  const { quizId, questionIndex } = getQueryParams();

  quizState.currentQuestionIndex = questionIndex;

  if (!quizId) {
    alert('Не передан идентификатор квиза');
    return;
  }

  const quiz = await getQuiz(quizId);

  if (!quiz) {
    alert('Квиз не найден');
    return;
  }

  const progressBarElement = document.querySelector('.progress-bar');

  quizState.ui.progressBar = initProgressBar(
    progressBarElement,
    quiz.questions.length
  );

  quizState.ui.progressBar.update(quizState.currentQuestionIndex);

  fillQuizHeader(quiz);

  const question = quiz.questions[questionIndex];

  if (!question) {
    alert('Вопрос не найден');
    return;
  }

  renderQuestion(question);

  const answerButton = document.querySelector('.quiz__button');

  answerButton.addEventListener('click', () => {
    const currentQuestion = quiz.questions[quizState.currentQuestionIndex];

    handleAnswerButtonClick(currentQuestion, quiz, answerButton);
  });
}

function handleAnswerButtonClick(question, quiz, buttonElement) {
  if (quizState.isAnswered) {
    const isLastQuestion =
      quizState.currentQuestionIndex === quiz.questions.length - 1;

    if (isLastQuestion) {
      showResultsModal(quiz);
    } else {
      handleNextQuestion(quiz);
    }

    return;
  }
  const hasSelectedOptions =
    document.querySelectorAll('.quiz__question input:checked').length > 0;

  if (!hasSelectedOptions) {
    alert('Выберите хотя бы один вариант ответа');
    return;
  }

  const { isCorrect, isPartiallyCorrect } = validateAnswer(question);

  if (isCorrect) {
    quizState.score += 1;
  }

  if (question.type === 'multiple' && isPartiallyCorrect) {
    const noticeElement = document.querySelector('.question__notice');

    if (noticeElement) {
      noticeElement.textContent =
        'Часть ответов верна, но вы пропустили правильные варианты.';
    }
  }

  quizState.isAnswered = true;

  disableQuestionInputs();

  const isLastQuestion =
    quizState.currentQuestionIndex === quiz.questions.length - 1;

  buttonElement.textContent = isLastQuestion
    ? 'Завершить квиз'
    : 'Следующий вопрос';
}

function handleNextQuestion(quiz) {
  quizState.currentQuestionIndex += 1;
  quizState.isAnswered = false;

  updateQuestionQueryParam(quizState.currentQuestionIndex);

  const nextQuestion = quiz.questions[quizState.currentQuestionIndex];

  if (!nextQuestion) {
    console.log('Тест завершён');
    return;
  }
  quizState.ui.progressBar.update(quizState.currentQuestionIndex);

  renderQuestion(nextQuestion);

  const answerButton = document.querySelector('.quiz__button');
  answerButton.textContent = 'Ответить';
}

function showResultsModal(quiz) {
  initResultModal({
    score: quizState.score,
    totalQuestions: quiz.questions.length,
    onRetry: () => {
      quizState.score = 0;
      quizState.currentQuestionIndex = 0;
      quizState.isAnswered = false;

      updateQuestionQueryParam(0);
      renderQuestion(quiz.questions[0]);
      quizState.ui.progressBar.update(0);

      const answerButton = document.querySelector('.quiz__button');
      answerButton.textContent = 'Ответить';
    },
  });
}
