import React from 'react';
import { useQueue } from '../../../hooks/useQueue';
import { formatDisplayTime, calculateEstimatedTime } from '../../../utils/dateUtils';
import './QueueStatus.css';

const QueueStatus = ({ shopId, compact = false, showDetails = true }) => {
  const { 
    queue, 
    loading, 
    error, 
    queueLength, 
    currentCustomer, 
    averageWaitTime 
  } = useQueue(shopId);

  if (loading) {
    return (
      <div className={`queue-status ${compact ? 'queue-status--compact' : ''}`}>
        <div className="queue-status__header">
          <h3 className="queue-title">Queue Status</h3>
          <div className="loading-spinner">
            <svg className="animate-spin" width="20" height="20" viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeDasharray="60 40"/>
            </svg>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`queue-status ${compact ? 'queue-status--compact' : ''}`}>
        <div className="queue-error">
          <p>Failed to load queue status</p>
          <button className="btn btn--ghost btn--small">Retry</button>
        </div>
      </div>
    );
  }

  if (!queue || queue.length === 0) {
    return (
      <div className={`queue-status ${compact ? 'queue-status--compact' : ''}`}>
        <div className="queue-empty">
          <div className="empty-icon">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none">
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" stroke="currentColor" strokeWidth="2"/>
              <circle cx="9" cy="7" r="4" stroke="currentColor" strokeWidth="2"/>
              <path d="M23 21v-2a4 4 0 0 0-3-3.87" stroke="currentColor" strokeWidth="2"/>
              <path d="M16 3.13a4 4 0 0 1 0 7.75" stroke="currentColor" strokeWidth="2"/>
            </svg>
          </div>
          <h3>No Queue</h3>
          <p>Perfect time to visit - no waiting!</p>
        </div>
      </div>
    );
  }

  const waitingCustomers = queue.filter(item => item.status === 'waiting');
  const nextCustomer = waitingCustomers[0];

  return (
    <div className={`queue-status ${compact ? 'queue-status--compact' : ''}`}>
      {/* Header */}
      <div className="queue-status__header">
        <h3 className="queue-title">
          Current Queue
          <span className="queue-count">({queueLength})</span>
        </h3>
        <div className="queue-stats">
          <span className="stat">
            <span className="stat-label">Avg Wait:</span>
            <span className="stat-value">{calculateEstimatedTime(1, averageWaitTime)}</span>
          </span>
        </div>
      </div>

      {/* Current Customer */}
      {currentCustomer && (
        <div className="current-customer">
          <div className="customer-status">
            <div className="status-indicator status-indicator--active">
              <div className="pulse-ring"></div>
              <div className="pulse-dot"></div>
            </div>
            <div className="customer-info">
              <span className="customer-name">
                {currentCustomer.customerName || 'Customer'}
              </span>
              <span className="service-name">
                {currentCustomer.service?.name} • In Progress
              </span>
            </div>
          </div>
          <div className="service-time">
            Est. {currentCustomer.service?.duration || 30}min
          </div>
        </div>
      )}

      {/* Queue List */}
      {showDetails && waitingCustomers.length > 0 && (
        <div className="queue-list">
          <h4 className="queue-section-title">Waiting ({waitingCustomers.length})</h4>
          
          {compact ? (
            // Compact view - show only next few customers
            <div className="queue-compact">
              {waitingCustomers.slice(0, 3).map((customer, index) => (
                <div key={customer.id} className="queue-item-compact">
                  <div className="position-badge">{customer.position}</div>
                  <div className="customer-basic">
                    <span className="customer-name">{customer.customerName}</span>
                    <span className="wait-time">
                      {calculateEstimatedTime(customer.position, averageWaitTime)}
                    </span>
                  </div>
                </div>
              ))}
              {waitingCustomers.length > 3 && (
                <div className="queue-more">
                  +{waitingCustomers.length - 3} more in queue
                </div>
              )}
            </div>
          ) : (
            // Full view - show all customers
            <div className="queue-full">
              {waitingCustomers.map((customer, index) => (
                <div key={customer.id} className="queue-item">
                  <div className="queue-position">
                    <span className="position-number">{customer.position}</span>
                  </div>
                  
                  <div className="customer-details">
                    <div className="customer-info">
                      <span className="customer-name">
                        {customer.customerName || `Customer ${customer.position}`}
                      </span>
                      <span className="service-info">
                        {customer.service?.name} • {customer.service?.duration}min
                      </span>
                    </div>
                    
                    <div className="timing-info">
                      <span className="join-time">
                        Joined {formatDisplayTime(customer.joinTime)}
                      </span>
                      <span className="estimated-time">
                        Est. wait: {calculateEstimatedTime(customer.position, averageWaitTime)}
                      </span>
                    </div>
                  </div>

                  <div className="queue-actions">
                    <div className="priority-indicator">
                      {customer.priority === 'high' && (
                        <span className="priority-badge priority-badge--high">
                          Priority
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Quick Stats */}
      <div className="queue-summary">
        <div className="summary-stat">
          <span className="summary-label">Next Available</span>
          <span className="summary-value">
            {nextCustomer 
              ? calculateEstimatedTime(waitingCustomers.length + 1, averageWaitTime)
              : 'Now'
            }
          </span>
        </div>
        <div className="summary-stat">
          <span className="summary-label">Total Wait</span>
          <span className="summary-value">
            {calculateEstimatedTime(queueLength + 1, averageWaitTime)}
          </span>
        </div>
      </div>

      {/* Real-time Indicator */}
      <div className="realtime-indicator">
        <div className="realtime-dot"></div>
        <span className="realtime-text">Live updates</span>
      </div>
    </div>
  );
};

export default QueueStatus;