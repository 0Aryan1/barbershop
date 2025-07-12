import React from 'react';
import { Link } from 'react-router-dom';
import { ButtonIcons } from '../components/common/Button/Button';
import './Home.css';

const Home = () => {
  const features = [
    {
      icon: <ButtonIcons.Check />,
      title: 'Skip the Wait',
      description: 'Join virtual queues and get notified when it\'s your turn.',
    },
    {
      icon: <ButtonIcons.Settings />,
      title: 'Real-time Updates',
      description: 'Track your position and estimated wait time in real-time.',
    },
    {
      icon: <ButtonIcons.Plus />,
      title: 'Easy Booking',
      description: 'Book appointments or join walk-in queues with just a few clicks.',
    },
  ];

  const stats = [
    { value: '500+', label: 'Happy Customers' },
    { value: '50+', label: 'Partner Shops' },
    { value: '2min', label: 'Average Wait' },
    { value: '4.9★', label: 'User Rating' },
  ];

  return (
    <div className="home">
      {/* Hero Section */}
      <section className="hero">
        <div className="container">
          <div className="hero-content">
            <h1 className="hero-title">
              Skip the Wait,<br />
              <span className="hero-title-accent">Book Your Spot</span>
            </h1>
            <p className="hero-description">
              Join virtual barbershop queues, track your position in real-time, 
              and get notified when it's your turn. The modern way to get your haircut.
            </p>
            <div className="hero-actions">
              <Link to="/customer" className="btn btn--primary btn--large">
                Find Barbershops
                <span className="btn-icon btn-icon--right">
                  <ButtonIcons.ArrowRight />
                </span>
              </Link>
              <Link to="/barber" className="btn btn--outline btn--large">
                <span className="btn-icon btn-icon--left">
                  <ButtonIcons.Settings />
                </span>
                For Barbers
              </Link>
            </div>
          </div>
          <div className="hero-visual">
            <div className="hero-card glass">
              <div className="queue-preview">
                <h3>Queue Status</h3>
                <div className="queue-item">
                  <div className="queue-position">1</div>
                  <div className="queue-info">
                    <span className="queue-name">Alex Johnson</span>
                    <span className="queue-service">Haircut & Beard</span>
                  </div>
                  <div className="queue-status in-progress">In Progress</div>
                </div>
                <div className="queue-item">
                  <div className="queue-position">2</div>
                  <div className="queue-info">
                    <span className="queue-name">You</span>
                    <span className="queue-service">Classic Cut</span>
                  </div>
                  <div className="queue-status waiting">Next: ~15 min</div>
                </div>
                <div className="queue-item">
                  <div className="queue-position">3</div>
                  <div className="queue-info">
                    <span className="queue-name">Sarah Wilson</span>
                    <span className="queue-service">Styling</span>
                  </div>
                  <div className="queue-status waiting">~45 min</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="stats">
        <div className="container">
          <div className="stats-grid">
            {stats.map((stat, index) => (
              <div key={index} className="stat-item">
                <div className="stat-value">{stat.value}</div>
                <div className="stat-label">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">Why Choose BarberQueue?</h2>
            <p className="section-description">
              Experience the future of barbershop visits with our smart queue management system.
            </p>
          </div>
          <div className="features-grid">
            {features.map((feature, index) => (
              <div key={index} className="feature-card card">
                <div className="feature-icon">{feature.icon}</div>
                <h3 className="feature-title">{feature.title}</h3>
                <p className="feature-description">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta">
        <div className="container">
          <div className="cta-content card--glass">
            <h2 className="cta-title">Ready to Skip the Wait?</h2>
            <p className="cta-description">
              Join thousands of satisfied customers who have revolutionized their barbershop experience.
            </p>
            <div className="cta-actions">
              <Link to="/customer" className="btn btn--primary btn--large">
                Get Started Now
                <span className="btn-icon btn-icon--right">
                  <ButtonIcons.ArrowRight />
                </span>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;