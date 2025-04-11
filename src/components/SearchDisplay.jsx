import Noresults from '../assets/noresults.png'
import ColorThief from 'colorthief';
import { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

const SearchDisplay = ({ results, setPageGradient, setSelectedSong }) => {
  const {
    exact_artist,
    songs_by_artist,
    albums_by_artist,
    exact_song,
    related_songs,
  } = results;

  const navigate = useNavigate();
  const artistFromSong = exact_song?.artist || null;
  const isExactSongOnly = exact_song && !exact_artist;
  const imgRef = useRef(null);

  useEffect(() => {
    const img = imgRef.current;
    if (img && img.complete && (exact_song || exact_artist)) {
      extractColor(img);
    }
  }, [exact_song, exact_artist]);

  const extractColor = (img) => {
    try {
      const colorThief = new ColorThief();
      const color = colorThief.getColor(img);
      const rgb = `rgb(${color.join(",")})`;
      setPageGradient(`from-[${rgb}] via-[#181818] to-[#181818]`);
    } catch (err) {
      console.error("Color extraction failed", err);
    }
  };

  const handleSongClick = (song) => {
    setSelectedSong?.(song);
    navigate(`/song-details/${song.id}`);
  };

  return (
    <div className={`text-white p-6`}>
      {/* 🎤 Artist Info From exact_song */}
      {isExactSongOnly && artistFromSong && (
        <div className="mb-10">
          <div className="flex items-center gap-6 mb-6">
            <img
              ref={imgRef}
              crossOrigin="anonymous"
              src={artistFromSong.picture_url}
              alt={artistFromSong.name}
              className="w-28 h-28 rounded-full object-cover border border-gray-700"
              onLoad={(e) => extractColor(e.target)}
            />
            <div>
              <h2 className="text-2xl font-bold">{artistFromSong.name}</h2>
              {artistFromSong.genres && (
                <p className="text-sm text-gray-400">
                  Genres: {artistFromSong.genres.join(", ")}
                </p>
              )}
              {artistFromSong.followers && (
                <p className="text-sm text-gray-400">
                  Followers: {artistFromSong.followers.toLocaleString()}
                </p>
              )}
              {artistFromSong.popularity && (
                <p className="text-sm text-gray-400">
                  Popularity: {artistFromSong.popularity} / 100
                </p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* 🎤 Exact Artist Info */}
      {exact_artist && (
        <div className="mb-10">
          <div className="flex items-center gap-6 mb-6">
            <img
              ref={imgRef}
              crossOrigin="anonymous"
              src={exact_artist.picture_url}
              alt={exact_artist.name}
              className="w-28 h-28 rounded-full object-cover border border-gray-700"
              onLoad={(e) => extractColor(e.target)}
            />
            <div>
              <h2 className="text-2xl font-bold">{exact_artist.name}</h2>
              <p className="text-sm text-gray-400">
                Genres: {exact_artist.genres.join(", ")}
              </p>
              <p className="text-sm text-gray-400">
                Followers: {exact_artist.followers.toLocaleString()}
              </p>
              <p className="text-sm text-gray-400">
                Popularity: {exact_artist.popularity} / 100
              </p>
            </div>
          </div>

          {songs_by_artist?.length > 0 && (
            <div className="mb-6">
              <h3 className="text-xl font-semibold mb-4">
                Top Songs by {exact_artist.name}
              </h3>
              <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {songs_by_artist.map((song) => (
                  <li
                    key={song.id}
                    className="flex items-center gap-4 bg-[#1f1f1f] p-3 rounded-md cursor-pointer"
                    onClick={() => handleSongClick(song)}
                  >
                    <img
                      src={song.cover_url}
                      alt={song.title}
                      className="w-16 h-16 rounded"
                    />
                    <div>
                      <p className="font-medium">{song.title}</p>
                      <p className="text-gray-400 text-sm">{song.album_name}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {albums_by_artist?.length > 0 && (
            <div>
              <h3 className="text-xl font-semibold mb-4">
                Albums by {exact_artist.name}
              </h3>
              <ul className="list-disc list-inside text-gray-300">
                {albums_by_artist.map((album, i) => (
                  <li key={i}>{album}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}

      {/* 🎵 Exact Song */}
      {exact_song && (
        <div className="mb-10">
          <div className="flex items-center gap-6 mb-6">
            <img
              ref={imgRef}
              crossOrigin="anonymous"
              src={exact_song.cover_url}
              alt={exact_song.title}
              className="w-24 h-24 rounded-md object-cover shadow-md"
              onLoad={(e) => extractColor(e.target)}
            />
            <div>
              <h2 className="text-2xl font-bold">{exact_song.title}</h2>
              <p className="text-gray-400 text-sm mb-1">
                Album: {exact_song.album_name}
              </p>
              <div className="flex items-center gap-2 mt-2">
                <p className="text-sm text-gray-300">{exact_song.artist.name}</p>
              </div>
            </div>
          </div>

          {related_songs?.length > 0 && (
            <div>
              <h3 className="text-xl font-semibold mb-4">
                More Songs by {exact_song.artist.name}
              </h3>
              <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {related_songs.map((song) => (
                  <li
                    key={song.id}
                    className="flex items-center gap-4 bg-[#1f1f1f] p-3 rounded-md cursor-pointer"
                    onClick={() => handleSongClick(song)}
                  >
                    <img
                      src={song.cover_url}
                      alt={song.title}
                      className="w-16 h-16 rounded object-cover"
                    />
                    <div>
                      <p className="font-medium">{song.title}</p>
                      <p className="text-gray-400 text-sm">{song.album_name}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}

      {/* ❌ No Results */}
      {!exact_artist && !exact_song && (
        <div className="flex flex-col items-center justify-center h-full text-center text-white">
          <img
            src={Noresults}
            alt="No results"
            className="w-80 h-69 mb-6"
          />
          <h2 className="text-3xl font-bold mb-2">No result found</h2>
          <p className="text-sm text-gray-400">
            We couldn't find what you search for<br />Try Searching again
          </p>
        </div>
      )}
    </div>
  );
};

export default SearchDisplay;
