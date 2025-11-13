import React, { useCallback } from 'react';
import { Link } from 'react-router-dom';
import { DotButton, useDotButton } from './featuredCarouselButton';
import Autoplay from 'embla-carousel-autoplay';
import useEmblaCarousel from 'embla-carousel-react';

import '@styles/featuredCarousel.scss';

/**
 * Featured content carousel for the landing page
 * Displays 4 featured items with titles, descriptions, and CTAs
 * Auto-advances every 5 seconds with fade transitions
 */
function FeaturedCarousel() {
  // Embla Carousel configuration
  const emblaOptions = { 
    loop: true, 
    duration: 20  // Transition duration in ms (was incorrectly using 'speed')
  };
  // Autoplay plugin configuration
  const autoplayOptions = {
    delay: 5000,                    // 5 seconds between slides
    stopOnInteraction: false,       // Continue after user interaction
    stopOnMouseEnter: true          // Pause on hover
  };
  const [emblaRef, emblaApi] = useEmblaCarousel(emblaOptions, [
    Autoplay(autoplayOptions)
  ]);

  const onNavButtonClick = useCallback((emblaApi) => {
    const autoplay = emblaApi?.plugins()?.autoplay
    if (!autoplay) return

    // Stop autoplay when user manually navigates
    autoplay.stop()

    // Resume autoplay after 5 seconds
    setTimeout(() => {
      autoplay.play()
    }, 5000)
  }, []);

  const { selectedIndex, scrollSnaps, onDotButtonClick } = useDotButton(
    emblaApi,
    onNavButtonClick
  );

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

  return (
    <div className="embla featured-carousel-wrapper mt-4">
      <div className="embla__viewport" ref={emblaRef}>
        {/* Carousel items */}
        <div className="embla__container featured-carousel-container">
          {carouselItems.map((item, index) => (
            <div className="embla__slide featured-carousel-item" key={index}>
              <div className="featured-carousel-item-header d-flex align-items-center justify-content-center">
                <div className="featured-carousel-item-icon">
                  <i className={`bi ${item.icon}`}></i>
                </div>
                <h3 className="featured-carousel-item-title">{item.title}</h3>
              </div>
                <div className="featured-carousel-item-description">
                  <span>{item.description}</span>
                </div>
            </div>
          ))}
        </div>
      </div>

      <div className="embla__controls mt-4">
        <div className="embla__dots">
          {scrollSnaps.map((_, index) => (
            <DotButton
              key={index}
              onClick={() => onDotButtonClick(index)}
              className={'btn btn-primary mx-2 embla__dot'.concat(
                index === selectedIndex ? ' embla__dot--selected' : ''
              )}
            >
              {index === 0 && 'What\'s New'}
              {index === 1 && 'Browse by Gene'}
              {index === 2 && 'Data Download'}
              {index === 3 && 'Working with MoTrPAC Data'}
            </DotButton>
          ))}
        </div>
      </div>
    </div>
  );
}

export default FeaturedCarousel;
