import React from 'react';
import PropTypes from 'prop-types';
import ImmutablePropTypes from 'react-immutable-proptypes';
import { connect } from 'react-redux';
import GridList from '@material-ui/core/GridList';
import { withStyles } from '@material-ui/core/styles';
import { setActiveImageItem } from '../actions/stylesheetActionCreators';
import * as stylesheetSelectors from '../reducers/stylesheetSelectors';
import ImageItem from './ImageItem';

const styles = theme => ({
  instructions: {
    marginTop: theme.spacing.unit,
    marginBottom: theme.spacing.unit
  }
});

export const ImageItems = (props) => {
  const {
    imageItems,
    setActiveImageItem: dispatchSetActiveImageItem,
    activeImageItemId,
    classes
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
      style={{ maxHeight: 'calc(100vh - 130px)', overflowY: 'scroll' }}
      cellHeight={300}
    >
      {items}
    </GridList>
  );
};

ImageItems.propTypes = {
  imageItems: ImmutablePropTypes.list.isRequired,
  setActiveImageItem: PropTypes.func.isRequired,
  activeImageItemId: PropTypes.number.isRequired,
  classes: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  imageItems: stylesheetSelectors.getFilteredItems(state),
  activeImageItemId: stylesheetSelectors.getActiveImageItemId(state)
});

const mapDispatchToProps = { setActiveImageItem };

export default withStyles(styles)(connect(mapStateToProps, mapDispatchToProps)(ImageItems));
