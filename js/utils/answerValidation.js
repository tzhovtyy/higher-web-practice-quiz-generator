export function validateAnswer(question) {
  const selectedInputs = Array.from(
    document.querySelectorAll('.quiz__question input:checked')
  );

  const selectedOptionIds = selectedInputs.map((input) => Number(input.value));

  const correctOptions = question.options.filter((option) => option.correct);

  const correctOptionIds = correctOptions.map((option) => option.id);

  const hasIncorrectSelection = selectedOptionIds.some(
    (id) => !correctOptionIds.includes(id)
  );

  const hasAllCorrectSelections =
    correctOptionIds.every((id) => selectedOptionIds.includes(id)) &&
    selectedOptionIds.length === correctOptionIds.length;

  const isPartiallyCorrect =
    !hasIncorrectSelection &&
    selectedOptionIds.length < correctOptionIds.length;

  question.options.forEach((option) => {
    const optionElement = document
      .querySelector(`.quiz__question input[value="${option.id}"]`)
      ?.closest('.option');

    if (!optionElement) return;

    if (option.correct) {
      optionElement.classList.add('option--correct');
    } else if (selectedOptionIds.includes(option.id)) {
      optionElement.classList.add('option--incorrect');
    }
  });

  return {
    isCorrect: hasAllCorrectSelections,
    isPartiallyCorrect,
  };
}
