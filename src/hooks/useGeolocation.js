// Custom hook for geolocation services
import { useState, useEffect, useCallback } from 'react';
import { DEFAULT_LOCATION } from '../utils/constants';
import { calculateDistance } from '../utils/helpers';
import storageService from '../services/storageService';

export const useGeolocation = (options = {}) => {
  const [location, setLocation] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [supported, setSupported] = useState(false);

  const defaultOptions = {
    enableHighAccuracy: true,
    timeout: 10000,
    maximumAge: 5 * 60 * 1000, // 5 minutes
    ...options,
  };

  // Check if geolocation is supported
  useEffect(() => {
    setSupported('geolocation' in navigator);
  }, []);

  // Load saved location on mount
  useEffect(() => {
    const savedLocation = storageService.getLocation();
    if (savedLocation) {
      setLocation(savedLocation);
    }
  }, []);

  // Get current position
  const getCurrentPosition = useCallback(() => {
    if (!supported) {
      setError('Geolocation is not supported by this browser');
      return Promise.reject(new Error('Geolocation not supported'));
    }

    setLoading(true);
    setError(null);

    return new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const newLocation = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            accuracy: position.coords.accuracy,
            timestamp: new Date(),
          };

          setLocation(newLocation);
          setLoading(false);
          
          // Save to storage
          storageService.setLocation(newLocation);
          
          resolve(newLocation);
        },
        (err) => {
          const errorMessage = getGeolocationErrorMessage(err.code);
          setError(errorMessage);
          setLoading(false);
          reject(new Error(errorMessage));
        },
        defaultOptions
      );
    });
  }, [supported, defaultOptions]);

  // Watch position changes
  const watchPosition = useCallback(() => {
    if (!supported) {
      return null;
    }

    setLoading(true);
    setError(null);

    const watchId = navigator.geolocation.watchPosition(
      (position) => {
        const newLocation = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          accuracy: position.coords.accuracy,
          timestamp: new Date(),
        };

        setLocation(newLocation);
        setLoading(false);
        
        // Save to storage
        storageService.setLocation(newLocation);
      },
      (err) => {
        const errorMessage = getGeolocationErrorMessage(err.code);
        setError(errorMessage);
        setLoading(false);
      },
      defaultOptions
    );

    return () => {
      navigator.geolocation.clearWatch(watchId);
    };
  }, [supported, defaultOptions]);

  // Clear location
  const clearLocation = useCallback(() => {
    setLocation(null);
    setError(null);
    storageService.remove('location');
  }, []);

  // Use default location
  const useDefaultLocation = useCallback(() => {
    setLocation(DEFAULT_LOCATION);
    storageService.setLocation(DEFAULT_LOCATION);
  }, []);

  // Calculate distance to a point
  const getDistanceTo = useCallback((targetLat, targetLng) => {
    if (!location) return null;
    
    return calculateDistance(
      location.latitude,
      location.longitude,
      targetLat,
      targetLng
    );
  }, [location]);

  return {
    location,
    loading,
    error,
    supported,
    getCurrentPosition,
    watchPosition,
    clearLocation,
    useDefaultLocation,
    getDistanceTo,
    hasLocation: !!location,
    isAccurate: location && location.accuracy < 100, // Within 100 meters
  };
};

// Hook for finding nearby barbershops
export const useNearbyShops = (shops = [], radius = 10) => {
  const { location, getDistanceTo } = useGeolocation();
  const [nearbyShops, setNearbyShops] = useState([]);

  useEffect(() => {
    if (!location || !shops.length) {
      setNearbyShops([]);
      return;
    }

    const shopsWithDistance = shops
      .map(shop => ({
        ...shop,
        distance: getDistanceTo(shop.location.latitude, shop.location.longitude),
      }))
      .filter(shop => shop.distance <= radius)
      .sort((a, b) => a.distance - b.distance);

    setNearbyShops(shopsWithDistance);
  }, [location, shops, radius, getDistanceTo]);

  return {
    nearbyShops,
    hasNearbyShops: nearbyShops.length > 0,
    location,
  };
};

// Hook for location-based search
export const useLocationSearch = () => {
  const { location, getCurrentPosition } = useGeolocation();
  const [searchLocation, setSearchLocation] = useState(null);
  const [searching, setSearching] = useState(false);

  // Search by current location
  const searchByCurrentLocation = useCallback(async () => {
    setSearching(true);
    try {
      const currentLocation = await getCurrentPosition();
      setSearchLocation(currentLocation);
      return currentLocation;
    } catch (error) {
      throw error;
    } finally {
      setSearching(false);
    }
  }, [getCurrentPosition]);

  // Search by address (mock implementation)
  const searchByAddress = useCallback(async (address) => {
    setSearching(true);
    
    // Mock geocoding - in real app would use Google Maps API or similar
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Return default location for demo
    const mockLocation = {
      ...DEFAULT_LOCATION,
      address,
      timestamp: new Date(),
    };
    
    setSearchLocation(mockLocation);
    setSearching(false);
    
    return mockLocation;
  }, []);

  // Clear search
  const clearSearch = useCallback(() => {
    setSearchLocation(null);
  }, []);

  return {
    searchLocation: searchLocation || location,
    searching,
    searchByCurrentLocation,
    searchByAddress,
    clearSearch,
    hasSearchLocation: !!(searchLocation || location),
  };
};

// Helper function to get user-friendly error messages
function getGeolocationErrorMessage(code) {
  switch (code) {
    case 1: // PERMISSION_DENIED
      return 'Location access denied. Please enable location services.';
    case 2: // POSITION_UNAVAILABLE
      return 'Location information unavailable.';
    case 3: // TIMEOUT
      return 'Location request timed out.';
    default:
      return 'An unknown error occurred while retrieving location.';
  }
}