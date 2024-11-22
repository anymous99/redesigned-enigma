import { initialData } from '../data/initialData';

const STORAGE_KEY = 'campus_life_data';

export const loadData = async () => {
  try {
    const storedData = localStorage.getItem(STORAGE_KEY);
    if (!storedData) {
      await saveData(initialData);
      return initialData;
    }
    return JSON.parse(storedData);
  } catch (error) {
    console.error('Error loading data:', error);
    return initialData;
  }
};

export const saveData = async (data: any) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    return data;
  } catch (error) {
    console.error('Error saving data:', error);
    throw error;
  }
};

export const clearData = () => {
  localStorage.removeItem(STORAGE_KEY);
};