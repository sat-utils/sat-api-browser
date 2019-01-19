/* eslint no-return-assign: 0, camelcase: 0, no-param-reassign: 0, prefer-spread: 0 */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import ImmutablePropTypes from 'react-immutable-proptypes';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import mapboxgl from 'mapbox-gl';
import { diff } from '@mapbox/mapbox-gl-style-spec';
import withWidth from '@material-ui/core/withWidth';
import * as stylesheetActionCreators
  from '../actions/stylesheetActionCreators';
import * as stylesheetSelectors from '../reducers/stylesheetSelectors';
import * as stylesheetConstants from '../constants/stylesheetConstants';
import MapLoadingProgress from './MapLoadingProgress';

const accessToken = process.env.REACT_APP_MAPBOX_ACCESS_TOKEN;

const addLayers = (map) => {
  const {
    imageFootprints,
    filteredItemsSource,
    activeImageItemSource,
    activeImageItem,
  } = stylesheetConstants;

  map.addLayer({
    id: imageFootprints,
    type: 'fill',
    source: filteredItemsSource,
    layout: {},
    paint: {
      'fill-opacity': ['case',
        ['boolean', ['feature-state', 'hover'], false],
        0.6,
        0.2
      ],
      'fill-color': '#088'
    }
  });

  map.addLayer({
    id: activeImageItem,
    type: 'raster',
    source: activeImageItemSource,
    layout: {
      visibility: 'none'
    }
  });
};

const addSources = (map) => {
  const {
    filteredItemsSource,
    activeImageItemSource
  } = stylesheetConstants;

  map.addSource(filteredItemsSource, {
    type: 'geojson',
    data: {
      type: 'FeatureCollection',
      crs: { type: 'name', properties: { name: 'urn:ogc:def:crs:OGC:1.3:CRS84' } },
      features: []
    }
  });

  map.addSource(activeImageItemSource, {
    type: 'raster',
    url: 'mapbox://mapbox.streets',
    tileSize: 256
  });
};

class Map extends Component {
  constructor(props) {
    super(props);
    this.state = { loading: true };
  }
  // eslint-disable-next-line
  applyStyleChanges(style, nextStyle) {
    const changes = diff(style, nextStyle);
    if (changes.length > 0) {
      this.setState({ loading: true });
    }
    changes.forEach((change) => {
      const { map } = this;
      if (change.command === 'setGeoJSONSourceData') {
        // This is a workaround patch for updateSource not being
        // low level enough for a generic apply command - dff.js has also
        // been patched.
        map.getSource(change.args[0]).setData(change.args[1]);
      } else {
        map[change.command].apply(map, change.args);
      }
    });
  }

  componentDidMount() {
    const {
      setStyle,
      setStyleSucceeded,
      setActiveImageItem,
      setClientSize,
      width,
      style
    } = this.props;

    if (width !== 'xs') {
      mapboxgl.accessToken = accessToken;
      const mapConfig = {
        container: this.node,
        style: 'mapbox://styles/mapbox/dark-v9',
        center: [-103.59179687498357, 40.66995747013945],
        zoom: 3,
        attributionControl: false
      };
      this.hoverId = null;
      const map = new mapboxgl.Map(mapConfig);
      map.on('load', () => {
        addSources(map);
        addLayers(map);

        const resizeHandler = () => {
          const { clientHeight, clientWidth } = map.getCanvas();
          setClientSize({ clientWidth, clientHeight });
        };
        map.on('resize', resizeHandler);

        const loadedStyle = map.getStyle();
        if (style.size === 0) {
          setStyle(loadedStyle);
          setStyleSucceeded();
          const { clientHeight, clientWidth } = map.getCanvas();
          setClientSize({ clientWidth, clientHeight });
        } else {
          this.applyStyleChanges(loadedStyle, style.toJS());
        }
      });

      const onMapRender = (e) => {
        if (e.target && e.target.loaded()) {
          this.setState({ loading: false });
        }
      };
      this.onMapRender = onMapRender;

      map.on('render', this.onMapRender);

      this.map = map;
    }
  }

  componentWillUnmount() {
    this.map.off('render', this.onMapRender);
  }

  componentWillReceiveProps(nextProps) {
    const { style } = this.props;
    const nextStyle = nextProps.style;
    //  if (!Immutable.is(style, nextStyle)) {
    if (style !== nextStyle) {
      this.applyStyleChanges(style.toJS(), nextStyle.toJS());
    }
  }

  render() {
    const { width } = this.props;
    const { loading } = this.state;
    let mapDiv;
    const style = {
      position: 'absolute',
      top: 65,
      bottom: 0,
      width: width === 'sm' ? '50%' : '50%',
      overflow: 'hidden'
    };
    if (width === 'xs') {
      mapDiv = <div />;
    } else {
      mapDiv = (
        <React.Fragment>
          <div id="map" style={style} ref={c => this.node = c} />
          <MapLoadingProgress loading={loading} />
        </React.Fragment>
      );
    }
    return mapDiv;
  }
}

Map.propTypes = {
  style: ImmutablePropTypes.map.isRequired,
  setStyle: PropTypes.func.isRequired,
  filterItems: PropTypes.func.isRequired,
  setActiveImageItem: PropTypes.func.isRequired,
  setClientSize: PropTypes.func.isRequired,
  width: PropTypes.string.isRequired,
  setStyleSucceeded: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
  style: stylesheetSelectors.getStyle(state)
});

const mapDispatchToProps = dispatch => (
  bindActionCreators(
    Object.assign({}, stylesheetActionCreators), dispatch
  )
);

export default connect(mapStateToProps, mapDispatchToProps)(withWidth()(Map));
