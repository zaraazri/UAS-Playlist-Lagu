const SECRET = process.env.SECRET || "uas-secret-key";

const state = {
  songs: [
    { id: 1, title: "Mencintaimu", artist: "Sal Priadi" },
    { id: 2, title: "Lihat Kebunku (Taman Bunga)", artist: "jeje" }
  ],
  playlists: [
    { id: 1, name: "Mencintaimu", category: "Playlists" },
    { id: 2, name: "Lihat Kebunku (taman bunga)", category: "Playlists" },
    { id: 3, name: "Sal Priadi", category: "Artists" },
    { id: 4, name: "Jeje", category: "Artists" },
    { id: 5, name: "Maudy Ayunda", category: "Podcasts" },
    { id: 6, name: "Raditya Dika", category: "Podcasts" }
  ]
};

function addSong(song) {
  state.songs.push(song);
  state.playlists.push({ id: song.id, name: song.title, category: "Playlists" });
  return song;
}

function updateSong(id, data) {
  const idx = state.songs.findIndex(s => s.id === id);
  if (idx === -1) return null;
  state.songs[idx] = { ...state.songs[idx], ...data };
  return state.songs[idx];
}

function deleteSong(id) {
  state.songs = state.songs.filter(s => s.id !== id);
  state.playlists = state.playlists.filter(p => p.id !== id || p.category !== "Playlists");
  return true;
}

function findSong(id) {
  return state.songs.find(s => s.id === id) || null;
}

module.exports = { SECRET, state, addSong, updateSong, deleteSong, findSong };
