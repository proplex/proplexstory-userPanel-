export const getSessionStorage = (key: string): string | null => {
  if (typeof window === 'undefined') {
    return null;
  }
  return window.sessionStorage.getItem(key);
};

export const setSessionStorage = (key: string, value: string): void => {
  if (typeof window === 'undefined') {
    return;
  }
  window.sessionStorage.setItem(key, value);
};

export const removeSessionStorage = (key: string): void => {
  if (typeof window === 'undefined') {
    return;
  }
  window.sessionStorage.removeItem(key);
};
 
export const clearSessionStorage = (): void => {
  if (typeof window === 'undefined') {
    return;
  }
  window.sessionStorage.clear();
}; 