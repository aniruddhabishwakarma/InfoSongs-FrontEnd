import { Heart, Music, User, ChevronLeft, ChevronRight } from 'lucide-react';
import { NavLink } from 'react-router-dom';

const Sidebar = ({ collapsed, setCollapsed }) => {
  const toggleSidebar = () => setCollapsed((prev) => !prev);

  const linkStyle = ({ isActive }) =>
    `flex items-center gap-3 px-3 py-2 rounded transition hover:bg-neutral-700 ${
      isActive ? 'bg-neutral-800 text-green-400' : 'text-white'
    }`;

  return (
    <div
      className={`fixed top-20 left-0 h-[calc(100vh-5rem)] z-40 bg-neutral-900 border-r border-neutral-800 p-3 transition-all duration-300 ${
        collapsed ? 'w-16' : 'w-60'
      }`}
    >
      <div className="flex justify-between items-center mb-6">
        {!collapsed && <h2 className="text-lg font-bold">My Profile</h2>}
        <button
          onClick={toggleSidebar}
          className="p-1 hover:bg-neutral-700 rounded text-white"
        >
          {collapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
        </button>
      </div>

      <div className="space-y-3">
        <NavLink to="liked" className={linkStyle}>
          <Heart size={20} />
          {!collapsed && <span>Liked Songs</span>}
        </NavLink>

        <NavLink to="playlists" className={linkStyle}>
          <Music size={20} />
          {!collapsed && <span>My Playlists</span>}
        </NavLink>

        <NavLink to="following" className={linkStyle}>
          <User size={20} />
          {!collapsed && <span>Following</span>}
        </NavLink>
      </div>
    </div>
  );
};

export default Sidebar;
