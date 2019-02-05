import React from 'react';
import PropTypes from 'prop-types';
import ImmutablePropTypes from 'react-immutable-proptypes';
import { connect } from 'react-redux';
import GridList from '@material-ui/core/GridList';
import { withContentRect } from 'react-measure';
import { trackWindowScroll } from 'react-lazy-load-image-component';
import { setActiveImageItem } from '../actions/stylesheetActionCreators';
import * as stylesheetSelectors from '../reducers/stylesheetSelectors';

import ImageItem from './ImageItem';

export const ImageItems = (props) => {
  const {
    imageItems,
    setActiveImageItem: dispatchSetActiveImageItem,
    activeImageItemId,
    measureRef,
    contentRect,
    scrollPosition
  } = props;
  const panelWidth = !contentRect.client.width
    ? 300 : contentRect.client.width;
  const cellWidth = (panelWidth / 2);
  const items = imageItems.map((item) => {
    const id = item.get('id');
    const thumbnail = item.getIn(['assets', 'thumbnail', 'href']);
    const stacId = item.get('stacId');
    const datetime = item.getIn(['properties', 'datetime']);
    return (
      <ImageItem
        width={cellWidth}
        scrollPosition={scrollPosition}
        key={id}
        id={id}
        cols={1}
        thumbnail={thumbnail}
        stacId={stacId}
        datetime={datetime}
        setActiveImageItem={dispatchSetActiveImageItem}
        activeImageItemId={activeImageItemId}
      />
    );
  });
  return (
    <div ref={measureRef}>
      <GridList
        style={{ maxHeight: 'calc(100vh - 220px)', overflowY: 'scroll' }}
        cellHeight={cellWidth}
      >
        {items}
      </GridList>
    </div>
  );
};

ImageItems.propTypes = {
  imageItems: ImmutablePropTypes.list.isRequired,
  setActiveImageItem: PropTypes.func.isRequired,
  activeImageItemId: PropTypes.number.isRequired,
  measureRef: PropTypes.func.isRequired,
  contentRect: PropTypes.shape({
    client: PropTypes.shape({
      width: PropTypes.number
    })
  }),
  scrollPosition: PropTypes.shape({
    x: PropTypes.number.isRequired,
    y: PropTypes.number.isRequired
  })
};

ImageItems.defaultProps = {
  contentRect: {
    client: {
      width: 300
    }
  },
  scrollPosition: {
    x: 0,
    y: 0
  }
};

const mapStateToProps = state => ({
  imageItems: stylesheetSelectors.getFilteredItems(state),
  activeImageItemId: stylesheetSelectors.getActiveImageItemId(state)
});

const mapDispatchToProps = { setActiveImageItem };

export default connect(mapStateToProps, mapDispatchToProps)(
  withContentRect('client')(trackWindowScroll(ImageItems))
);
