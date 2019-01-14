import React, { PureComponent } from 'react';
import IndicatorsProvider from 'providers/indicators-provider';
// import styles from './socioeconomic-indicators-styles.scss';
import Population from './population';
import Economy from './economy';

class SocioeconomicIndicators extends PureComponent {
  render() {
    return (
      <React.Fragment>
        <Population />
        <Economy />
        <IndicatorsProvider />
      </React.Fragment>
    );
  }
}

SocioeconomicIndicators.propTypes = {};

SocioeconomicIndicators.defaultProps = {};

export default SocioeconomicIndicators;
