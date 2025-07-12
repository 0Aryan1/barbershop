import React from 'react';
import './BarbershopCard.css';

const BarbershopCard = ({ 
  barbershop, 
  onViewDetails, 
  onJoinQueue, 
  showDistance = false 
}) => {
  if (!barbershop) return null;

  const {
    id,
    name,
    address,
    rating,
    reviewCount,
    currentQueue,
    averageWaitTime,
    priceRange,
    isOpen,
    distance,
    amenities = [],
    services = []
  } = barbershop;

  const handleViewDetails = () => {
    onViewDetails?.(id);
  };

  const handleJoinQueue = (e) => {
    e.stopPropagation();
    onJoinQueue?.(id);
  };

  const formatWaitTime = (minutes) => {
    if (minutes < 60) return `${minutes}m`;
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`;
  };

  return (
    <div 
      className={`barbershop-card ${!isOpen ? 'barbershop-card--closed' : ''}`}
      onClick={handleViewDetails}
    >
      {/* Card Header */}
      <div className="barbershop-card__header">
        <div className="barbershop-info">
          <h3 className="barbershop-name">{name}</h3>
          <p className="barbershop-address">{address}</p>
          {showDistance && distance && (
            <span className="barbershop-distance">
              {distance < 1 ? `${Math.round(distance * 1000)}m` : `${distance.toFixed(1)}km`}
            </span>
          )}
        </div>
        <div className="barbershop-status">
          <span className={`status-badge ${isOpen ? 'status-badge--open' : 'status-badge--closed'}`}>
            {isOpen ? 'Open' : 'Closed'}
          </span>
        </div>
      </div>

      {/* Rating */}
      <div className="barbershop-rating">
        <div className="rating-stars">
          {[...Array(5)].map((_, i) => (
            <span 
              key={i} 
              className={`star ${i < Math.floor(rating) ? 'star--filled' : 'star--empty'}`}
            >
              ★
            </span>
          ))}
          <span className="rating-value">{rating}</span>
        </div>
        <span className="review-count">({reviewCount} reviews)</span>
      </div>

      {/* Queue Info */}
      <div className="queue-info">
        <div className="queue-stat">
          <span className="queue-label">Queue</span>
          <span className="queue-value">{currentQueue} people</span>
        </div>
        <div className="queue-stat">
          <span className="queue-label">Wait Time</span>
          <span className="queue-value">{formatWaitTime(averageWaitTime)}</span>
        </div>
        <div className="queue-stat">
          <span className="queue-label">Price Range</span>
          <span className="queue-value">{priceRange}</span>
        </div>
      </div>

      {/* Services Preview */}
      {services.length > 0 && (
        <div className="services-preview">
          <span className="services-label">Services:</span>
          <div className="services-list">
            {services.slice(0, 3).map((service, index) => (
              <span key={service.id} className="service-tag">
                {service.name}
              </span>
            ))}
            {services.length > 3 && (
              <span className="service-tag service-tag--more">
                +{services.length - 3} more
              </span>
            )}
          </div>
        </div>
      )}

      {/* Amenities */}
      {amenities.length > 0 && (
        <div className="amenities">
          {amenities.slice(0, 4).map((amenity, index) => (
            <span key={index} className="amenity-tag">
              {amenity}
            </span>
          ))}
        </div>
      )}

      {/* Actions */}
      <div className="barbershop-actions">
        <button 
          className="btn btn--outline btn--small"
          onClick={handleViewDetails}
        >
          View Details
        </button>
        {isOpen && (
          <button 
            className="btn btn--primary btn--small"
            onClick={handleJoinQueue}
          >
            Join Queue
          </button>
        )}
      </div>

      {/* Queue Position Indicator */}
      {currentQueue > 0 && (
        <div className="queue-indicator">
          <div className="queue-dots">
            {[...Array(Math.min(currentQueue, 5))].map((_, i) => (
              <div key={i} className="queue-dot" />
            ))}
            {currentQueue > 5 && <span className="queue-more">+{currentQueue - 5}</span>}
          </div>
        </div>
      )}
    </div>
  );
};

export default BarbershopCard;