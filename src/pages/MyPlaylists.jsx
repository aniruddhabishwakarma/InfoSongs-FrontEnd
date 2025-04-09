import { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const MyPlaylists = () => {
  const [playlists, setPlaylists] = useState([]);
  const [loading, setLoading] = useState(true);
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

  return (
    <div className="p-8 text-white">
      <h1 className="text-2xl font-bold mb-6">My Playlists</h1>

      {loading ? (
        <p>Loading playlists...</p>
      ) : playlists.length === 0 ? (
        <p className="text-gray-400">You haven't created any playlists yet.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {playlists.map((playlist) => (
            <Link
              to={`/playlist/${playlist.id}`}
              key={playlist.id}
              className="bg-neutral-800 p-4 rounded-lg hover:bg-neutral-700 transition shadow"
            >
              <h2 className="text-lg font-semibold mb-1">{playlist.name}</h2>
              <p className="text-sm text-gray-400">
                {playlist.description || 'No description'}
              </p>
              <p className="text-xs text-gray-500 mt-2">{new Date(playlist.created_at).toLocaleDateString()}</p>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyPlaylists;
