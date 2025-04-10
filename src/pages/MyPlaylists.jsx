import { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import ColorThief from 'colorthief';

const MyPlaylists = () => {
  const [playlists, setPlaylists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [bgColors, setBgColors] = useState({});
  const token = localStorage.getItem('authToken');

  useEffect(() => {
    const fetchPlaylists = async () => {
      try {
        const res = await axios.get('http://localhost:8000/api/playlists/', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setPlaylists(res.data);
      } catch (err) {
        console.error('❌ Error fetching playlists:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchPlaylists();
  }, [token]);

  const handleImageLoad = (imgElement, playlistId) => {
    try {
      const colorThief = new ColorThief();
      const [r, g, b] = colorThief.getColor(imgElement);
      const gradient = `linear-gradient(to bottom right, rgb(${r}, ${g}, ${b}), #181818)`;

      setBgColors((prev) => ({
        ...prev,
        [playlistId]: gradient,
      }));
    } catch (err) {
      console.error(`Failed to extract color for playlist ${playlistId}`, err);
    }
  };

  return (
    <div className="p-5 sm:p-5 text-white bg-[#181818] my-3 min-h-screen">
      {loading ? (
        <p className="text-sm text-gray-400">Loading playlists...</p>
      ) : playlists.length === 0 ? (
        <p className="text-sm text-gray-400">You haven't created any playlists yet.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {playlists.map((playlist) => (
            <Link
              to={`/playlist/${playlist.id}`}
              key={playlist.id}
              className="rounded-xl overflow-hidden shadow-md hover:shadow-lg hover:scale-[1.02] transition transform duration-300"
              style={{
                background: bgColors[playlist.id] || "#181818"
              }}
            >
              <div className="relative group">
                {/* Hidden image for color extraction */}
                <img
                  src={playlist.cover_url}
                  alt="Album Cover"
                  className="absolute w-0 h-0 opacity-0"
                  crossOrigin="anonymous"
                  onLoad={(e) => handleImageLoad(e.target, playlist.id)}
                />

                {/* Visible Album Image */}
                <img
                  src={playlist.cover_url}
                  alt="Album Cover"
                  className="w-full h-50 object-cover rounded-t-xl"
                />

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    e.preventDefault();
                    console.log("▶ Play", playlist.name);
                  }}
                  className="absolute bottom-2 left-2 bg-black text-white rounded-full p-2 shadow-md opacity-0 group-hover:opacity-100 transition"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="white"
                    viewBox="0 0 24 24"
                    width="20"
                    height="20"
                  >
                    <path d="M5 3v18l15-9L5 3z" />
                  </svg>
                </button>
              </div>

              <div className="p-4">
                <h2 className="text-lg font-semibold text-white tracking-wide mb-1 truncate">
                  {playlist.name}
                </h2>
                <p className="text-sm text-gray-300 mb-2 truncate">
                  {playlist.description || ''}
                </p>
                <p className="text-xs text-gray-400">
                  Created on {new Date(playlist.created_at).toLocaleDateString()}
                </p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyPlaylists;



