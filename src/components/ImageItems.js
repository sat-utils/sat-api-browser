import React from 'react';
import PropTypes from 'prop-types';
import ImmutablePropTypes from 'react-immutable-proptypes';
import { connect } from 'react-redux';
import GridList from '@material-ui/core/GridList';
import { setActiveImageItem } from '../actions/stylesheetActionCreators';
import * as stylesheetSelectors from '../reducers/stylesheetSelectors';
import ImageItem from './ImageItem';

export const ImageItems = (props) => {
  const {
    imageItems,
    setActiveImageItem: dispatchSetActiveImageItem,
    activeImageItemId,
  } = props;

  const items = imageItems.map((item) => {
    const id = item.get('id');
    const thumbnail = item.getIn(['assets', 'thumbnail', 'href']);
    const stacId = item.get('stacId');
    const datetime = item.getIn(['properties', 'datetime']);
    return (
      <ImageItem
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
    <GridList
      style={{ maxHeight: 'calc(100vh - 220px)', overflowY: 'scroll' }}
      cellHeight={300}
    >
      {items}
    </GridList>
  );
};

ImageItems.propTypes = {
  imageItems: ImmutablePropTypes.list.isRequired,
  setActiveImageItem: PropTypes.func.isRequired,
  activeImageItemId: PropTypes.number.isRequired
};

const mapStateToProps = state => ({
  imageItems: stylesheetSelectors.getFilteredItems(state),
  activeImageItemId: stylesheetSelectors.getActiveImageItemId(state)
});

const mapDispatchToProps = { setActiveImageItem };

export default connect(mapStateToProps, mapDispatchToProps)(ImageItems);
