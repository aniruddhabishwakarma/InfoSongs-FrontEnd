import { useEffect, useState } from 'react';
import axios from 'axios';
import { Play, Heart, Plus } from 'lucide-react';

const SongInfoSection = ({ song, onPlayClick }) => {
  const [liked, setLiked] = useState(false);
  const token = localStorage.getItem('authToken');

  // ✅ Check if song is liked on load
  useEffect(() => {
    const checkLike = async () => {
      if (!token || !song?.song_id) return;
      try {
        const res = await axios.get(
          `http://localhost:8000/api/songs/${song.song_id}/is-liked/`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setLiked(res.data.liked);
      } catch (err) {
        console.error('❌ Error checking like status:', err);
      }
    };

    checkLike();
  }, [song?.song_id, token]);

  // ✅ Toggle like (uses backend toggle_like view)
  const toggleLike = async () => {
    if (!token || !song?.song_id) return;
    try {
      await axios.post(
        `http://localhost:8000/api/songs/${song.song_id}/like/`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setLiked((prev) => !prev); // toggle locally after success
    } catch (err) {
      console.error('❌ Error toggling like:', err);
    }
  };

  return (
    <div className="flex flex-col sm:flex-row gap-6">
      {/* Artist image */}
      <img
        src={song.artist.picture_url}
        alt="Artist"
        className="w-[217px] h-[217px] object-cover rounded-lg shadow-md"
      />

      {/* Info + buttons */}
      <div className="flex flex-col justify-center gap-3">
        <div>
          <h1 className="text-4xl font-extrabold">{song.title}</h1>
          <p className="text-base font-medium">{song.artist.name}</p>
        </div>

        <div className="flex items-center gap-4 mt-2">
          <button
            onClick={onPlayClick}
            className="bg-green-600 hover:bg-green-700 text-white px-5 py-2 rounded-full flex items-center gap-2 shadow"
          >
            <Play size={18} />
            Play all
          </button>

          {/* ❤️ Like Button */}
          <button
            onClick={toggleLike}
            className="bg-neutral-800 p-2 rounded-md hover:bg-neutral-700 transition"
          >
            {liked ? (
              <Heart className="w-5 h-5 text-green-500 fill-green-500" />
            ) : (
              <Heart className="w-5 h-5 text-white" />
            )}
          </button>

          {/* ➕ Placeholder */}
          <button className="bg-neutral-800 p-2 rounded-md hover:bg-neutral-700 transition">
            <Plus className="w-5 h-5 text-white" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default SongInfoSection;
