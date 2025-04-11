import { useSearchParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";

const SearchResults = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get("q") || "";
  const [results, setResults] = useState({ artists: [], songs: [] });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchResults = async () => {
      if (!query.trim()) {
        setResults({ artists: [], songs: [] });
        return;
      }

      setLoading(true);
      try {
        const res = await axios.get(`http://localhost:8000/api/search/?q=${encodeURIComponent(query)}`);
        setResults(res.data || { artists: [], songs: [] });
      } catch (err) {
        console.error("Search error:", err);
        setResults({ artists: [], songs: [] });
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, [query]);

  return (
    <div className="p-6 text-white">
      <h2 className="text-xl font-bold mb-6">Search Results for "{query}"</h2>

      {loading && <p className="text-gray-400">Searching...</p>}

      {!loading && (
        <>
          <div className="mb-8">
            <h3 className="text-lg font-semibold mb-2">Artists</h3>
            {Array.isArray(results.artists) && results.artists.length === 0 ? (
              <p className="text-gray-500">No artists found.</p>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {results.artists.map((artist) => (
                  <div key={artist.id} className="bg-[#1f1f1f] p-4 rounded-lg text-center">
                    <img
                      src={artist.picture_url || "https://via.placeholder.com/150"}
                      alt={artist.name}
                      className="w-full h-32 object-cover rounded-md mb-2"
                    />
                    <p>{artist.name}</p>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-2">Songs</h3>
            {Array.isArray(results.songs) && results.songs.length === 0 ? (
              <p className="text-gray-500">No songs found.</p>
            ) : (
              <ul className="divide-y divide-gray-700">
                {results.songs.map((song) => (
                  <li key={song.id} className="py-3">
                    <div className="flex items-center space-x-4">
                      <img
                        src={song.cover_url || "https://via.placeholder.com/50"}
                        alt={song.title}
                        className="w-12 h-12 rounded"
                      />
                      <div>
                        <p className="font-semibold">{song.title}</p>
                        <p className="text-gray-400 text-sm">
                          {song.artist} • {song.album_name}
                        </p>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default SearchResults;
