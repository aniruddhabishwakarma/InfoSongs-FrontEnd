import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useSpotifyAuth } from './context/SpotifyAuthContext';
import { useEffect, useState } from 'react';
import { useMusic } from './context/MusicContext'; // ✅ use global context
import Layout from './components/Layout';
import Home from './pages/Home';
import Login from './pages/Login';
import ArtistDetail from './pages/ArtistDetail';
import SongDetails from './pages/SongDetails';
import SpotifyPlayer from './components/SpotifyPlayer';
import { Toaster } from 'react-hot-toast';
import MyPlaylists from './pages/MyPlaylists';
import Profile from './pages/Profile';
import LikedSongs from './pages/LikedSongs';
import Following from './pages/Following';


function App() {
  const { token: spotifyToken, isAuthChecked, redirectToSpotify } = useSpotifyAuth();
  const [googleUser, setGoogleUser] = useState(null);

  const {
    setSelectedSong,
    selectedSong,
    setPlayer,
    setDeviceId,
    setSpotifyToken,
  } = useMusic();

  // ✅ Sync spotifyToken to MusicContext
  useEffect(() => {
    if (spotifyToken) {
      setSpotifyToken(spotifyToken);
    }
  }, [spotifyToken, setSpotifyToken]);

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

  if (!isAuthChecked) {
    return <div className="text-white text-center mt-20">Checking Spotify authentication...</div>;
  }

  return (
    <>
      <Toaster position="top-right" toastOptions={{ duration: 3000 }} />
      <BrowserRouter>
        <Routes>
          {/* Login Page */}
          <Route path="/login" element={<Login setGoogleUser={setGoogleUser} />} />

          {/* Protected Layout */}
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
                  <SpotifyPlayer /> {/* ✅ No props now */}
                  <Home
                    token={spotifyToken}
                    onSongSelect={setSelectedSong}
                    setGoogleUser={setGoogleUser}
                  />
                </>
              }
            />

            {/* Artist Page */}
            <Route path="artist/:id" element={<ArtistDetail />} />

            {/* Profile with nested routes */}
            <Route path="/profile" element={<Profile />}>
              <Route path="liked" element={<LikedSongs />} />
              <Route path="playlists" element={<MyPlaylists />} />
              <Route path="following" element={<Following />} />
            </Route>

            {/* Song Details Page (uses global selectedSong) */}
            <Route
              path="song-details"
              element={
                selectedSong ? (
                  <SongDetails />
                ) : (
                  <Navigate to="/" />
                )
              }
            />
          </Route>
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
