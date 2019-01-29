import React from 'react';
import PropTypes from 'prop-types';
import flatten from 'lodash/flatten';

import { Button, Carousel } from 'cw-components';
import ghgImage from 'assets/historical-emissions@2x';

import styles from './sections-slideshow-styles.scss';

const TopSlide = ({ title, description }) => (
  <div className={styles.slideWrapper}>
    <h3 className={styles.slideTitle}>{title}</h3>
    <p className={styles.slideParagraph}>
      {description}
    </p>
    <Button theme={{ button: styles.button }}>Go to national context</Button>
  </div>
);
TopSlide.propTypes = {
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired
};

const BottomSlide = () => (
  <div className={styles.bottomSlideContainer}>
    <img className={styles.image} src={ghgImage} alt="ghg" />
  </div>
);

const renderSlides = slides => {
  const slideComponents = slides.map(slide => [
    (
      <TopSlide
        key={`${slide.id}_top`}
        title={slide.title}
        description={slide.description}
        topSlide
      />
    ),
    <BottomSlide key={`${slide.id}_bottom`} bottomSlide />
  ]);
  return flatten(slideComponents);
};

const SectionsSlideshowComponent = ({ slides }) => (
  <section className={styles.container}>
    <Carousel pagingTitles={slides.map(s => s.title)}>
      {renderSlides(slides)}
    </Carousel>
  </section>
);

SectionsSlideshowComponent.propTypes = {
  slides: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      title: PropTypes.string.isRequired,
      description: PropTypes.string.isRequired
    })
  )
};
SectionsSlideshowComponent.defaultProps = { slides: [] };

export default SectionsSlideshowComponent;
