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
    window.location.href = '/quizzes.html';
    return;
  }
  const quiz = await getQuiz(quizId);
  if (!quiz) {
    window.location.href = '/quizzes.html';
    return;
  }

  quizState.ui.progressBar = initProgressBar(quiz.questions.length);
  quizState.ui.progressBar.update(quizState.currentQuestionIndex);

  fillQuizHeader(quiz);
  const question = quiz.questions[questionIndex];
  renderQuestion(question);

  const quizForm = document.querySelector('.quiz');

  quizForm.addEventListener('submit', (event) => {
    event.preventDefault();

    const currentQuestion = quiz.questions[quizState.currentQuestionIndex];

    handleQuestionSubmit(currentQuestion, quiz);
  });

  setupAnswerSelectionListener();
}

function handleQuestionSubmit(question, quiz) {
  const buttonElement = document.querySelector('.quiz__button');

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
    ? 'Завершить тест'
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

  setupAnswerSelectionListener();

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

function updateAnswerButtonState() {
  const buttonElement = document.querySelector('.quiz__button');

  if (!buttonElement) return;

  const hasSelectedOptions =
    document.querySelectorAll('.quiz__question input:checked').length > 0;

  buttonElement.disabled = !hasSelectedOptions;
}

function setupAnswerSelectionListener() {
  const inputs = document.querySelectorAll('.quiz__question input');
  const buttonElement = document.querySelector('.quiz__button');

  buttonElement.disabled = true;

  inputs.forEach((input) => {
    input.addEventListener('change', () => {
      if (!quizState.isAnswered) {
        updateAnswerButtonState();
      }
    });
  });
}
