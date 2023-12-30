import React, { useState, useEffect, useRef } from "react";
import "./App.css";
import Home from "./component/Home";
import SongCover from "./component/SongCover";
const App = () => {
  const [myApiData, setmyApiData] = useState([]);
  const [type, setType] = useState("pshubham9");
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [recentPlayList, setRecentPlayList] = useState([]);
  const [listSelected, setListSelected] = useState("Tracks");
  const [trackSelect, setTrackSelect] = useState("Tracks");
  const [playList, setPlayList] = useState([]);
  const [playListId, setPlayListId] = useState("");
  const [songCover, setSongCover] = useState(false);
  const [selectedItem, setSelectedItem] = useState("");
  const [likesList, setLikedList] = useState([]);
  const audioPlayerRef = useRef(null);
  const fetchApi = () => {
    return new Promise(async (resolve, reject) => {
      let url;
      let options;
      if (trackSelect == "Tracks") {
        url =
          "https://spotify23.p.rapidapi.com/search/?q=all&type=playlists&offset=0&limit=100&numberOfTopResults=5";
        options = {
          method: "GET",
          headers: {
            "X-RapidAPI-Key":
              "3c02695937mshb70e14edd6a887ep1d4b40jsn815127e0e2d4",
            "X-RapidAPI-Host": "spotify23.p.rapidapi.com",
          },
        };
      } else {
        url = `https://spotify23.p.rapidapi.com/playlist_tracks/?id=${playListId}&offset=0&limit=100`;
        options = {
          method: "GET",
          headers: {
            "X-RapidAPI-Key":
              "3c02695937mshb70e14edd6a887ep1d4b40jsn815127e0e2d4",
            "X-RapidAPI-Host": "spotify23.p.rapidapi.com",
          },
        };
      }

      try {
        const response = await fetch(url, options);
        const result = await response.json();
        resolve(result);
      } catch (error) {
        reject(error);
      }
    });
  };
  const handleNavSelect = (selection, id) => {
    setListSelected(selection);
    setTrackSelect(selection);
    if (document.querySelector(".nav-list.active"))
      document.querySelector(".nav-list.active").classList.remove("active");
    document.getElementById(id).classList.add("active");
  };
  const handleTimeUpdate = () => {
    setCurrentTime(
      audioPlayerRef.current ? audioPlayerRef.current.currentTime : 0
    );
  };

  const handleDurationChange = () => {
    setDuration(audioPlayerRef.current ? audioPlayerRef.current.duration : 0);
  };

  const handleSliderChange = (event) => {
    const time = parseFloat(event.target.value);
    setCurrentTime(time);
    if (audioPlayerRef.current) {
      audioPlayerRef.current.currentTime = time;
    }
  };
  const handlePlayPause = () => {
    if (audioPlayerRef.current && audioPlayerRef.current.paused) {
      audioPlayerRef.current.play();
      setIsPlaying(true);
    } else if (audioPlayerRef.current) {
      audioPlayerRef.current.pause();
      setIsPlaying(false);
    }
  };
  const handlePlayListSelect = (item) => {
    // console.log(item.data.uri);
    const str = item.data.uri;
    let id = str.split(":")[2];
    setPlayListId(id);
    setTrackSelect("Playlist");
    handleNavSelect("Playlist", "playlist");
  };
  const handleSongCover = () => {
    setSongCover(true);
    document.getElementById("root").style.overflow = "hidden";
  };

  const handlePlayNext = () => {
    const currentIndex = myApiData.items.findIndex(
      (song) => song.track.name === selectedItem.track.name
    );

    if (currentIndex !== -1 && currentIndex < myApiData.items.length - 1) {
      // Check if the current song is found and it's not the last one
      const nextSong = myApiData.items[currentIndex + 1].track;
      // console.log(nextSong);
      setSelectedItem({ track: nextSong });
      // Perform actions to play the next song (e.g., update audio source)
      if (document.querySelector(".favSong.active"))
        document.querySelector(".favSong.active").classList.remove("active");
      if (document.getElementById(nextSong.name))
        document.getElementById(nextSong.name).classList.add("active");
    } else {
      // Handle case when the current song is not found or it's the last one
      console.log("No next song available");
    }
    setTimeout(() => {
      handlePlayPause();
    }, 100);
  };
  const handlePlayPrevious = () => {
    const currentIndex = myApiData.items.findIndex(
      (song) => song.track.name === selectedItem.track.name
    );

    if (currentIndex !== -1 && currentIndex > 0) {
      // Check if the current song is found and it's not the last one
      const nextSong = myApiData.items[currentIndex - 1].track;
      setSelectedItem({ track: nextSong });
      // Perform actions to play the next song (e.g., update audio source)

      if (document.querySelector(".favSong.active"))
        document.querySelector(".favSong.active").classList.remove("active");
      if (document.getElementById(selectedItem.track.name))
        document
          .getElementById(selectedItem.track.name)
          .classList.add("active");
    } else {
      // Handle case when the current song is not found or it's the last one
      console.log("No previous song available");
    }
    setTimeout(() => {
      handlePlayPause();
    }, 100);
  };

  const handleHitLike = (likedSong) => {
    setLikedList((prev) =>
      prev === undefined ? [likedSong] : [...prev, likedSong]
    );
  };

  useEffect(() => {
    const fetchAndSetData = async () => {
      try {
        let result;
        if (trackSelect === "Tracks") {
          result = await fetchApi();
          setPlayList(result.playlists.items);
        } else {
          if (playListId) {
            result = await fetchApi();
            setmyApiData(result);
          }
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchAndSetData();
  }, [trackSelect, playListId]);

  return (
    <>
      <Home
        myApiData={myApiData}
        audioPlayerRef={audioPlayerRef}
        currentTime={currentTime}
        handlePlayPause={handlePlayPause}
        handleTimeUpdate={handleTimeUpdate}
        handleDurationChange={handleDurationChange}
        handleSliderChange={handleSliderChange}
        duration={duration}
        isPlaying={isPlaying}
        recentPlayList={recentPlayList}
        setRecentPlayList={setRecentPlayList}
        handleNavSelect={handleNavSelect}
        playList={playList}
        listSelected={listSelected}
        handlePlayListSelect={handlePlayListSelect}
        trackSelect={trackSelect}
        setSongCover={setSongCover}
        selectedItem={selectedItem}
        setSelectedItem={setSelectedItem}
        handleSongCover={handleSongCover}
        likesList={likesList}
      />
      {songCover && (
        <SongCover
          isPlaying={isPlaying}
          handlePlayPause={handlePlayPause}
          handleSliderChange={handleSliderChange}
          currentTime={currentTime}
          duration={duration}
          setSongCover={setSongCover}
          selectedItem={selectedItem}
          handlePlayNext={handlePlayNext}
          handlePlayPrevious={handlePlayPrevious}
          handleHitLike={handleHitLike}
        />
      )}
    </>
  );
};

export default App;
