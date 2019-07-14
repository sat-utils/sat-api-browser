import React from 'react';
import Adapter from 'enzyme-adapter-react-16';
import test from 'tape';
import { shallow, configure } from 'enzyme';
import GridListTileBar from '@material-ui/core/GridListTileBar';
import { ImageItem } from '../src/components/ImageItem';


configure({ adapter: new Adapter() });

test('ImageItem collection title', (t) => {
  const props = {
    id: 0,
    thumbnail: 'thumbnail',
    setActiveImageItem: () => {},
    activeImageItemId: 0,
    cols: 2,
    stacId: 'stacId',
    datetime: '2019-07-13T18:44:54.214000+00:00',
    classes: {
      title: 'title',
      subtitle: 'subtitle'
    },
    collection: undefined
  };

  let wrapper = shallow((<ImageItem {...props} />));
  let gridListTileBar = wrapper.find(GridListTileBar);
  t.equal(gridListTileBar.props().title.length, 0,
    'Title is empty string when no collection is passed');

  props.collection = 'collection';
  wrapper = shallow((<ImageItem {...props} />));
  gridListTileBar = wrapper.find(GridListTileBar);
  t.equal(gridListTileBar.props().title, 'Collection',
    'Title is camel-cased string when collection is passed');
  t.end();
});
