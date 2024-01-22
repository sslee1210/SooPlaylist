# 🎵 Soo Playlist

#### 사용 기술 <img src="https://img.shields.io/badge/HTML5-E34F26?style=flat-square&logo=HTML5&logoColor=white"/> <img src="https://img.shields.io/badge/Java--Script-F7DF1E?style=flat-square&logo=JAVASCRIPT&logoColor=black"/> <img src="https://img.shields.io/badge/React-61DAFB?style=flat-square&logo=React&logoColor=black"/> <img src="https://img.shields.io/badge/Redux-764ABC?style=flat-square&logo=Redux&logoColor=white"/>
#### 작업 기간 - 2024년 1월 15일 → 2024년 1월 21일
#### 작업 유형 - 개인프로젝트
<p align="center">
  <img src="https://github.com/sslee1210/SooPlaylist/assets/142865231/b539da47-1278-4a9c-ad5a-09e012b9995b.png"  width="200" height="auto"/>
</p>


## 프로젝트 목표

### redux-toolkit으로 작업하기

💡 **상태 관리를 효율적이게 할 수 있는 방법이 뭐가 있을까**

플레이리스트를 바로 저장하거나 삭제할 수 있게 redux-toolkit으로 작업하는 것을 목표로 두었다.

### API 요청하기

💡 **유튜브 API를 받아와 연결해보기**

음악 관련 API를 찾아보다가 유튜브 API가 하루 할당량은 다른 음악 API들보다 적지만 사용하기에 제일 깔끔하기에 유튜브에서 API를 받아왔다.

## 디렉토리 구조

<img src="https://github.com/sslee1210/SooPlaylist/assets/142865231/6a4616e1-79cc-4b13-ab5e-acff680f64ba.png"  width="200" height="auto"/>


## 페이지 구성 & 주요 로직

## 메인 페이지
<p align="center">
<img src="https://github.com/sslee1210/SooPlaylist/assets/142865231/b539da47-1278-4a9c-ad5a-09e012b9995b.png"  width="200" height="auto"/>
<img src="https://github.com/sslee1210/SooPlaylist/assets/142865231/d8565bcd-fa8e-4801-972b-47e8f61f3684.png"  width="200" height="auto"/>
</p>

- 유튜브 음악 관련 영상을 받아오기 위한 유튜브 API 통신
```
const YOUR_API_KEY = '내 API키';

...

// 검색 양식을 제출했을 때 호출되는 함수
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

  // 다음 페이지로 이동하는 함수
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

  // 이전 페이지로 이동하는 함수
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
``` 
- 재생목록과 찜 목록 구현
```
// 재생 목록에 추가하는 함수
const handleAddToPlaylist = (video) => {
const isAlreadyInPlaylist = playlist.find((v) => v.id.videoId === video.id.videoId);
```
 
```
// 찜 목록에 추가하는 함수
const addToFavorites = (video, comment) => {
```
 
- react-toastify 라이브러리를 활용하여 알림창 커스터마이즈
- **redux를 사용한 상태 관리**
```
// 리덕스 스토어에서 재생 목록을 가져옵니다.
const playlist = useSelector((state) => state.playlist);
```

---


## 재생목록

<p align="center">
<img src="https://github.com/sslee1210/SooPlaylist/assets/142865231/39a3c2db-0dff-46e6-8dc3-a109bad8ead4.png"  width="200" height="auto"/>
</p>

**1. 재생 목록에 저장된 음악 리스트**

<img src="https://github.com/sslee1210/SooPlaylist/assets/142865231/e51662cd-de11-47ba-985f-b066fbe9249e.png"  width="200" height="auto"/>

```
// 재생목록에 중복된 음악이 있을 시 추가 x

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
```

**2. react-youtube와 youtube-player를 이용하여 프로그래밍 방식으로 동영상 재생 제어**

<img src="https://github.com/sslee1210/SooPlaylist/assets/142865231/b3f9db7d-c173-4f0a-a3ac-434907b47772.png"  width="200" height="auto"/>

```
 // YouTube Player API를 이용하여 비디오 플레이어를 생성하고 조작하는 로직을 정의한 이펙트 훅
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
```

---


## 찜 목록

<p align="center">
<img src="https://github.com/sslee1210/SooPlaylist/assets/142865231/5e22cc30-c0e1-4766-97fb-bb664cede3eb.png"  width="200" height="auto"/>
</p>

**1. 찜 목록에 저장된 음악**

<img src="https://github.com/sslee1210/SooPlaylist/assets/142865231/e7b65117-fbf1-44da-9cc9-f96be4b62327.png"  width="200" height="auto"/>

```
// 이미 찜 목록에 있는지 검사
const isAlreadyInFavorites = favorites.find((v) => v.id.videoId === video.id.videoId);

// 이미 찜 목록에 있다면, 찜 목록을 업데이트
if (isAlreadyInFavorites) {
  const updatedFavorites = favorites.map((v) =>
    v.id.videoId === video.id.videoId ? { ...v, comment: comment } : v
  );
setFavorites(updatedFavorites);
localStorage.setItem('favorites', JSON.stringify(updatedFavorites));
} else {
// 찜 목록에 없다면, 찜 목록에 추가
const newFavorites = [...favorites, { ...video, comment: comment, isFavorited: true }];
setFavorites(newFavorites);
localStorage.setItem('favorites', JSON.stringify(newFavorites));
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

  // 찜 목록에서 삭제하는 함수
  const removeFromFavorites = (videoId) => {
  const newFavorites = favorites.filter((video) => video.id.videoId !== videoId);
    setFavorites(newFavorites);
    localStorage.setItem('favorites', JSON.stringify(newFavorites));
  };
```

**2. 음악 제목을 누르면 간단한 한줄평 남기기**

<img src="https://github.com/sslee1210/SooPlaylist/assets/142865231/7332223a-8984-4588-9c05-0d90f64fe2fc.png"  width="200" height="auto"/>

```
// 코멘트 변경을 처리하는 함수
const handleCommentChange = (videoId, comment) => {
const newFavorites = favorites.map((video) =>
  video.id.videoId === videoId ? { ...video, comment: comment } : video
 );
setFavorites(newFavorites);
localStorage.setItem('favorites', JSON.stringify(newFavorites));
 };
```


---

## 📜[작업일지 보러가기](https://neighborly-goal-bcc.notion.site/d11289c41ca04019bf63eabcd548dbe8?v=b781ccbaad4b4c4a9fa651a96f0061c5&pvs=4/)

# 문제 및 해결
## 무슨 문제?


### 문제 발생



### 원인 파악




### 문제 해결


---

## 무슨 문제?

### 문제 발생


### 문제 해결


# 프로젝트 후기


# 🎶[프로젝트 바로가기](https://sslee1210.github.io/SooPlaylist/)
