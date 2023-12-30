import React, { useState, useRef, useEffect } from "react";

const Home = ({
  songList,
  setSongCover,
  playingSong,
  setPlayingSong,
  isPlaying,
  setIsPlaying,
  audioPlayerRef,
  handlePlayPause,
  handleTimeUpdate,
  handleDurationChange,
  handleSliderChange,
  currentTime,
  duration,
  likesList,
  listSelected,
  setListSelected,
  setActiveSong,
  activeSong,
  myApiData,
  recentPlayList,
  setRecentPlayList,
  handleNavSelect,
  playList,
  handlePlayListSelect,
  trackSelect,
  selectedItem,
  setSelectedItem,
  handleSongCover,
}) => {
  const [albumSong, setAlbumSong] = useState("");

  useEffect(() => {
    if (selectedItem !== undefined) {
      if (audioPlayerRef.current) {
        audioPlayerRef.current.addEventListener("timeupdate", handleTimeUpdate);
        audioPlayerRef.current.addEventListener(
          "durationchange",
          handleDurationChange
        );
      }
    }

    return () => {
      if (selectedItem !== undefined && audioPlayerRef.current) {
        audioPlayerRef.current.removeEventListener(
          "timeupdate",
          handleTimeUpdate
        );
        audioPlayerRef.current.removeEventListener(
          "durationchange",
          handleDurationChange
        );
      }
    };
  }, [selectedItem]);

  const handleSongPlay = (item, e) => {
    setActiveSong(item.id);
    if (document.querySelector(".favSong.active"))
      document.querySelector(".favSong.active").classList.remove("active");
    document.querySelector(`#song${item.id}`).classList.add("active");
    // e.target.closest(".favSong").classList.add("active");
    const isSongInRecentList = recentPlayList.some(
      (song) => song.name === item.name
    );
    setPlayingSong(item);
    if (!isSongInRecentList) {
      setRecentPlayList((prevList) => {
        const newList = [item, ...prevList.slice(0, 4)];
        return newList;
      });
    }
    setTimeout(() => {
      handlePlayPause();
    }, 10);
  };

  const handleSongPlayNew = (item, e) => {
    setSelectedItem(item);
    // console.log(item.track.name);
    if (document.querySelector(".favSong.active"))
      document.querySelector(".favSong.active").classList.remove("active");
    if (document.getElementById(item.track.name))
      document.getElementById(item.track.name).classList.add("active");
    const isSongInRecentList = recentPlayList.some(
      (song) => song.track.name === item.track.name
    );
    // setPlayingSong(item);
    if (!isSongInRecentList) {
      setRecentPlayList((prevList) => {
        const newList = [item, ...prevList.slice(0, 4)];
        return newList;
      });
    }
    setTimeout(() => {
      handlePlayPause();
    }, 10);
  };
  // console.log(likesList);
  return (
    <>
      <div className="homeMainDiv">
        <div className="nav-bar">
          <ul>
            <li className="nav-list">SP</li>
            <li
              id="tracks"
              className="nav-list active"
              onClick={(e) => handleNavSelect("Tracks", e.target.id)}
            >
              Tracks
            </li>
            <li
              id="playlist"
              className="nav-list"
              onClick={(e) => handleNavSelect("Playlist", e.target.id)}
            >
              Playlist
            </li>
            <li
              id="fav"
              className="nav-list"
              onClick={(e) => handleNavSelect("Fav", e.target.id)}
            >
              Fav
            </li>
          </ul>
        </div>
        <div className="fav-song-list">
          {trackSelect == "Tracks"
            ? playList &&
              playList.map((item, index) => {
                return (
                  <div
                    key={index}
                    id={item.data.name}
                    className="favSong"
                    onClick={(e) => handlePlayListSelect(item, e)}
                  >
                    <img
                      src={item.data.images.items[0].sources[0].url}
                      alt="song-cover"
                    />
                    <span className="song-name">{item.data.name}</span>
                  </div>
                );
              })
            : trackSelect == "Playlist"
            ? myApiData.items &&
              myApiData.items.map((item, index) => {
                return (
                  <div
                    key={index}
                    id={item.track.name}
                    className="favSong"
                    onClick={(e) => handleSongPlayNew(item, e)}
                  >
                    <img
                      src={
                        item.track.album.images[0]
                          ? item.track.album.images[0].url
                          : null
                      }
                      alt="song-cover"
                    />
                    <span className="song-name">{item.track.name}</span>
                  </div>
                );
              })
            : likesList &&
              trackSelect == "Fav" &&
              likesList.map((item, index) => {
                return (
                  <div
                    key={index}
                    id={item.track.name}
                    className="favSong"
                    onClick={(e) => handleSongPlayNew(item, e)}
                  >
                    <img
                      src={item.track.album.images[0].url}
                      alt="song-cover"
                    />
                    <span className="song-name">{item.track.name}</span>
                  </div>
                );
              })}
        </div>
        <div className="recent-played-list">
          {recentPlayList.length > 0 && <span>Recently played</span>}
          <div className="recent-song-list">
            {recentPlayList &&
              recentPlayList.map((item, index) => {
                return (
                  <div
                    key={index}
                    className="recentSong"
                    onClick={() => handleSongPlayNew(item)}
                  >
                    <img
                      src={item.track.album.images[0].url}
                      alt="song-cover"
                    />
                  </div>
                );
              })}
          </div>
        </div>
        <div className="add-img">
          <img
            src={process.env.PUBLIC_URL + "/images/add-cover.jpg"}
            alt="add-banner"
          />
        </div>
        {selectedItem && (
          <div className="footer-bar">
            {
              <div className="playing-song-div">
                <img
                  onClick={handleSongCover}
                  src={selectedItem.track.album.images[0].url}
                  alt="song-cover"
                />
                <span onClick={handleSongCover} className="playing-song-name">
                  {selectedItem.track.name}
                </span>
                <audio
                  ref={audioPlayerRef}
                  id="audioPlayer"
                  src={selectedItem.track.preview_url}
                ></audio>
                <button
                  id="playPauseButton"
                  className={isPlaying ? "pause" : "play"}
                  onClick={handlePlayPause}
                >
                  {isPlaying ? (
                    <img
                      src={process.env.PUBLIC_URL + "/images/pause.png"}
                      alt="song-cover"
                    />
                  ) : (
                    <img
                      src={process.env.PUBLIC_URL + "/images/play.png"}
                      alt="song-cover"
                    />
                  )}
                </button>
                <input
                  type="range"
                  id="songSlider"
                  value={currentTime}
                  max={duration}
                  onChange={handleSliderChange}
                />
              </div>
            }
          </div>
        )}
      </div>
    </>
  );
};

export default Home;
