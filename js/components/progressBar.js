export function initProgressBar(containerElement, totalQuestions) {
  const currentElement = containerElement.querySelector(
    '.progress-bar__current'
  );
  const totalElement = containerElement.querySelector('.progress-bar__total');
  const fillElement = containerElement.querySelector('.progress-bar__fill');

  totalElement.textContent = String(totalQuestions);

  fillElement.setAttribute('aria-valuemin', '1');
  fillElement.setAttribute('aria-valuemax', String(totalQuestions));

  function update(currentQuestionIndex) {
    const current = currentQuestionIndex + 1;
    const progressPercent = (current / totalQuestions) * 100;

    currentElement.textContent = String(current);
    fillElement.style.width = `${progressPercent}%`;
    fillElement.setAttribute('aria-valuenow', String(current));
  }

  return {
    update,
  };
}
