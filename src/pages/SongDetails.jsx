import { useEffect, useState, useRef } from 'react';
import SongInfoSection from '../components/SongInfoSection';
import TrackList from '../components/TrackList';
import CommentsSection from '../components/CommentsSection';
import SongPlayerSidebar from '../components/SongPlayerSidebar';
import axios from 'axios';
import { useMusic } from '../context/MusicContext';
import ColorThief from 'colorthief';

const SongDetails = () => {
  const {
    selectedSong: song,
    setSelectedSong,
    spotifyToken: token,
    player,
    deviceId,
  } = useMusic();

  const [songDetails, setSongDetails] = useState(null);
  const [tracklist, setTracklist] = useState([]);
  const [currentSongId, setCurrentSongId] = useState(null);
  const [bgGradient, setBgGradient] = useState('#181818');
  const [textColor, setTextColor] = useState('text-white');
  const imgRef = useRef(null);

  useEffect(() => {
    if (!song?.song_id) return;
    fetch(`http://localhost:8000/api/song-details/${song.song_id}/`)
      .then(res => res.json())
      .then(data => {
        setSongDetails(data);
        setCurrentSongId(data.song_id);
      })
      .catch(err => console.error("❌ Error fetching song details:", err));
  }, [song?.song_id]);

  useEffect(() => {
    const fetchTracks = async () => {
      if (!song?.artist?.id) return;
      try {
        const res = await axios.get(
          `http://localhost:8000/api/songs/artist/${song.artist.id}/`
        );

        setTracklist(res.data);

        if (res.data.length > 0) {
          playSelectedTrack(res.data.find(t => t.song_id === song?.song_id) || res.data[0]);
        }
      } catch (err) {
        console.error("❌ Error fetching artist tracks:", err);
      }
    };

    fetchTracks();
  }, [song]);

  const playSelectedTrack = async (track) => {
    if (!track || !player || !deviceId) return;
    try {
      await fetch(`https://api.spotify.com/v1/me/player/play?device_id=${deviceId}`, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ uris: [track.uri] }),
      });

      const res = await fetch(`http://localhost:8000/api/song-details/${track.song_id}/`);
      const data = await res.json();
      setSongDetails(data);
      setCurrentSongId(track.song_id);
      setSelectedSong(track);
    } catch (err) {
      console.error("❌ Error playing selected track:", err);
    }
  };

  const handleNext = () => {
    if (!tracklist.length || !songDetails) return;
    const currentIndex = tracklist.findIndex(t => t.song_id === songDetails.song_id);
    const nextIndex = (currentIndex + 1) % tracklist.length;
    const nextTrack = tracklist[nextIndex];
    playSelectedTrack(nextTrack);
  };

  // 🟢 Set background gradient + adaptive text color
  useEffect(() => {
    const colorThief = new ColorThief();

    const extractColor = () => {
      if (imgRef.current && imgRef.current.complete) {
        const [r, g, b] = colorThief.getColor(imgRef.current);
        setBgGradient(`linear-gradient(to bottom, rgb(${r},${g},${b}), #181818)`);

        const brightness = 0.299 * r + 0.587 * g + 0.114 * b;
        setTextColor(brightness > 186 ? 'text-black' : 'text-white');
      }
    };

    if (imgRef.current) {
      if (imgRef.current.complete) extractColor();
      else imgRef.current.onload = extractColor;
    }
  }, [songDetails?.album_cover]);

  if (!song) return <div className="text-white text-center mt-20">No song selected.</div>;
  if (!songDetails) return <div className="text-white text-center mt-20">Loading song details...</div>;

  return (
    <div className={`px-6 pt-20 my-3 min-h-screen transition-colors duration-300 ${textColor}`} style={{ background: bgGradient }}>
      {/* Hidden image to extract color */}
      <img
        ref={imgRef}
        crossOrigin="anonymous"
        src={songDetails.album_cover}
        alt="cover"
        className="hidden"
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-10">
          <SongInfoSection song={songDetails} />
          <TrackList
            song={songDetails}
            tracklist={tracklist}
            setTracklist={setTracklist}
            onTrackClick={playSelectedTrack}
          />
          <CommentsSection songId={songDetails.song_id} />
        </div>
        <div className="lg:col-span-1">
          <SongPlayerSidebar
            song={songDetails}
            token={token}
            player={player}
            deviceId={deviceId}
            onNext={handleNext}
          />
        </div>
      </div>
    </div>
  );
};

export default SongDetails;
