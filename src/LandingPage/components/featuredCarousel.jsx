import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';

/**
 * Featured content carousel for the landing page
 * Displays 4 featured items with titles, descriptions, and CTAs
 * Auto-advances every 5 seconds with fade transitions
 */
function FeaturedCarousel() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const carouselItems = [
    {
      title: "What's New",
      description: 'Stay up-to-date on the latest research findings and data releases from MoTrPAC studies',
      icon: 'bi-stars',
      link: '/announcements',
      buttonText: 'Learn More',
    },
    {
      title: 'Browse by Gene',
      description: 'Search and analyze gene-centric exercise response data across multiple species, tissues and omes',
      icon: 'bi-search',
      link: '/graphical-clustering',
      buttonText: 'Explore Data',
    },
    {
      title: 'Data Download',
      description: 'Access comprehensive, publicly available datasets from animal and human exercise studies',
      icon: 'bi-cloud-arrow-down-fill',
      link: '/data-download',
      buttonText: 'Download Data',
    },
    {
      title: 'Working with MoTrPAC Data',
      description: 'Look up clinical biospecimen data curated from human adults and pediatrics across multiple interventions and demographics',
      icon: 'bi-bar-chart-line-fill',
      link: '/biospecimen-summary',
      buttonText: 'Get Started',
    },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setIsTransitioning(true);
      setTimeout(() => {
        setActiveIndex((current) => (current + 1) % carouselItems.length);
        setIsTransitioning(false);
      }, 300); // Half of transition duration for crossfade
    }, 5000); // Change slide every 5 seconds

    return () => clearInterval(interval);
  }, [carouselItems.length]);

  const goToSlide = (index) => {
    if (index !== activeIndex) {
      setIsTransitioning(true);
      setTimeout(() => {
        setActiveIndex(index);
        setIsTransitioning(false);
      }, 300);
    }
  };

  return (
    <div className="featured-carousel-container">
      <div className="carousel-wrapper">
        {carouselItems.map((item, index) => (
          <div
            key={index}
            className={`carousel-item-content ${
              index === activeIndex ? 'active' : ''
            } ${isTransitioning && index === activeIndex ? 'transitioning' : ''}`}
          >
            <div className="carousel-item-inner">
              <div className="carousel-icon">
                <i className={`bi ${item.icon}`}></i>
              </div>
              <div className="carousel-text">
                <h3 className="carousel-title">{item.title}</h3>
                <p className="carousel-description">{item.description}</p>
              </div>
              <Link
                to={item.link}
                className="btn btn-primary btn-lg carousel-cta"
                role="button"
              >
                {item.buttonText}
                <i className="bi bi-arrow-right ms-2"></i>
              </Link>
            </div>
          </div>
        ))}
      </div>

      {/* Carousel indicators */}
      <div className="carousel-indicators">
        {carouselItems.map((_, index) => (
          <button
            key={index}
            type="button"
            className={index === activeIndex ? 'active' : ''}
            onClick={() => goToSlide(index)}
            aria-label={`Go to slide ${index + 1}`}
          >
            <span className="indicator-dot"></span>
          </button>
        ))}
      </div>
    </div>
  );
}

FeaturedCarousel.propTypes = {};

export default FeaturedCarousel;
