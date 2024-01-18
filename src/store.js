import { createStore, applyMiddleware } from 'redux';
import { thunk } from 'redux-thunk';
import playlistReducer from './reducer';

const persistedPlaylist = localStorage.getItem('playlist') ? JSON.parse(localStorage.getItem('playlist')) : [];

// 초기 상태를 전체 상태 객체로 설정
const initialState = {
  playlist: persistedPlaylist,
};

const store = createStore(playlistReducer, initialState, applyMiddleware(thunk));

store.subscribe(() => {
  localStorage.setItem('playlist', JSON.stringify(store.getState().playlist));
});

export default store;
