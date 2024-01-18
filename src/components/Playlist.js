import React, { useEffect, useRef, useState } from 'react';
import { connect } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { removeFromPlaylist, loadPlaylist } from '../actions';
import playlistStyles from './Playlist.module.css';

const Playlist = (props) => {
  const path = process.env.PUBLIC_URL;
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [selectedIndex, setSelectedIndex] = useState(null);
  const [player, setPlayer] = useState(null);
  const [isListOpen, setIsListOpen] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const navigate = useNavigate();
  const playerRef = useRef(null);
  const progressBarRef = useRef(null);

  const playlistClass = selectedVideo
    ? playlistStyles.playlist
    : `${playlistStyles.playlist} ${playlistStyles.expanded}`;

  useEffect(() => {
    const savedPlaylist = localStorage.getItem('playlist');
    if (savedPlaylist) {
      props.dispatch(loadPlaylist(JSON.parse(savedPlaylist)));
    }
  }, [props.dispatch]);

  useEffect(() => {
    localStorage.setItem('playlist', JSON.stringify(props.playlist));
    if (props.playlist.length === 0) {
      setIsListOpen(true);
    }
  }, [props.playlist]);

  const handleBack = () => {
    navigate(-1);
  };

  const handleVideoSelect = (video, index) => {
    if (selectedVideo === video && player) {
      if (isPlaying) {
        player.pauseVideo();
        setIsPlaying(false);
      } else {
        player.playVideo();
        setIsPlaying(true);
      }
    } else {
      setSelectedVideo(video);
      setSelectedIndex(index);
      if (player) {
        player.loadVideoById(video.id.videoId);
        player.playVideo();
        setIsPlaying(true);
      }
    }
  };

  const handleVideoRemove = (video) => {
    props.dispatch(removeFromPlaylist(video.id.videoId));
  };

  const handlePrevVideo = () => {
    if (selectedIndex > 0) {
      const prevVideo = props.playlist[selectedIndex - 1];
      handleVideoSelect(prevVideo, selectedIndex - 1);
    }
  };

  const handleNextVideo = () => {
    if (selectedIndex < props.playlist.length - 1) {
      const nextVideo = props.playlist[selectedIndex + 1];
      handleVideoSelect(nextVideo, selectedIndex + 1);
    }
  };

  const toggleList = () => {
    setIsListOpen(!isListOpen);
  };

  const handleProgressBarClick = (e) => {
    const { left, width } = progressBarRef.current.getBoundingClientRect();
    const clickPositionInProgressBar = e.clientX - left;
    const ratio = clickPositionInProgressBar / width;
    const newTime = duration * ratio;
    player.seekTo(newTime, true);
  };

  useEffect(() => {
    const interval = setInterval(() => {
      if (player && isPlaying) {
        setCurrentTime(player.getCurrentTime());
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [player, isPlaying]);

  useEffect(() => {
    if (selectedVideo && !player) {
      const newPlayer = new window.YT.Player(playerRef.current, {
        videoId: selectedVideo.id.videoId,
        width: '720',
        height: '405',
        playerVars: {
          controls: 0,
        },
        events: {
          onReady: (event) => {
            setPlayer(event.target);
            setDuration(event.target.getDuration());
            event.target.playVideo();
          },
          onStateChange: (event) => {
            if (event.data === window.YT.PlayerState.PLAYING) {
              setIsPlaying(true);
            } else if (event.data === window.YT.PlayerState.PAUSED) {
              setIsPlaying(false);
            }
          },
        },
      });
    }
  }, [selectedVideo]);

  return (
    <div className={playlistStyles.container}>
      <button className={playlistStyles.backButton} onClick={handleBack}>
        ⬅ 음악 찾기
      </button>
      {selectedVideo ? (
        <>
          <div ref={playerRef} className={playlistStyles.videoPlayer}></div>
          <div className={playlistStyles.progressBarContainer} ref={progressBarRef} onClick={handleProgressBarClick}>
            <div className={playlistStyles.progressBar} style={{ width: `${(currentTime / duration) * 100}%` }} />
          </div>
          <div className={playlistStyles.startbtn}>
            <button className={playlistStyles.controlButton} onClick={handlePrevVideo} disabled={selectedIndex <= 0}>
              <img src={`${path}/images/Previous.png`} alt="이전 음악" />
            </button>
            <button
              className={playlistStyles.controlButton}
              onClick={() => handleVideoSelect(selectedVideo, selectedIndex)}
            >
              {isPlaying ? (
                <img src={`${path}/images/stop.png`} alt="정지" />
              ) : (
                <img src={`${path}/images/Play.png`} alt="재생" />
              )}
            </button>
            <button
              className={playlistStyles.controlButton}
              onClick={handleNextVideo}
              disabled={selectedIndex >= props.playlist.length - 1}
            >
              <img src={`${path}/images/next.png`} alt="다음 음악" />
            </button>
          </div>
        </>
      ) : (
        <h2 className={playlistStyles.playlistHeader}>플레이리스트</h2>
      )}
      <div className={playlistStyles.playlistContainer}>
        {isListOpen &&
          (props.playlist.length > 0 ? (
            <ul>
              {props.playlist.map((video, index) => (
                <li key={video.id.videoId} className={playlistStyles.videoItem}>
                  <span
                    className={playlistStyles.videoTitle}
                    onClick={() => handleVideoSelect(video, index)}
                    style={{
                      fontWeight: selectedVideo === video ? 'bold' : 'normal',
                    }}
                  >
                    {video.snippet.title}
                  </span>
                  <button className={playlistStyles.delete} onClick={() => handleVideoRemove(video)}>
                    ❌
                  </button>
                </li>
              ))}
            </ul>
          ) : (
            <p>목록이 비어있습니다</p>
          ))}
      </div>
    </div>
  );
};

const mapStateToProps = (state) => {
  return {
    playlist: state.playlist,
  };
};

export default connect(mapStateToProps)(Playlist);
