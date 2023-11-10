
export const useLocalStorage = () => {

  const setItem = (key: string, value: string) => {
    localStorage.setItem(key, value);
  }

  const getItem = (key: string): string => {
    return localStorage.getItem(key) || '';
  }

  const removeItem = (key: string): void => {
    localStorage.removeItem(key);
  }

  const initStorage = () => {
    localStorage.clear();
  }

  return { setItem, getItem, removeItem, initStorage };
}