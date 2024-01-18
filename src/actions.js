export const ADD_TO_PLAYLIST = 'ADD_TO_PLAYLIST';
export const REMOVE_FROM_PLAYLIST = 'REMOVE_FROM_PLAYLIST';
export const LOAD_PLAYLIST = 'LOAD_PLAYLIST';

export const addToPlaylist = (video) => {
  return {
    type: ADD_TO_PLAYLIST,
    payload: video,
  };
};

export const removeFromPlaylist = (videoId) => {
  return {
    type: REMOVE_FROM_PLAYLIST,
    payload: videoId,
  };
};

export const loadPlaylist = (playlist) => {
  return {
    type: LOAD_PLAYLIST,
    playlist,
  };
};
