import React from 'react';
import BarbershopFinder from '../components/customer/BarbershopFinder/BarbershopFinder';
import './CustomerPortal.css';

const CustomerPortal = () => {
  return (
    <div className="customer-portal">
      <div className="container">
        <div className="page-header">
          <h1 className="page-title">Find Your Perfect Barbershop</h1>
          <p className="page-subtitle">
            Discover nearby barbershops, join queues, and never wait in line again
          </p>
        </div>
        
        <BarbershopFinder />
      </div>
    </div>
  );
};

export default CustomerPortal;