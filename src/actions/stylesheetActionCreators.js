import * as types from '../constants/action_types';

export function setStyle(style) {
  return {
    type: types.SET_STYLE,
    payload: {
      style
    }
  };
}

export function setStyleSucceeded() {
  return {
    type: types.SET_STYLE_SUCCEEDED,
    payload: {
    }
  };
}

export function setClientSize(payload) {
  return {
    type: types.SET_CLIENT_SIZE,
    payload
  };
}

export function setActiveImageItem(imageId) {
  return {
    type: types.SET_ACTIVE_IMAGE_ITEM,
    payload: {
      imageId
    }
  };
}

export function startDrawing() {
  return {
    type: types.START_DRAWING
  };
}

export function drawingCompleted(feature) {
  return {
    type: types.DRAWING_COMPLETED,
    payload: {
      feature
    }
  };
}
