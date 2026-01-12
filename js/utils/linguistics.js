const getDeclension = (count, one, two, five) => {
  count = Math.abs(count) % 100;
  let num = count % 10;

  if (count > 10 && count < 20) return five;
  if (num > 1 && num < 5) return two;
  if (num == 1) return one;
  return five;
};

export const getQuestionsDeclented = (count) => {
  return getDeclension(count, 'вопрос', 'вопроса', 'вопросов');
};
