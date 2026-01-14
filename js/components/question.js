function removeExistingQuestion(container) {
  const existingQuestion = container.querySelector('.question');
  if (existingQuestion) {
    existingQuestion.remove();
  }
}

function getQuestionTemplateId(questionType) {
  return questionType === 'multiple'
    ? 'multiple-question-template'
    : 'single-question-template';
}

function getOptionTemplateId(questionType) {
  return questionType === 'multiple'
    ? 'checkbox-option-template'
    : 'option-template';
}

function createQuestionElement(question) {
  const templateId = getQuestionTemplateId(question.type);
  const questionTemplate = document.getElementById(templateId);

  if (!questionTemplate) {
    return null;
  }

  const questionNode = questionTemplate.content.cloneNode(true);
  const questionElement = questionNode.querySelector('.question');
  const questionTextElement = questionNode.querySelector('.question__text');

  questionTextElement.textContent = question.text;

  return questionElement;
}

function createOptionElement(option, questionType) {
  const templateId = getOptionTemplateId(questionType);
  const optionTemplate = document.getElementById(templateId);

  if (!optionTemplate) {
    return null;
  }

  const optionNode = optionTemplate.content.cloneNode(true);
  const inputElement = optionNode.querySelector('input');
  const textElement = optionNode.querySelector('.option__text');
  const explanationElement = optionNode.querySelector('.option__explanation');

  inputElement.value = option.id;
  inputElement.name = 'question';

  textElement.textContent = option.text;
  explanationElement.textContent = option.message;

  return optionNode;
}

function renderOptions(questionElement, question) {
  const optionsContainer = questionElement.querySelector('.question__options');

  question.options.forEach((option) => {
    const optionElement = createOptionElement(option, question.type);

    if (optionElement) {
      optionsContainer.appendChild(optionElement);
    }
  });
}

export function renderQuestion(question) {
  const quizElement = document.querySelector('.quiz');

  removeExistingQuestion(quizElement);

  const questionElement = createQuestionElement(question);

  if (!questionElement) {
    return;
  }

  renderOptions(questionElement, question);

  quizElement.insertBefore(
    questionElement,
    quizElement.querySelector('.quiz__button')
  );
}
