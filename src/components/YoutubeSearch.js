import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { connect, useSelector } from 'react-redux';
import { addToPlaylist } from '../actions';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import search from './YoutubeSearch.module.css';

const YoutubeSearch = (props) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [nextPageToken, setNextPageToken] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageTokens, setPageTokens] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [comment, setComment] = useState('');

  const YOUR_API_KEY = 'AIzaSyBlPpQXDMpqrje1tKxq2V1QFMigaoGLzHo';
  const playlist = useSelector((state) => state.playlist);

  // 찜 목록에 추가
  const addToFavorites = (video) => {
    const isAlreadyInFavorites = favorites.find((v) => v.id.videoId === video.id.videoId);

    if (isAlreadyInFavorites) {
      toast('이미 찜 한 영상입니다.', {
        position: 'top-center',
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    } else {
      setFavorites([...favorites, { ...video, comment: '' }]);
      toast('찜 목록에 추가되었습니다.', {
        position: 'top-center',
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    }
  };

  const removeFromFavorites = (videoId) => {
    setFavorites(favorites.filter((video) => video.id.videoId !== videoId));
  };

  const handleCommentChange = (videoId, comment) => {
    setFavorites(favorites.map((video) => (video.id.videoId === videoId ? { ...video, comment: comment } : video)));
  };

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    fetch(
      `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${query} offical music video&maxResults=10&order=viewCount&key=${YOUR_API_KEY}`
    )
      .then((response) => response.json())
      .then((data) => {
        setResults(data.items);
        setNextPageToken(data.nextPageToken);
        setCurrentPage(1);
        setPageTokens([]);
      })
      .catch((error) => console.log('Error:', error));
  };

  const handleNextPage = () => {
    fetch(
      `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${query} offical music video&maxResults=10&order=viewCount&pageToken=${nextPageToken}&key=${YOUR_API_KEY}`
    )
      .then((response) => response.json())
      .then((data) => {
        setResults(data.items);
        setNextPageToken(data.nextPageToken);
        setCurrentPage(currentPage + 1);
        setPageTokens([...pageTokens, nextPageToken]);
      })
      .catch((error) => console.log('Error:', error));
  };

  const handlePreviousPage = () => {
    if (pageTokens.length === 0) return;
    const prevPageToken = pageTokens[pageTokens.length - 1];
    fetch(
      `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${query} offical music video&maxResults=10&order=viewCount&pageToken=${prevPageToken}&key=${YOUR_API_KEY}`
    )
      .then((response) => response.json())
      .then((data) => {
        setResults(data.items);
        setNextPageToken(data.prevPageToken);
        setCurrentPage(currentPage - 1);
        setPageTokens(pageTokens.slice(0, -1));
      })
      .catch((error) => console.log('Error:', error));
  };

  const parseHTMLEntities = (str) => {
    const parser = new DOMParser();
    const dom = parser.parseFromString('<!doctype html><body>' + str, 'text/html');
    return dom.body.textContent;
  };

  const handleAddToPlaylist = (video) => {
    const isAlreadyInPlaylist = playlist.find((v) => v.id.videoId === video.id.videoId);

    if (isAlreadyInPlaylist) {
      toast('재생 목록에 있는 음악입니다.', {
        position: 'top-center',
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    } else {
      props.addToPlaylist(video);
      toast('재생 목록에 추가되었습니다.', {
        position: 'top-center',
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    }
  };
  return (
    <div className={search.container}>
      <ToastContainer />
      <form onSubmit={handleSubmit} className={search.searchForm}>
        <input
          className={search.searchTEXT}
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="듣고싶은 음악을 찾아보세요"
        />
        <button className={search.searchBTN} type="submit">
          검색
        </button>
      </form>
      <Link to="/playlist" className={search.link}>
        재생목록 보기
      </Link>
      <button className={search.favoritebtn} onClick={openModal}>
        찜 목록 보기
      </button>{' '}
      {/* 수정 */}
      {isModalOpen && (
        <div className={search.modal}>
          {favorites.map((favorite, index) => (
            <div key={index}>
              <h3>{favorite.snippet.title}</h3>
              <input
                type="text"
                value={favorite.comment}
                onChange={(e) => handleCommentChange(favorite.id.videoId, e.target.value)}
                placeholder="평을 입력하세요."
              />
              <button onClick={() => removeFromFavorites(favorite.id.videoId)}>찜 제거</button>
            </div>
          ))}
          <button className={search.favoriteexit} onClick={closeModal}>
            닫기
          </button>
        </div>
      )}
      {results.length > 0 ? (
        results.map((result, index) => (
          <div key={index}>
            <div className={search.title}>
              <h3>{parseHTMLEntities(result.snippet.title)}</h3>
              <button className={search.add} onClick={() => handleAddToPlaylist(result)}>
                재생목록에 추가
              </button>
              <button onClick={() => addToFavorites(result)}>❤️</button>
            </div>
            <iframe
              className={search.video}
              width="300"
              height="200"
              src={`https://www.youtube.com/embed/${result.id.videoId}`}
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
          </div>
        ))
      ) : (
        <h2 className={search.icon}>🎵</h2>
      )}
      {results.length > 0 && (
        <div className="pageBTN">
          <button className={search.bfpage} onClick={handlePreviousPage}>
            이전 페이지
          </button>
          <button className={search.afpage} onClick={handleNextPage} disabled={!nextPageToken}>
            다음 페이지
          </button>
        </div>
      )}
    </div>
  );
};

const mapDispatchToProps = { addToPlaylist };
const mapStateToProps = (state) => {
  return {
    playlist: state.playlist,
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(YoutubeSearch);
