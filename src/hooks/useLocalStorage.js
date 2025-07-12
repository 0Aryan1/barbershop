// Custom hook for local storage management
import { useState, useEffect, useCallback } from 'react';
import storageService from '../services/storageService';

export const useLocalStorage = (key, initialValue) => {
  // Get the initial value from localStorage or use the provided initial value
  const [value, setValue] = useState(() => {
    try {
      const item = storageService.get(key);
      return item !== null ? item : initialValue;
    } catch (error) {
      console.error(`Error reading localStorage key "${key}":`, error);
      return initialValue;
    }
  });

  // Update localStorage when value changes
  const setStoredValue = useCallback((newValue) => {
    try {
      // Allow value to be a function so we have the same API as useState
      const valueToStore = newValue instanceof Function ? newValue(value) : newValue;
      setValue(valueToStore);
      storageService.set(key, valueToStore);
    } catch (error) {
      console.error(`Error setting localStorage key "${key}":`, error);
    }
  }, [key, value]);

  // Remove item from localStorage
  const removeValue = useCallback(() => {
    try {
      setValue(initialValue);
      storageService.remove(key);
    } catch (error) {
      console.error(`Error removing localStorage key "${key}":`, error);
    }
  }, [key, initialValue]);

  return [value, setStoredValue, removeValue];
};

// Hook for user preferences
export const useUserPreferences = () => {
  const [preferences, setPreferences] = useLocalStorage('user_preferences', {
    theme: 'light',
    notifications: true,
    language: 'en',
    location: null,
    favoriteShops: [],
  });

  const updatePreference = useCallback((key, value) => {
    setPreferences(prev => ({
      ...prev,
      [key]: value,
    }));
  }, [setPreferences]);

  const addFavoriteShop = useCallback((shopId) => {
    setPreferences(prev => ({
      ...prev,
      favoriteShops: [...(prev.favoriteShops || []), shopId].filter((id, index, arr) => arr.indexOf(id) === index),
    }));
  }, [setPreferences]);

  const removeFavoriteShop = useCallback((shopId) => {
    setPreferences(prev => ({
      ...prev,
      favoriteShops: (prev.favoriteShops || []).filter(id => id !== shopId),
    }));
  }, [setPreferences]);

  const isFavoriteShop = useCallback((shopId) => {
    return (preferences.favoriteShops || []).includes(shopId);
  }, [preferences.favoriteShops]);

  return {
    preferences,
    setPreferences,
    updatePreference,
    addFavoriteShop,
    removeFavoriteShop,
    isFavoriteShop,
  };
};

// Hook for theme management
export const useTheme = () => {
  const [theme, setTheme] = useLocalStorage('theme', 'light');

  const toggleTheme = useCallback(() => {
    setTheme(current => current === 'light' ? 'dark' : 'light');
  }, [setTheme]);

  const setLightTheme = useCallback(() => setTheme('light'), [setTheme]);
  const setDarkTheme = useCallback(() => setTheme('dark'), [setTheme]);

  // Apply theme to document
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  return {
    theme,
    setTheme,
    toggleTheme,
    setLightTheme,
    setDarkTheme,
    isLight: theme === 'light',
    isDark: theme === 'dark',
  };
};