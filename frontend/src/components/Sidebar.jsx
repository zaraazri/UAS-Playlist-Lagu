export default function Sidebar() {
  const artists = [
    "Lana Del Rey",
    "LANY",
    "NIKI",
    "SEVENTEEN",
    "ENHYPEN",
    "TOMORROW X TOGETHER",
  ];

  return (
    <aside className="w-72 bg-[#121212] text-white p-4 hidden md:block">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h1 className="font-bold text-lg">📚 Your Library</h1>
        <button className="text-xl text-gray-400 hover:text-white">＋</button>
      </div>

      {/* Filter Buttons */}
      <div className="flex gap-2 mb-4">
        {["Playlists", "Podcasts", "Artists"].map(item => (
          <button
            key={item}
            className="px-3 py-1 rounded-full bg-[#2a2a2a] text-sm hover:bg-[#333]"
          >
            {item}
          </button>
        ))}
      </div>

      {/* Search & Sort */}
      <div className="flex items-center justify-between mb-3 text-gray-400">
        <span className="cursor-pointer">🔍</span>
        <span className="text-sm">Recents ☰</span>
      </div>

      {/* Library List */}
      <div className="space-y-3 overflow-y-auto h-[70vh] pr-2">
        {artists.map((artist, index) => (
          <div
            key={index}
            className="flex items-center gap-3 hover:bg-[#1f1f1f] p-2 rounded-lg cursor-pointer"
          >
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-green-500 to-emerald-700 flex items-center justify-center">
              🎤
            </div>
            <div>
              <p className="font-medium">{artist}</p>
              <p className="text-sm text-gray-400">Artist</p>
            </div>
          </div>
        ))}
      </div>
    </aside>
  );
}
