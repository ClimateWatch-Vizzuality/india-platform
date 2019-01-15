import React, { PureComponent } from 'react';
import IndicatorsProvider from 'providers/indicators-provider';
import styles from './socioeconomic-indicators-styles.scss';
import Population from './population';
import Economy from './economy';
import Energy from './energy';

class SocioeconomicIndicators extends PureComponent {
  render() {
    return (
      <div className={styles.socioeconomic}>
        <Population />
        <Economy />
        <Energy />
        <IndicatorsProvider />
      </div>
    );
  }
}

SocioeconomicIndicators.propTypes = {};

SocioeconomicIndicators.defaultProps = {};

export default SocioeconomicIndicators;
