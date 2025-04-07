import { Play, Heart, Plus } from 'lucide-react';

const SongInfoSection = ({ song, onPlayClick }) => {
  return (
    <div className="flex flex-col sm:flex-row gap-6">
      {/* Artist image */}
      <img
        src={song.artist.picture_url}
        alt="Artist"
        className="w-[217px] h-[217px] object-cover rounded-lg shadow-md"
      />

      {/* Info + buttons stacked left */}
      <div className="flex flex-col justify-center gap-3">
        <div>
          <h1 className="text-4xl font-extrabold">
            {song.title}
          </h1>
          <p className="text-base font-medium">{song.artist.name}</p>
        </div>

        <div className="flex items-center gap-4 mt-2">
          <button
            onClick={onPlayClick}
            className="bg-green-600 hover:bg-green-700 text-white px-5 py-2 rounded-full flex items-center gap-2 shadow"
          >
            <Play size={18} />
            Play all
          </button>
          <button className="bg-neutral-800 p-2 rounded-md hover:bg-neutral-700 transition">
            <Heart className="w-5 h-5 text-white" />
          </button>
          <button className="bg-neutral-800 p-2 rounded-md hover:bg-neutral-700 transition">
            <Plus className="w-5 h-5 text-white" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default SongInfoSection;
