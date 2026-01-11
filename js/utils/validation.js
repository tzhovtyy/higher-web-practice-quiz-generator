import { z } from 'zod';

const optionSchema = z.object({
  id: z
    .number({
      error: (issue) =>
        issue.input === undefined
          ? 'Отсутствует id варианта ответа'
          : 'id варианта ответа должен быть числом',
    })
    .int({ message: 'id варианта ответа должен быть целым числом' })
    .positive({
      message: 'id варианта ответа должен быть положительным числом',
    }),

  text: z
    .string({
      error: (issue) =>
        issue.input === undefined
          ? 'Отсутствует текст варианта ответа'
          : 'Текст варианта ответа должен быть строкой',
    })
    .min(1, 'Текст варианта ответа не может быть пустым'),

  correct: z.boolean({
    error: (issue) =>
      issue.input === undefined
        ? 'Не указано, является ли вариант правильным'
        : 'Поле correct должно быть булевым значением',
  }),

  message: z
    .string({
      error: (issue) =>
        issue.input === undefined
          ? 'Отсутствует сообщение для ответа'
          : 'Сообщение для ответа должно быть строкой',
    })
    .min(1, 'Сообщение для ответа обязательно'),
});

const questionSchema = z.object({
  id: z
    .number({
      error: (issue) =>
        issue.input === undefined
          ? 'Отсутствует id вопроса'
          : 'id вопроса должен быть числом',
    })
    .int({ message: 'id вопроса должен быть целым числом' })
    .positive({ message: 'id вопроса должен быть положительным числом' }),

  text: z
    .string({
      error: (issue) =>
        issue.input === undefined
          ? 'Отсутствует текст вопроса'
          : 'Текст вопроса должен быть строкой',
    })
    .min(1, 'Текст вопроса не может быть пустым'),

  type: z.enum(['single', 'multiple'], {
    error: (issue) =>
      issue.input === undefined
        ? 'Отсутствует тип вопроса'
        : "Тип вопроса должен быть 'single' или 'multiple'",
  }),

  options: z
    .array(optionSchema, {
      error: (issue) =>
        issue.input === undefined
          ? 'Отсутствуют варианты ответа'
          : 'Варианты ответа должны быть массивом',
    })
    .min(2, 'Вопрос должен содержать минимум 2 варианта ответа')
    .refine((options) => options.some((option) => option.correct), {
      message: 'В вопросе должен быть хотя бы один правильный ответ',
    }),
});

const quizSchema = z.object({
  title: z
    .string({
      error: (issue) =>
        issue.input === undefined
          ? 'Отсутствует название теста'
          : 'Название теста должно быть строкой',
    })
    .min(1, 'Название теста не может быть пустым'),

  description: z
    .string({
      error: (issue) =>
        issue.input === undefined
          ? 'Отсутствует описание теста'
          : 'Описание теста должно быть строкой',
    })
    .min(1, 'Описание теста не может быть пустым'),

  questions: z
    .array(questionSchema, {
      error: (issue) =>
        issue.input === undefined
          ? 'Отсутствует список вопросов'
          : 'Вопросы должны быть массивом',
    })
    .min(1, 'Тест должен содержать хотя бы один вопрос'),
});

export function validateQuizJson(jsonString) {
  let parsedData;

  try {
    parsedData = JSON.parse(jsonString);
  } catch (error) {
    return {
      isValid: false,
      error: 'Некорректный JSON: ошибка синтаксиса',
    };
  }

  const result = quizSchema.safeParse(parsedData);

  if (!result.success) {
    return {
      isValid: false,
      error: result.error.issues.map((err) => err.message).join('\n'),
    };
  }

  return {
    isValid: true,
    data: result.data,
  };
}
