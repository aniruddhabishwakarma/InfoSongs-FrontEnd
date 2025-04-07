import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useSpotifyAuth } from './context/SpotifyAuthContext';
import { useEffect, useState } from 'react';
import Layout from './components/Layout';
import Home from './pages/Home';
import Login from './pages/Login';
import ArtistDetail from './pages/ArtistDetail';
import SongDetails from './pages/SongDetails';
import SpotifyPlayer from './components/SpotifyPlayer';

function App() {
  const { token: spotifyToken, isAuthChecked, redirectToSpotify } = useSpotifyAuth();
  const [googleUser, setGoogleUser] = useState(null);
  const [player, setPlayer] = useState(null);
  const [deviceId, setDeviceId] = useState(null);
  const [selectedSong, setSelectedSong] = useState(null);

  // ✅ Load Google login
  useEffect(() => {
    const userData = localStorage.getItem("googleUser");
    const idToken = localStorage.getItem("google-id-token");

    if (!userData || !idToken) {
      setGoogleUser(null);
      return;
    }

    try {
      const parsed = JSON.parse(userData);
      setGoogleUser(parsed);
    } catch (err) {
      console.error("❌ Error parsing Google user:", err);
      setGoogleUser(null);
    }
  }, []);

  const handleSongSelect = (song) => setSelectedSong(song);

  if (!isAuthChecked) {
    return <div className="text-white text-center mt-20">Checking Spotify authentication...</div>;
  }

  return (
    <BrowserRouter>
      <Routes>
        {/* Login Page */}
        <Route path="/login" element={<Login setGoogleUser={setGoogleUser} />} />

        {/* Protected App Layout */}
        <Route
          path="/"
          element={
            !spotifyToken ? (
              <div className="flex flex-col h-screen items-center justify-center text-white bg-black">
                <h1 className="mb-4 text-xl">Login to Spotify to Continue</h1>
                <button
                  onClick={redirectToSpotify}
                  className="px-6 py-2 bg-green-600 rounded-lg hover:bg-green-700"
                >
                  Login with Spotify
                </button>
              </div>
            ) : !googleUser ? (
              <Navigate to="/login" />
            ) : (
              <Layout />
            )
          }
        >
          {/* Home Page */}
          <Route
            index
            element={
              <>
                <SpotifyPlayer token={spotifyToken} setPlayer={setPlayer} setDeviceId={setDeviceId} />
                <Home
                  token={spotifyToken}
                  onSongSelect={handleSongSelect}
                  setGoogleUser={setGoogleUser}
                />
              </>
            }
          />

          {/* Artist Page */}
          <Route path="artist/:id" element={<ArtistDetail />} />

          {/* Song Details Page (passes selected song) */}
          <Route
            path="song-details"
            element={
              selectedSong ? (
                <SongDetails
                  song={selectedSong}
                  token={spotifyToken}
                  player={player}
                  deviceId={deviceId}
                />
              ) : (
                <Navigate to="/" />
              )
            }
          />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
