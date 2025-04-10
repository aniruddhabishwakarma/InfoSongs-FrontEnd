import { useEffect, useState } from "react";
import { useParams, useOutletContext } from "react-router-dom";
import { useMusic } from "../context/MusicContext";
import SongPlayerSidebar from "../components/SongPlayerSidebar";

const PlaylistDetails = () => {
  const { id: playlistId } = useParams();
  const { collapsed } = useOutletContext();
  const [songs, setSongs] = useState([]);
  console.log(songs)
  const {
    selectedSong,
    setSelectedSong,
    spotifyToken,
    player,
    deviceId,
  } = useMusic();

  useEffect(() => {
    const fetchPlaylistSongs = async () => {
      const token = localStorage.getItem("authToken");
      const res = await fetch(`http://localhost:8000/api/playlists/${playlistId}/`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log(res)
      if (res.ok) {
        const data = await res.json();
        setSongs(data.songs); // assuming backend returns { songs: [...] }
      } else {
        console.error("Failed to fetch playlist songs");
      }
    };

    fetchPlaylistSongs();
  }, [playlistId]);

  const handleNext = () => {
    if (!songs.length || !selectedSong) return;

    const currentIndex = songs.findIndex(
      (song) => song.song_id === selectedSong.song_id
    );
    const nextIndex = (currentIndex + 1) % songs.length;
    setSelectedSong(songs[nextIndex]);
  };

  return (
    <div
      className={`transition-all duration-300 h-full ${
        collapsed ? "ml-10" : "ml-30"
      }`}
    >
      <div className="flex">
        {/* Table */}
        <div
          className={`min-w-[750px] w-full mr-10 ${
            collapsed ? "max-w-[calc(100%-420px)]" : "max-w-[70%]"
          }`}
        >
          <div className="max-h-[calc(90vh-160px)] overflow-y-auto pr-2">
            <table className="w-full text-left text-sm">
              <thead className="uppercase text-neutral-400 border-b border-neutral-700 sticky top-0 bg-black z-10">
                <tr>
                  <th className="pl-2 py-2 w-10">#</th>
                  <th className="py-2">Title</th>
                  <th className="py-2">Album</th>
                  <th className="py-2 text-right pr-4">Duration</th>
                </tr>
              </thead>
              <tbody>
                {songs.map((song, index) => {
                  const isPlaying = selectedSong?.song_id === song.song_id;
                  return (
                    <tr
                      key={song.song_id}
                      onClick={() => setSelectedSong(song)}
                      className={`border-b border-neutral-800 hover:bg-neutral-800 transition cursor-pointer ${
                        isPlaying ? "bg-neutral-800 text-green-400" : ""
                      }`}
                    >
                      <td className="pl-2 py-3 text-neutral-400">
                        {isPlaying ? (
                          <div className="flex items-center gap-1">
                            <span className="equalizer-bar h-3 w-[2px] bg-green-400 animate-eq"></span>
                            <span className="equalizer-bar h-4 w-[2px] bg-green-400 animate-eq delay-100"></span>
                            <span className="equalizer-bar h-2 w-[2px] bg-green-400 animate-eq delay-200"></span>
                          </div>
                        ) : (
                          index + 1
                        )}
                      </td>
                      <td className="flex items-center gap-4 py-3">
                        <img
                          src={song.album_cover}
                          alt={song.title}
                          className="w-10 h-10 object-cover rounded"
                        />
                        <div>
                          <div className={`font-medium ${isPlaying ? "text-green-400" : ""}`}>
                            {song.title}
                          </div>
                        </div>
                      </td>
                      <td className="py-3 text-neutral-400">{song.album_name}</td>
                      <td className="py-3 text-right text-neutral-400 pr-4">{song.duration}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Sidebar Player */}
        <div className="w-[400px] hidden lg:block ml-4">
          {selectedSong && player && deviceId && spotifyToken ? (
            <SongPlayerSidebar
              song={selectedSong}
              token={spotifyToken}
              player={player}
              deviceId={deviceId}
              onNext={handleNext}
            />
          ) : (
            <div className="w-full h-full bg-neutral-900 rounded-xl border border-neutral-700 flex items-center justify-center text-neutral-400 text-sm px-4 text-center">
              👈 Select a song to start playing
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PlaylistDetails;
