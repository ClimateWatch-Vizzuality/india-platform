import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Card, Button, Icon } from 'cw-components';
import cx from 'classnames';
import openInNewIcon from 'assets/icons/open-in-new';
import iconThemes from 'styles/themes/icon';
import NdcContentOverviewProvider from 'providers/ndc-content-overview-provider';
import SectionTitle from 'components/section-title';
import button from 'styles/themes/button';
import get from 'lodash/get';
import styles from './overview-styles.scss';

const COMPARE_INDONESIA_NDC_LINK = 'https://www.climatewatchdata.org/ndcs/compare/overview?locations=IND';

class Overview extends PureComponent {
  handleBtnClick = () => {
    window.open(COMPARE_INDONESIA_NDC_LINK, '_blank');
  };

  renderCards = () => {
    const { sectors, values, nonGhgMitigationCards } = this.props;
    const renderSubtitle = text => <h4 className={styles.subTitle}>{text}</h4>;
    const renderNoContent = () => (
      <div className={styles.noContent}>Not included</div>
    );
    const cardTheme = {
      card: styles.card,
      contentContainer: styles.contentContainer,
      data: styles.data
    };

    const renderGhgCard = () => (
      <Card reverse theme={cardTheme} title="GHG Target">
        <div className={styles.cardContent}>
          {
            values && values.ghg_target_type ? (
              <React.Fragment>
                <span className={styles.metaTitle}>
                  Target type
                </span>
                <p
                  className={styles.targetText}
                  dangerouslySetInnerHTML={{
                    __html: values.ghg_target_type[0].value
                  }}
                />
                <span className={styles.metaTitle}>
                  Target year
                </span>
                <p
                  className={styles.targetText}
                  dangerouslySetInnerHTML={{
                    __html: values.time_target_year[0].value
                  }}
                />
              </React.Fragment>
) : renderNoContent()
          }
        </div>
      </Card>
    );

    const renderCard = (title, type) => (
      <Card reverse theme={cardTheme} title={title}>
        <div className={styles.cardContent}>
          {
            values && values[type]
              ? (
                <p
                  className={styles.targetText}
                  dangerouslySetInnerHTML={{ __html: values[type][0].value }}
                />
)
              : renderNoContent()
          }
        </div>
      </Card>
    );

    return (
      <div className="grid-column-item">
        <div className={styles.subtitles}>
          {renderSubtitle('Mitigation contribution')}
        </div>
        <div className={styles.cards}>
          {renderGhgCard()}
          {
            nonGhgMitigationCards &&
              nonGhgMitigationCards.map(
                card => renderCard(card.title, card.type)
              )
          }
        </div>
        <div className={cx(styles.subtitles, styles.adaptationSubtitles)}>
          {renderSubtitle('Adaptation contribution')}
        </div>
        <div className={cx(styles.adaptationList, styles.adaptation)}>
          <Card
            reverse
            theme={{
              card: styles.card,
              contentContainer: styles.contentContainer,
              data: styles.adaptationData
            }}
            title="Identified sectors for adaptation action"
          >
            <div className={styles.cardContent}>
              {
                sectors.length ? (
                  <ul className={styles.list}>
                    {sectors.map(sector => (
                      <li key={sector} className={styles.listItem}>
                        {sector}
                      </li>
                    ))}
                  </ul>
) : renderNoContent()
              }
            </div>
          </Card>
        </div>
      </div>
    );
  };

  render() {
    const { sectors, values } = this.props;
    const hasSectors = values && sectors;

    const description = hasSectors && (
    <p
      className={styles.descriptionContainer}
          /* eslint-disable-next-line react/no-danger */
      dangerouslySetInnerHTML={{
            __html: get(values, 'indc_summary[0].value')
          }}
    />
      );

    return (
      <React.Fragment>
        <div className={styles.page}>
          <div className={styles.sectionHeader}>
            <SectionTitle
              title="Overview"
              theme={{ sectionTitle: styles.sectionTitle }}
            />
            <Button
              onClick={this.handleBtnClick}
              theme={{ button: cx(button.primary, styles.button) }}
            >
              <span
                className={styles.buttonText}
                dangerouslySetInnerHTML={{ __html: 'Compare NDCs' }}
              />
              <Icon
                icon={openInNewIcon}
                theme={{ icon: iconThemes.openInNew }}
              />
            </Button>
          </div>
          <div className={styles.description}>
            {description}
          </div>
          {this.renderCards()}
          <NdcContentOverviewProvider />
        </div>
      </React.Fragment>
    );
  }
}

Overview.propTypes = {
  sectors: PropTypes.array,
  values: PropTypes.object,
  nonGhgMitigationCards: PropTypes.array
};

Overview.defaultProps = { sectors: [], values: {}, nonGhgMitigationCards: [] };

export default Overview;
