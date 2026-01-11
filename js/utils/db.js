import { openDB } from 'idb';

export const dbPromise = openDB('quizzes-db', 1, {
  upgrade(db) {
    db.createObjectStore('quizzes', { keyPath: 'id' });
  },
});
