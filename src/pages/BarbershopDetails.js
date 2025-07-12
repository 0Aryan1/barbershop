import React from 'react';
import { useParams } from 'react-router-dom';

const BarbershopDetails = () => {
  const { shopId } = useParams();

  return (
    <div className="page">
      <div className="container">
        <div className="page-header">
          <h1 className="page-title">Barbershop Details</h1>
          <p className="page-subtitle">
            View shop information, services, and join the queue
          </p>
        </div>
        <div className="card">
          <p>Viewing details for shop ID: {shopId}</p>
          <p>Features to be implemented:</p>
          <ul>
            <li>Shop information and photos</li>
            <li>Services and pricing</li>
            <li>Current queue status</li>
            <li>Reviews and ratings</li>
            <li>Queue joining interface</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default BarbershopDetails;