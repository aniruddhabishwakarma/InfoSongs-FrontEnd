import { useEffect, useState } from "react";
import { useOutletContext } from "react-router-dom";
import { useMusic } from "../context/MusicContext";
import SongPlayerSidebar from "../components/SongPlayerSidebar";

const formatDuration = (milliseconds) => {
  const totalSeconds = Math.floor(milliseconds / 1000);
  const mins = Math.floor(totalSeconds / 60);
  const secs = totalSeconds % 60;
  return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
};

const LikedSongs = () => {
  const { collapsed } = useOutletContext();
  const [likedSongs, setLikedSongs] = useState([]);
  const {
    selectedSong,
    setSelectedSong,
    spotifyToken,
    player,
    deviceId,
  } = useMusic();

  useEffect(() => {
    const fetchLikedSongs = async () => {
      const token = localStorage.getItem("authToken");
      const res = await fetch("http://localhost:8000/api/liked-songs/", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.ok) {
        const data = await res.json();
        setLikedSongs(data);
      } else {
        console.error("Failed to fetch liked songs");
      }
    };

    fetchLikedSongs();
  }, []);

  return (
    <div
      className={`transition-all duration-300 h-full ${
        collapsed ? "ml-10" : "ml-30"
      }`}
    >
      <div className="flex">
        {/* ✅ Table container - responsive max width based on sidebar */}
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
                {likedSongs.map((song, index) => (
                  <tr
                    key={song.song_id}
                    onClick={() => setSelectedSong(song)} // ✅ Set song on click
                    className="border-b border-neutral-800 hover:bg-neutral-800 transition cursor-pointer"
                  >
                    <td className="pl-2 py-3 text-neutral-400">{index + 1}</td>
                    <td className="flex items-center gap-4 py-3">
                      <img
                        src={song.album_cover}
                        alt={song.song_name}
                        className="w-10 h-10 object-cover rounded"
                      />
                      <div>
                        <div className="font-medium">{song.song_name}</div>
                      </div>
                    </td>
                    <td className="py-3 text-neutral-400">{song.album_name}</td>
                    <td className="py-3 text-right text-neutral-400 pr-4">
                      {formatDuration(song.duration)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* ✅ Player Sidebar */}
        <div className="w-[400px] hidden lg:block ml-4">
  {selectedSong && player && deviceId && spotifyToken ? (
    <SongPlayerSidebar
      song={selectedSong}
      token={spotifyToken}
      player={player}
      deviceId={deviceId}
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

export default LikedSongs;
