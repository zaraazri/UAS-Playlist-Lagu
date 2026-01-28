import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom/client";

// Tentukan API_BASE berdasarkan environment
const API_BASE = (() => {
  const env = import.meta.env.VITE_API_URL;
  // Jika ada value dari env variable, gunakan itu
  if (env) return env;
  // Jika di localhost, gunakan localhost:5000
  if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
    return 'http://localhost:5000';
  }
  // Jika di production, gunakan relative URL (same domain)
  return '';
})();

const App = () => {
  const [songs, setSongs] = useState([]);
  const [playlists, setPlaylists] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeCategory, setActiveCategory] = useState("Playlists");
  
  // State Login & Form
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem("token"));
  const [formData, setFormData] = useState({ title: "", artist: "" });
  const [editingId, setEditingId] = useState(null);

  const refreshData = () => {
    fetch(`${API_BASE}/api/songs`).then(res => res.json()).then(data => setSongs(data));
    fetch(`${API_BASE}/api/playlists`).then(res => res.json()).then(data => setPlaylists(data));
  };

  useEffect(() => { refreshData(); }, []);

  // --- FITUR LOGIN ---
  const handleLogin = () => {
    const username = prompt("Masukkan Username Admin:");
    if (!username) return;

    fetch(`${API_BASE}/api/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username })
    })
    .then(res => res.json())
    .then(data => {
      localStorage.setItem("token", data.token);
      setIsLoggedIn(true);
      alert("Welcome, Admin!");
    });
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsLoggedIn(false);
  };

  // --- FITUR CRUD ---
  const handleSubmit = (e) => {
    e.preventDefault();
    const method = editingId ? "PUT" : "POST";
    const url = editingId ? `${API_BASE}/api/songs/${editingId}` : `${API_BASE}/api/songs`;

    fetch(url, {
      method: method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    }).then(() => {
      refreshData();
      setFormData({ title: "", artist: "" });
      setEditingId(null);
    });
  };

  const handleDelete = (id) => {
    if (window.confirm("Hapus lagu ini?")) {
      fetch(`${API_BASE}/api/songs/${id}`, { method: "DELETE" }).then(() => refreshData());
    }
  };

  return (
    <div className="flex h-screen p-2 gap-2 bg-black font-sans text-white overflow-hidden">
      {/* SIDEBAR */}
      <aside className="w-80 flex flex-col gap-2 h-full">
        <div className="bg-[#121212] rounded-xl p-6 space-y-5">
          <div className="flex items-center gap-4 text-gray-400 hover:text-white cursor-pointer font-bold transition"><span className="text-2xl">🏠</span> Home</div>
          <div className="flex items-center gap-4 text-gray-400 hover:text-white cursor-pointer font-bold transition"><span className="text-2xl">🔍</span> Search</div>
        </div>

        <div className="bg-[#121212] rounded-xl flex-1 p-4 overflow-hidden flex flex-col">
          <div className="flex justify-between items-center mb-6 px-2 text-gray-400">
            <div className="flex items-center gap-2 hover:text-white cursor-pointer">
              <span className="text-2xl">📚</span> <span className="font-bold">Your Library</span>
            </div>
            <button className="hover:text-white text-2xl">+</button>
          </div>
          
          {/* LIBRARY FILTER (Fitur Baru Berfungsi) */}
          <div className="flex gap-2 mb-4 px-2">
            {["Playlists", "Artists", "Podcasts"].map(item => (
              <button 
                key={item} 
                onClick={() => setActiveCategory(item)}
                className={`${activeCategory === item ? "bg-white text-black" : "bg-[#2a2a2a] text-white"} hover:bg-[#333] px-4 py-1.5 rounded-full text-xs font-bold transition`}
              >
                {item}
              </button>
            ))}
          </div>

          <div className="flex-1 overflow-y-auto space-y-2">
            {playlists.filter(p => p.category === activeCategory).map(p => (
              <div key={p.id} className="flex items-center gap-3 p-2 hover:bg-[#1a1a1a] rounded-lg cursor-pointer transition">
                <div className="w-12 h-12 bg-gradient-to-br from-green-600 to-blue-500 rounded-md flex items-center justify-center">🎵</div>
                <div>
                  <p className="font-medium text-sm">{p.name}</p>
                  <p className="text-xs text-gray-400">{p.category.slice(0,-1)} • User</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <main className="flex-1 bg-gradient-to-b from-[#222] to-[#121212] rounded-xl overflow-y-auto relative">
        <header className="sticky top-0 z-20 bg-[#121212]/60 backdrop-blur-md p-4 flex justify-between items-center">
          <div className="flex items-center gap-3 bg-[#242424] px-4 py-2 rounded-full w-96 border border-transparent focus-within:border-white">
            <span className="text-gray-400">🔍</span>
            <input type="text" placeholder="What do you want to listen to?" className="bg-transparent border-none outline-none w-full text-sm" onChange={(e) => setSearchTerm(e.target.value)} />
          </div>
          {/* Tombol Login/Logout */}
          <button onClick={isLoggedIn ? handleLogout : handleLogin} className="bg-white text-black px-6 py-2 rounded-full font-bold text-sm hover:scale-105 transition">
            {isLoggedIn ? "Logout Admin" : "Admin Login"}
          </button>
        </header>

        <div className="p-8">
          <h2 className="text-3xl font-bold mb-8">Recently Played</h2>

          {/* FORM TAMBAH (Hanya Muncul Jika Login) */}
          {isLoggedIn && (
            <form onSubmit={handleSubmit} className="mb-10 bg-[#181818] p-6 rounded-xl flex gap-4 items-end animate-in fade-in transition-all">
              <div className="flex-1">
                <label className="block text-xs font-bold text-gray-400 mb-2 uppercase">Judul Lagu</label>
                <input className="w-full bg-[#2a2a2a] border-none outline-none p-2 rounded text-sm focus:ring-1 ring-white" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} required />
              </div>
              <div className="flex-1">
                <label className="block text-xs font-bold text-gray-400 mb-2 uppercase">Artis</label>
                <input className="w-full bg-[#2a2a2a] border-none outline-none p-2 rounded text-sm focus:ring-1 ring-white" value={formData.artist} onChange={e => setFormData({...formData, artist: e.target.value})} required />
              </div>
              <button type="submit" className="bg-[#1ed760] text-black px-6 py-2 rounded-full font-bold text-sm hover:scale-105 transition">
                {editingId ? "Update" : "Tambah"}
              </button>
            </form>
          )}

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {songs.filter(s => s.title.toLowerCase().includes(searchTerm.toLowerCase())).map((song) => (
              <div key={song.id} className="bg-[#181818] p-4 rounded-xl hover:bg-[#282828] transition-all group cursor-pointer shadow-lg relative">
                <div className="aspect-square bg-[#333] rounded-lg flex items-center justify-center text-5xl mb-4 group-hover:scale-105 transition-transform duration-500">💿</div>
                <h3 className="font-bold truncate">{song.title}</h3>
                <p className="text-gray-400 text-sm mt-1">{song.artist}</p>
                
                {/* Tombol Edit/Hapus (Hanya muncul jika Login) */}
                {isLoggedIn && (
                  <div className="flex gap-4 mt-4 opacity-0 group-hover:opacity-100 transition">
                    <button onClick={(e) => { e.stopPropagation(); setEditingId(song.id); setFormData({title: song.title, artist: song.artist}); }} className="text-xs text-gray-400 hover:text-white">Edit</button>
                    <button onClick={(e) => { e.stopPropagation(); handleDelete(song.id); }} className="text-xs text-red-500 hover:text-red-400">Hapus</button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
};

ReactDOM.createRoot(document.getElementById("root")).render(<App />);