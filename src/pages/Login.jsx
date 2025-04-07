import { useState } from "react";
import { GoogleLogin } from '@react-oauth/google';
import { jwtDecode } from "jwt-decode"; // 🛠️ Correct way with latest versions
import styles from './Login.module.css';
import { useNavigate } from 'react-router-dom';
import axios from "axios";


export default function Login({ setGoogleUser }) {
  const [formData, setFormData] = useState({ identifier: "", password: "" });
  const [error, setError] = useState("");
  const [googleUserData, setGoogleUserData] = useState(null);
  const [idToken, setIdToken] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleLogin = async () => {
    // 🧪 This is email/password login — you can remove or leave it here for later
    setError("Backend not connected yet. Use Google login for now!");
  };

  const handleGoogleSuccess = async (credentialResponse) => {
    const id_token = credentialResponse.credential;
    const decoded = jwtDecode(id_token);
  
    try {
      // 🔥 Send Google ID token to your Django backend
      const res = await axios.post("http://localhost:8000/api/google-login/", {
        id_token: id_token,
      });
      console.log(res.data.access)
      // ✅ Store JWT access token under correct key
      localStorage.setItem("authToken", res.data.access);          // <-- important
      localStorage.setItem("refreshToken", res.data.refresh);
      localStorage.setItem("googleUser", JSON.stringify(decoded));
      localStorage.setItem("google-id-token", id_token);

      window.dispatchEvent(new Event("auth-updated"));
  
      // optional: set in state if you need
      setGoogleUser(decoded);
      setGoogleUserData(decoded);
      setIdToken(id_token);
  
      // 🚀 Redirect to home
      navigate("/");
  
    } catch (err) {
      console.error("❌ Error logging in via backend:", err.response?.data || err.message);
      setError("Google login failed. Try again.");
    }
  };

  return (
    <div className={styles.loginWrapper}>
      <div className="bg-black/80 backdrop-blur-md shadow-2xl mx-auto p-8 rounded-xl w-full max-w-md text-white">
        <h2 className="text-2xl font-bold mb-6 text-center">
          Welcome Back <span>👋</span>
        </h2>

        {/* Google Login */}
        <div className="flex justify-center mb-4">
          <GoogleLogin
            onSuccess={handleGoogleSuccess}
            onError={() => setError("Google login failed ❌")}
          />
        </div>

        <div className="flex items-center my-6">
          <hr className="flex-grow border-gray-600" />
          <span className="mx-3 text-gray-400 text-sm">or login with email</span>
          <hr className="flex-grow border-gray-600" />
        </div>

        {error && <div className="text-red-400 mb-2 text-sm">{error}</div>}

        <input
          type="text"
          name="identifier"
          placeholder="Email or Username"
          value={formData.identifier}
          onChange={handleChange}
          className="w-full bg-gray-700 text-white p-2 rounded-md mb-3"
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          className="w-full bg-gray-700 text-white p-2 rounded-md mb-4"
        />

        <div className="flex justify-between text-sm mb-4">
          <span>
            Don’t have an account? <a className="text-green-500" href="#">Register</a>
          </span>
          <a className="text-blue-400" href="#">Forgot password?</a>
        </div>

        <button
          onClick={handleLogin}
          className="w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded-md font-bold transition"
        >
          Login
        </button>

        {/* Show decoded Google info if available */}
        {googleUserData && (
          <div className="mt-6 p-4 bg-gray-800 rounded-md text-sm break-words">
            <h3 className="font-bold mb-2 text-green-400">👤 Google User Info</h3>
            <pre>{JSON.stringify(googleUserData, null, 2)}</pre>
            <h3 className="font-bold mt-4 mb-2 text-yellow-400">🪙 ID Token</h3>
            <code className="text-xs text-white">{idToken}</code>
          </div>
        )}
      </div>
    </div>
  );
}
