import { Provider } from 'react-redux';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import store from './store';
import './App.css';
import YoutubeSearch from './components/YoutubeSearch';
import Playlist from './components/Playlist';

const App = () => {
  return (
    <Provider store={store}>
      <Router>
        <Routes>
          <Route path="/" element={<YoutubeSearch />} />
          <Route path="/playlist" element={<Playlist />} />
        </Routes>
      </Router>
    </Provider>
  );
};

export default App;
