import React, { useState, useRef, useEffect } from "react";
import { useUser } from "../context/UserContext";
import { Search, Download } from "lucide-react";
import { Link } from "react-router-dom";

const Navbar = () => {
  const { user, logout, loading } = useUser();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
<div className="w-full fixed h-20 bg-[#121212] flex items-center justify-between px-6 shadow-sm border-b border-gray-800 z-50">

  {/* Logo */}
  <Link to="/" className="text-white text-2xl font-semibold">
  🎧 saṅgeet
</Link>

  {/* Search */}
  <div className="flex-1 mx-6 relative max-w-md">
    <input
      type="text"
      placeholder="What you wanna listen today?"
      className="w-full rounded-full px-4 py-3 pl-10 text-sm bg-[#1f1f1f] text-white placeholder-gray-400 outline-none focus:ring-2 focus:ring-blue-500"
    />
    <Search className="absolute left-3 top-4 text-gray-400 h-4 w-4" />
  </div>

  {/* Right */}
  <div className="flex items-center space-x-6">
    {/* Install App Button */}
    <button className="text-white flex items-center space-x-1 text-sm hover:text-blue-400 transition">
      <Download className="w-4 h-4" />
      <span>Install app</span>
    </button>

    {/* Profile dropdown */}
    {!loading && user && (
      <div className="relative" ref={dropdownRef}>
        <img
          src={user.profile_picture || "https://i.pravatar.cc/40"}
          alt="Profile"
          className="w-10 h-10 rounded-full border border-gray-700 cursor-pointer"
          onClick={() => setDropdownOpen((prev) => !prev)}
        />

        {dropdownOpen && (
          <div className="absolute right-0 mt-2 w-40 bg-white dark:bg-[#1f1f1f] text-sm rounded-lg shadow-lg overflow-hidden z-50">
            <Link
              to="/settings"
              className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-800 dark:text-white"
            >
              ⚙️ Settings
            </Link>
            <button
              onClick={logout}
              className="w-full text-left px-4 py-4 text-red-500 hover:bg-red-50 dark:hover:bg-red-900"
            >
              🚪 Logout
            </button>
          </div>
        )}
      </div>
    )}
  </div>
</div>
  );
};

export default Navbar;
