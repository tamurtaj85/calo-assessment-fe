export const LocalStorageService = {
  getItem: (key: string): string | null => {
    const data = localStorage.getItem(key);

    return data ? JSON.parse(data) : null;
  },
  setItem: (key: string, value: any) => {
    localStorage.setItem(key, JSON.stringify(value));
  },
  removeItem: (key: string) => {
    localStorage.removeItem(key);
  },
};
