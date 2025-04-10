import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useSpotifyAuth } from './context/SpotifyAuthContext';
import { useEffect, useState } from 'react';
import { useMusic } from './context/MusicContext';
import Layout from './components/Layout';
import Home from './pages/Home';
import Login from './pages/Login';
import ArtistDetail from './pages/ArtistDetail';
import SongDetails from './pages/SongDetails';
import SpotifyPlayer from './components/SpotifyPlayer';
import { Toaster } from 'react-hot-toast';
import MyPlaylists from './pages/MyPlaylists';
import LikedSongs from './pages/LikedSongs';
import Following from './pages/Following';
import PlaylistDetails from './pages/PlayListDetails';

function App() {
  const { token: spotifyToken, isAuthChecked, redirectToSpotify } = useSpotifyAuth();
  const [googleUser, setGoogleUser] = useState(null);
  const [isUserLoggedIn, setIsUserLoggedIn] = useState(
    !!localStorage.getItem("authToken") && localStorage.getItem("loginMethod") === "normal"
  );

  const {
    setSelectedSong,
    selectedSong,
    setPlayer,
    setDeviceId,
    setSpotifyToken,
  } = useMusic();

  const isGoogleLoggedIn = !!googleUser;
  const isNormalLoggedIn = isUserLoggedIn;

  useEffect(() => {
    if (spotifyToken) {
      setSpotifyToken(spotifyToken);
    }
  }, [spotifyToken, setSpotifyToken]);

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

  useEffect(() => {
    const handleAuthUpdate = () => {
      const isLoggedIn =
        !!localStorage.getItem("authToken") &&
        localStorage.getItem("loginMethod") === "normal";
      setIsUserLoggedIn(isLoggedIn);
    };

    window.addEventListener("auth-updated", handleAuthUpdate);
    return () => {
      window.removeEventListener("auth-updated", handleAuthUpdate);
    };
  }, []);

  if (!isAuthChecked) {
    return <div className="text-white text-center mt-20">Checking Spotify authentication...</div>;
  }

  // ❌ No Spotify token
  if (!spotifyToken) {
    return (
      <div className="flex flex-col h-screen items-center justify-center text-white bg-black">
        <h1 className="mb-4 text-xl">Login to Spotify to Continue</h1>
        <button
          onClick={redirectToSpotify}
          className="px-6 py-2 bg-green-600 rounded-lg hover:bg-green-700"
        >
          Login with Spotify
        </button>
      </div>
    );
  }

  return (
    <>
      <Toaster position="top-right" toastOptions={{ duration: 3000 }} />
      <BrowserRouter>
        <Routes>
          <Route
            path="/login"
            element={
              isGoogleLoggedIn || isNormalLoggedIn ? (
                <Navigate to="/" />
              ) : (
                <Login setGoogleUser={setGoogleUser} />
              )
            }
          />

          {/* ✅ Protected Layout (for future use) */}
          
          <Route
            path="/"
            element={
              !(isGoogleLoggedIn || isNormalLoggedIn) ? (
                <Navigate to="/login" />
              ) : (
                <Layout />
              )
            }
          >
         

          {/* ✅ Using open layout temporarily */}
          {/* <Route path="/" element={<Layout />}> */}
            <Route
              index
              element={
                <>
                  <SpotifyPlayer />
                  <Home
                    token={spotifyToken}
                    onSongSelect={setSelectedSong}
                    setGoogleUser={setGoogleUser}
                  />
                </>
              }
            />
            <Route path="artist/:id" element={<ArtistDetail />} />
            <Route path="liked" element={<LikedSongs />} />
            <Route path="playlists" element={<MyPlaylists />} />
            <Route path="playlist/:id" element={<PlaylistDetails />} />
            <Route path="following" element={<Following />} />

            <Route
              path="song-details"
              element={
                selectedSong ? <SongDetails /> : <Navigate to="/" />
              }
            />
          </Route>
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
