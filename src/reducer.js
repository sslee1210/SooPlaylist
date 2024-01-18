import { ADD_TO_PLAYLIST } from './actions';

const initialState = {
  playlist: [],
};

const playlistReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'ADD_TO_PLAYLIST':
      return { playlist: [...state.playlist, action.payload] };
    case 'REMOVE_FROM_PLAYLIST':
      return {
        playlist: state.playlist.filter((video) => video.id.videoId !== action.payload),
      };
    case 'LOAD_PLAYLIST':
      return {
        playlist: action.playlist,
      };
    default:
      return state;
  }
};

export default playlistReducer;
