const STORAGE_KEY = 'campus_life_data';

export const getStorageData = () => {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : null;
  } catch (error) {
    console.error('Error reading from storage:', error);
    return null;
  }
};

export const setStorageData = (data: any) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    return true;
  } catch (error) {
    console.error('Error writing to storage:', error);
    return false;
  }
};

export const clearStorage = () => {
  localStorage.removeItem(STORAGE_KEY);
};