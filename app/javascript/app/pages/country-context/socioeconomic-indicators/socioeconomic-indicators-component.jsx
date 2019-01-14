import React, { PureComponent } from 'react';
import IndicatorsProvider from 'providers/indicators-provider';
// import styles from './socioeconomic-indicators-styles.scss';
import Population from './population';

class SocioeconomicIndicators extends PureComponent {
  render() {
    return (
      <React.Fragment>
        <Population />
        <IndicatorsProvider />
      </React.Fragment>
    );
  }
}

SocioeconomicIndicators.propTypes = {};

SocioeconomicIndicators.defaultProps = {};

export default SocioeconomicIndicators;
