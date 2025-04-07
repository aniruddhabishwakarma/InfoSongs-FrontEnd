import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

const ArtistDetails = () => {
  const { artistId } = useParams();
  const [artist, setArtist] = useState(null);

  useEffect(() => {
    fetch(`http://localhost:8000/api/artist-details/${artistId}/`)
      .then((res) => res.json())
      .then((data) => setArtist(data))
      .catch((err) => console.error('Error fetching artist details:', err));
  }, [artistId]);

  if (!artist) {
    return <div className="text-white p-10">Loading artist info...</div>;
  }

  return (
    <div className="min-h-screen bg-neutral-950 text-white p-6">
      {/* Artist Info */}
      <div className="flex flex-col md:flex-row items-center md:items-start gap-6 mb-10">
        <img
          src={artist.picture_url}
          alt={artist.name}
          className="w-40 h-40 rounded-full shadow-lg object-cover"
        />
        <div className="space-y-2 text-center md:text-left">
          <h1 className="text-3xl font-bold">{artist.name}</h1>
          <p className="text-gray-400">Followers: {artist.followers.toLocaleString()}</p>
          <p className="text-gray-400">Popularity: {artist.popularity}</p>
        </div>
      </div>

      {/* Albums */}
      <div className="mb-10">
        <h2 className="text-2xl font-semibold mb-4">Albums</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {artist.albums.map((album) => (
            <div
              key={album.album_id}
              className="bg-neutral-800 rounded-lg p-4 shadow hover:scale-105 transition duration-200"
            >
              <img
                src={album.cover_url}
                alt={album.title}
                className="w-full h-48 object-cover rounded-md mb-2"
              />
              <p className="text-sm text-center mt-2">{album.title}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Songs */}
      <div>
        <h2 className="text-2xl font-semibold mb-4">Songs</h2>
        <div className="h-64 overflow-y-auto bg-neutral-800 rounded-lg p-4 space-y-2">
          {artist.songs.map((song, index) => (
            <div
              key={song.song_id}
              className="flex justify-between items-center text-sm p-2 hover:bg-neutral-700 rounded transition"
            >
              <span>{index + 1}. {song.title}</span>
              <span className="text-gray-400 text-xs">
                {Math.floor(song.duration / 60000)}:{String(Math.floor((song.duration % 60000) / 1000)).padStart(2, '0')}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ArtistDetails;
