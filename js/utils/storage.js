import { dbPromise } from './db.js';
import { nanoid } from 'nanoid';

export async function saveQuiz(quizData) {
  const db = await dbPromise;
  return db.put('quizzes', { id: nanoid(), ...quizData });
}

export async function getQuiz(id) {
  const db = await dbPromise;
  return db.get('quizzes', id);
}

export async function getAllQuizzes() {
  const db = await dbPromise;
  return db.getAll('quizzes');
}

export async function deleteQuiz(id) {
  const db = await dbPromise;
  return db.delete('quizzes', id);
}

export async function clearAllQuizzes() {
  const db = await dbPromise;
  return db.clear('quizzes');
}
