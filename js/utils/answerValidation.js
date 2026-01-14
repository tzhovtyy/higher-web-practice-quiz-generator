export function validateAnswer(question) {
  const optionElements = Array.from(
    document.querySelectorAll('.quiz__question .option')
  );

  let isAnswerCorrect = true;

  optionElements.forEach((optionElement) => {
    const inputElement = optionElement.querySelector('input');
    const optionId = Number(inputElement.value);

    const optionData = question.options.find(
      (option) => option.id === optionId
    );

    if (!optionData) return;

    if (optionData.correct) {
      optionElement.classList.add('option--correct');

      if (!inputElement.checked) {
        isAnswerCorrect = false;
      }
    }

    if (inputElement.checked && !optionData.correct) {
      optionElement.classList.add('option--incorrect');
      isAnswerCorrect = false;
    }
  });

  return isAnswerCorrect;
}
