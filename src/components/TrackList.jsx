import { useEffect } from 'react';
import axios from 'axios';

const TrackList = ({ song, tracklist, setTracklist, onTrackClick }) => {
  console.log(song)
  useEffect(() => {
    if (!song?.artist?.id) return;

    const fetchTracks = async () => {
      try {
        const res = await axios.get(
          `http://localhost:8000/api/songs/artist/${song.artist.id}/`
        );

        setTracklist(res.data);
      } catch (err) {
        console.error("❌ Error fetching tracks:", err);
      }
    };

    fetchTracks();
  }, [song]);

  const formatTime = (duration) => {
    const ms = typeof duration === 'string' ? parseInt(duration) : duration;
    const totalSeconds = Math.floor(ms / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = (totalSeconds % 60).toString().padStart(2, '0');
    return `${minutes}m:${seconds}s`;
  };

  return (
    <div className="mt-4">
      <h2 className="text-xl font-semibold mb-4">Tracklist</h2>
      <table className="w-full text-left table-auto">
        <thead className="sticky top-0 bg-black z-10">
          <tr className="text-gray-400 text-sm border-b border-neutral-700">
            <th className="py-2">Title</th>
            <th>Album</th>
            <th>Duration</th>
          </tr>
        </thead>
        <tbody>
          {tracklist.slice(0, 5).map((track) => (
            <tr
              key={track.song_id}
              onClick={() => onTrackClick(track)}
              className={`hover:bg-neutral-800 transition cursor-pointer ${
                song.song_id === track.song_id ? 'bg-neutral-800 text-green-400' : ''
              }`}
            >
              <td className="py-3">
                <div className="flex items-center gap-3">
                  <img
                    src={track.album_cover}
                    alt="cover"
                    className="w-10 h-10 object-cover rounded"
                  />
                  <span className="text-sm font-medium">{track.song_name}</span>
                </div>
              </td>
              <td className="text-sm text-gray-300">{track.album_name || 'Single'}</td>
              <td className="text-sm text-gray-300">{formatTime(track.duration)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TrackList;
