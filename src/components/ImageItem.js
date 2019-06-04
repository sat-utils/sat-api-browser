/* eslint react/require-default-props: 0, react/no-find-dom-node: 0 */
import React from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import GridListTile from '@material-ui/core/GridListTile';
import GridListTileBar from '@material-ui/core/GridListTileBar';
import IconButton from '@material-ui/core/IconButton';
import Icon from '@material-ui/icons/NoteAdd';
import scrollIntoView from 'scroll-into-view-if-needed';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import { format, parse } from 'date-fns';

const styles = () => ({
  tile: {
    cursor: 'pointer'
  },
  title: {
    fontSize: '0.9rem'
  },
  subtitle: {
    fontSize: '0.8rem'
  },
  icon: {
    color: 'rgba(255, 255, 255, 0.54)',
    '&:hover': {
      color: '#ff3333'
    }
  },
  selected: {
    cursor: 'pointer',
    borderStyle: 'solid',
    borderColor: '#ff3333',
    borderWidth: '5px'
  }
});

class ImageItem extends React.Component {
  constructor(props) {
    super(props);
    this.compRef = React.createRef();
  }

  componentDidUpdate(prevProps) {
    const { id, activeImageItemId } = this.props;
    const { activeImageItemId: previousActiveImageId } = prevProps;
    if (previousActiveImageId !== activeImageItemId) {
      if (id === activeImageItemId) {
        const compNode = ReactDOM.findDOMNode(this.compRef.current);
        scrollIntoView(compNode, {
          behavior: 'smooth',
          scrollMode: 'if-needed'
        });
      }
    }
  }

  render() {
    const {
      id,
      thumbnail,
      stacId,
      datetime,
      collection,
      setActiveImageItem,
      activeImageItemId,
      cols = 1,
      classes,
      width,
      scrollPosition,
      ...other
    } = this.props;
    const date = format(parse(datetime), 'MM/DD/YYYY - HH:mm:ss');
    const camelCollection = collection
      .replace(/(^|[\s-])\S/g, letter => (letter.toUpperCase()));
    return (
      <GridListTile
        className={id === activeImageItemId ? classes.selected : classes.tile}
        key={id}
        cols={cols}
        {...other}
        onClick={() => setActiveImageItem(id)}
        ref={this.compRef}
      >
        <LazyLoadImage
          scrollPosition={scrollPosition}
          height={width}
          width={width}
          src={thumbnail}
          placeholder={
            <span>Loading</span>
          }
        />
        <GridListTileBar
          classes={{
            title: classes.title,
            subtitle: classes.subtitle
          }}
          title={camelCollection}
          subtitle={date}
          actionIcon={(
            <IconButton
              className={classes.icon}
              onClick={() => console.log('test')}
            >
              <Icon />
            </IconButton>
          )}
        />
      </GridListTile>
    );
  }
}

ImageItem.propTypes = {
  id: PropTypes.number.isRequired,
  thumbnail: PropTypes.string.isRequired,
  setActiveImageItem: PropTypes.func.isRequired,
  activeImageItemId: PropTypes.number.isRequired,
  cols: PropTypes.number,
  stacId: PropTypes.string.isRequired,
  datetime: PropTypes.string.isRequired,
  classes: PropTypes.shape({
    title: PropTypes.string.isRequired,
    subtitle: PropTypes.string.isRequired
  }).isRequired
};

export default withStyles(styles)(ImageItem);
