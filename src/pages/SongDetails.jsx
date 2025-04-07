// SongDetails.jsx
import { useEffect, useState } from 'react';
import SongInfoSection from '../components/SongInfoSection';
import TrackList from '../components/TrackList';
import CommentsSection from '../components/CommentsSection';
import SongPlayerSidebar from '../components/SongPlayerSidebar';
import axios from 'axios';

const SongDetails = ({ song, token, player, deviceId }) => {
  const [songDetails, setSongDetails] = useState(null);
  const [tracklist, setTracklist] = useState([]);
  const [currentSongId, setCurrentSongId] = useState(null);

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

  if (!song) {
    return <div className="text-white text-center mt-20">No song selected.</div>;
  }

  if (!songDetails) {
    return <div className="text-white text-center mt-20">Loading song details...</div>;
  }

  return (
    <div className="bg-black text-white px-6 py-10">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left section */}
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

        {/* Right section - Sidebar beside */}
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
