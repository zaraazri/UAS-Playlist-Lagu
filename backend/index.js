require("dotenv").config();
const express = require("express");
const jwt = require("jsonwebtoken");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

const SECRET = process.env.SECRET || "uas-secret-key";

// Data lagu awal
let songs = [
  { id: 1, title: "Mencintaimu", artist: "Sal Priadi" },
  { id: 2, title: "Lihat Kebunku (Taman Bunga)", artist: "jeje" }
];
let playlists = [
  { id: 1, name: "Mencintaimu", category: "Playlists" },
  { id: 2, name: "Lihat Kebunku (taman bunga)", category: "Playlists" },
  { id: 3, name: "Sal Priadi", category: "Artists" },
  { id: 4, name: "Jeje", category: "Artists" },
  { id: 5, name: "Maudy Ayunda", category: "Podcasts" },
  { id: 6, name: "Raditya Dika", category: "Podcasts" }
];
// Endpoint Login
app.post("/api/login", (req, res) => {
  const { username } = req.body;
  const token = jwt.sign({ username }, SECRET, { expiresIn: "1h" });
  res.json({ token });
});

// Endpoint GET - Mengambil semua lagu
app.get("/api/songs", (req, res) => {
  res.json(songs);
});

// Tambah Lagu + Otomatis masuk Playlist
app.post("/api/songs", (req, res) => {
  const newId = Date.now();
  const song = { id: newId, ...req.body };
  songs.push(song);
  // Otomatis masukkan ke daftar playlist sidebar
  playlists.push({ 
    id: newId, 
    name: req.body.title, 
    category: "Playlists" 
  });
  res.json(song);
});

// FITUR EDIT (PUT)
app.put("/api/songs/:id", (req, res) => {
  const { id } = req.params;
  const index = songs.findIndex(s => s.id === parseInt(id));
  if (index !== -1) {
    songs[index] = { ...songs[index], ...req.body };
    res.json(songs[index]);
  } else {
    res.status(404).json({ message: "Lagu tidak ditemukan" });
  }
});

// FITUR HAPUS (DELETE)
app.delete("/api/songs/:id", (req, res) => {
  const { id } = req.params;
  songs = songs.filter(s => s.id !== parseInt(id));
  res.json({ message: "Lagu berhasil dihapus" });
});

// Endpoint untuk mengambil semua playlist
app.get("/api/playlists", (req, res) => {
  res.json(playlists);
});

// Hanya listen jika dijalankan secara lokal (bukan serverless)
if (require.main === module) {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`Backend running on port ${PORT}`);
  });
}

// Export app untuk serverless
module.exports = app;