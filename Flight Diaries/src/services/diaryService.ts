import diaries from '../../data/entries.ts';
import type { NewDiaryEntry, NonSensitiveDiaryEntry, DiaryEntry } from '../types.ts';

const getEntries = (): DiaryEntry[] => {
  return diaries;
};

const getNonSensitiveEntries = (): NonSensitiveDiaryEntry[] => {
  return diaries.map(({ id, date, weather, visibility }) => ({
    id, date, weather, visibility,
  }));
};

const findById = (id: number): DiaryEntry | undefined => {
  return diaries.find(d => d.id === id);
};

const addDiary = (entry: NewDiaryEntry): DiaryEntry => {
  const newDiaryEntry = {
    id: Math.max(...diaries.map(d => d.id)) + 1,
    ...entry
  };
  diaries.push(newDiaryEntry);
  return newDiaryEntry;
};

export default {
  getEntries,
  getNonSensitiveEntries,
  findById,
  addDiary
};