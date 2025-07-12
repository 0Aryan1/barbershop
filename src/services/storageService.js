// Storage service for local data persistence
import { getFromStorage, setToStorage, removeFromStorage } from '../utils/helpers';
import { STORAGE_KEYS } from '../utils/constants';

class StorageService {
  // User preferences
  getUserPreferences() {
    return getFromStorage(STORAGE_KEYS.USER_PREFERENCES, {
      theme: 'light',
      notifications: true,
      language: 'en',
      location: null,
    });
  }

  setUserPreferences(preferences) {
    return setToStorage(STORAGE_KEYS.USER_PREFERENCES, preferences);
  }

  // User profile
  getUserProfile() {
    return getFromStorage(STORAGE_KEYS.USER_PROFILE, null);
  }

  setUserProfile(profile) {
    return setToStorage(STORAGE_KEYS.USER_PROFILE, profile);
  }

  removeUserProfile() {
    return removeFromStorage(STORAGE_KEYS.USER_PROFILE);
  }

  // Queue data
  getQueueData(shopId) {
    const allQueueData = getFromStorage(STORAGE_KEYS.QUEUE_DATA, {});
    return allQueueData[shopId] || [];
  }

  setQueueData(shopId, queueData) {
    const allQueueData = getFromStorage(STORAGE_KEYS.QUEUE_DATA, {});
    allQueueData[shopId] = queueData;
    return setToStorage(STORAGE_KEYS.QUEUE_DATA, allQueueData);
  }

  // Theme
  getTheme() {
    return getFromStorage(STORAGE_KEYS.THEME, 'light');
  }

  setTheme(theme) {
    return setToStorage(STORAGE_KEYS.THEME, theme);
  }

  // Location
  getLocation() {
    return getFromStorage(STORAGE_KEYS.LOCATION, null);
  }

  setLocation(location) {
    return setToStorage(STORAGE_KEYS.LOCATION, location);
  }

  // Generic storage methods
  get(key, defaultValue = null) {
    return getFromStorage(key, defaultValue);
  }

  set(key, value) {
    return setToStorage(key, value);
  }

  remove(key) {
    return removeFromStorage(key);
  }

  // Clear specific data
  clearUserData() {
    removeFromStorage(STORAGE_KEYS.USER_PROFILE);
    removeFromStorage(STORAGE_KEYS.USER_PREFERENCES);
  }

  clearQueueData() {
    removeFromStorage(STORAGE_KEYS.QUEUE_DATA);
  }

  clearAllData() {
    Object.values(STORAGE_KEYS).forEach(key => {
      removeFromStorage(key);
    });
  }

  // Favorites management
  getFavoriteShops() {
    const preferences = this.getUserPreferences();
    return preferences.favoriteShops || [];
  }

  addFavoriteShop(shopId) {
    const preferences = this.getUserPreferences();
    const favorites = preferences.favoriteShops || [];
    
    if (!favorites.includes(shopId)) {
      preferences.favoriteShops = [...favorites, shopId];
      this.setUserPreferences(preferences);
    }
    
    return preferences.favoriteShops;
  }

  removeFavoriteShop(shopId) {
    const preferences = this.getUserPreferences();
    const favorites = preferences.favoriteShops || [];
    
    preferences.favoriteShops = favorites.filter(id => id !== shopId);
    this.setUserPreferences(preferences);
    
    return preferences.favoriteShops;
  }

  // Search history
  getSearchHistory() {
    return this.get('search_history', []);
  }

  addToSearchHistory(searchTerm) {
    const history = this.getSearchHistory();
    const newHistory = [searchTerm, ...history.filter(term => term !== searchTerm)].slice(0, 10);
    this.set('search_history', newHistory);
    return newHistory;
  }

  clearSearchHistory() {
    this.remove('search_history');
  }
}

export default new StorageService();