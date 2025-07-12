import React from 'react';

const Settings = () => {
  return (
    <div className="page">
      <div className="container">
        <div className="page-header">
          <h1 className="page-title">Settings</h1>
          <p className="page-subtitle">
            Customize your preferences and manage your account
          </p>
        </div>
        <div className="card">
          <p>Settings features will be implemented here, including:</p>
          <ul>
            <li>Theme preferences (light/dark mode)</li>
            <li>Notification settings</li>
            <li>Account information</li>
            <li>Privacy settings</li>
            <li>Language preferences</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Settings;