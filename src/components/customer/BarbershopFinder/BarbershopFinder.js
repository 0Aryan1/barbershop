import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import BarbershopCard from '../BarbershopCard/BarbershopCard';
import { useGeolocation } from '../../../hooks/useGeolocation';
import { mockData } from '../../../data/mockData';
import { calculateDistance } from '../../../utils/helpers';
import './BarbershopFinder.css';

const BarbershopFinder = () => {
  const navigate = useNavigate();
  const { location, getCurrentPosition, loading: locationLoading } = useGeolocation();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedServices, setSelectedServices] = useState([]);
  const [sortBy, setSortBy] = useState('distance');
  const [filterOpen, setFilterOpen] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  
  // Add distance to barbershops
  const barbershopsWithDistance = useMemo(() => {
    if (!location) return mockData.barbershops;
    
    return mockData.barbershops.map(shop => ({
      ...shop,
      distance: calculateDistance(
        location.latitude,
        location.longitude,
        shop.location.latitude,
        shop.location.longitude
      )
    }));
  }, [location]);

  // Filter and sort barbershops
  const filteredBarbershops = useMemo(() => {
    let filtered = barbershopsWithDistance;

    // Search filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(shop =>
        shop.name.toLowerCase().includes(term) ||
        shop.address.toLowerCase().includes(term) ||
        shop.services.some(service => 
          service.name.toLowerCase().includes(term)
        )
      );
    }

    // Service filter
    if (selectedServices.length > 0) {
      filtered = filtered.filter(shop =>
        selectedServices.every(serviceId =>
          shop.services.some(service => service.id === serviceId)
        )
      );
    }

    // Open filter
    if (filterOpen) {
      filtered = filtered.filter(shop => shop.isOpen);
    }

    // Sort
    switch (sortBy) {
      case 'distance':
        filtered.sort((a, b) => (a.distance || 0) - (b.distance || 0));
        break;
      case 'rating':
        filtered.sort((a, b) => b.rating - a.rating);
        break;
      case 'waitTime':
        filtered.sort((a, b) => a.averageWaitTime - b.averageWaitTime);
        break;
      case 'name':
        filtered.sort((a, b) => a.name.localeCompare(b.name));
        break;
      default:
        break;
    }

    return filtered;
  }, [barbershopsWithDistance, searchTerm, selectedServices, filterOpen, sortBy]);

  const handleViewDetails = (shopId) => {
    navigate(`/shops/${shopId}`);
  };

  const handleJoinQueue = (shopId) => {
    // This would typically open a modal or navigate to join queue flow
    console.log('Joining queue for shop:', shopId);
    navigate(`/shops/${shopId}?action=join`);
  };

  const toggleService = (serviceId) => {
    setSelectedServices(prev =>
      prev.includes(serviceId)
        ? prev.filter(id => id !== serviceId)
        : [...prev, serviceId]
    );
  };

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedServices([]);
    setFilterOpen(false);
    setSortBy('distance');
  };

  const uniqueServices = useMemo(() => {
    const services = new Map();
    mockData.barbershops.forEach(shop => {
      shop.services.forEach(service => {
        if (!services.has(service.id)) {
          services.set(service.id, service);
        }
      });
    });
    return Array.from(services.values());
  }, []);

  return (
    <div className="barbershop-finder">
      {/* Search and Filters Header */}
      <div className="finder-header">
        <div className="search-section">
          <div className="search-input-wrapper">
            <svg className="search-icon" width="20" height="20" viewBox="0 0 24 24" fill="none">
              <circle cx="11" cy="11" r="8" stroke="currentColor" strokeWidth="2"/>
              <path d="m21 21-4.35-4.35" stroke="currentColor" strokeWidth="2"/>
            </svg>
            <input
              type="text"
              placeholder="Search barbershops, services, or location..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="search-clear"
                aria-label="Clear search"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                  <path d="m18 6-12 12M6 6l12 12" stroke="currentColor" strokeWidth="2"/>
                </svg>
              </button>
            )}
          </div>

          <button
            onClick={getCurrentPosition}
            disabled={locationLoading}
            className="location-btn"
            title="Use current location"
          >
            {locationLoading ? (
              <svg className="animate-spin" width="20" height="20" viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeDasharray="60 40"/>
              </svg>
            ) : (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <path d="M12 12h.01M21 12c0 4.97-4.03 9-9 9s-9-4.03-9-9 4.03-9 9-9 9 4.03 9 9z" stroke="currentColor" strokeWidth="2"/>
                <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="2"/>
              </svg>
            )}
          </button>
        </div>

        {/* Filter Toggle */}
        <div className="filter-controls">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`filter-toggle ${showFilters ? 'filter-toggle--active' : ''}`}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <polygon points="22,3 2,3 10,12.46 10,19 14,21 14,12.46" stroke="currentColor" strokeWidth="2"/>
            </svg>
            Filters
            {(selectedServices.length > 0 || filterOpen) && (
              <span className="filter-count">
                {selectedServices.length + (filterOpen ? 1 : 0)}
              </span>
            )}
          </button>

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="sort-select"
          >
            <option value="distance">Sort by Distance</option>
            <option value="rating">Sort by Rating</option>
            <option value="waitTime">Sort by Wait Time</option>
            <option value="name">Sort by Name</option>
          </select>
        </div>
      </div>

      {/* Filters Panel */}
      {showFilters && (
        <div className="filters-panel">
          <div className="filter-group">
            <label className="filter-label">
              <input
                type="checkbox"
                checked={filterOpen}
                onChange={(e) => setFilterOpen(e.target.checked)}
                className="filter-checkbox"
              />
              Show only open shops
            </label>
          </div>

          <div className="filter-group">
            <h4 className="filter-title">Services</h4>
            <div className="service-filters">
              {uniqueServices.map(service => (
                <label key={service.id} className="service-filter">
                  <input
                    type="checkbox"
                    checked={selectedServices.includes(service.id)}
                    onChange={() => toggleService(service.id)}
                    className="filter-checkbox"
                  />
                  <span className="service-name">{service.name}</span>
                  <span className="service-price">${service.price}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="filter-actions">
            <button onClick={clearFilters} className="btn btn--ghost btn--small">
              Clear All
            </button>
          </div>
        </div>
      )}

      {/* Results Header */}
      <div className="results-header">
        <h2 className="results-title">
          {filteredBarbershops.length} barbershop{filteredBarbershops.length !== 1 ? 's' : ''} found
        </h2>
        {location && (
          <p className="location-info">
            Near your location ({location.latitude.toFixed(4)}, {location.longitude.toFixed(4)})
          </p>
        )}
      </div>

      {/* Results Grid */}
      <div className="barbershops-grid">
        {filteredBarbershops.length > 0 ? (
          filteredBarbershops.map(barbershop => (
            <BarbershopCard
              key={barbershop.id}
              barbershop={barbershop}
              onViewDetails={handleViewDetails}
              onJoinQueue={handleJoinQueue}
              showDistance={!!location}
            />
          ))
        ) : (
          <div className="no-results">
            <div className="no-results-icon">
              <svg width="64" height="64" viewBox="0 0 24 24" fill="none">
                <circle cx="11" cy="11" r="8" stroke="currentColor" strokeWidth="2"/>
                <path d="m21 21-4.35-4.35" stroke="currentColor" strokeWidth="2"/>
              </svg>
            </div>
            <h3 className="no-results-title">No barbershops found</h3>
            <p className="no-results-message">
              Try adjusting your filters or search terms to find more results.
            </p>
            <button onClick={clearFilters} className="btn btn--primary">
              Clear Filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default BarbershopFinder;