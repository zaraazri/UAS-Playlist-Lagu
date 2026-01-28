const { updateSong, deleteSong, findSong } = require("../data");

const parseJSON = (req) => new Promise((resolve, reject) => {
  let body = "";
  req.on("data", chunk => body += chunk);
  req.on("end", () => {
    if (!body) return resolve({});
    try { resolve(JSON.parse(body)); } catch (e) { reject(e); }
  });
  req.on("error", reject);
});

module.exports = async (req, res) => {
  // CORS preflight
  if (req.method === "OPTIONS") {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "PUT, DELETE, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");
    res.statusCode = 200;
    return res.end();
  }
  // Vercel provides query on req (dynamic route)
  const id = req.query && req.query.id ? parseInt(req.query.id) : (() => {
    const parts = req.url.split('/');
    return parseInt(parts[parts.length - 1]);
  })();

  if (isNaN(id)) {
    res.statusCode = 400;
    return res.end(JSON.stringify({ message: "Invalid id" }));
  }

  if (req.method === "PUT") {
    try {
      const body = await parseJSON(req);
      const updated = updateSong(id, body);
      if (!updated) {
        res.statusCode = 404;
        return res.end(JSON.stringify({ message: "Lagu tidak ditemukan" }));
      }
      res.setHeader("Content-Type", "application/json");
      res.setHeader("Access-Control-Allow-Origin", "*");
      return res.end(JSON.stringify(updated));
    } catch (err) {
      res.statusCode = 500;
      return res.end(JSON.stringify({ message: "Internal Server Error" }));
    }
  }

  if (req.method === "DELETE") {
    deleteSong(id);
    res.setHeader("Content-Type", "application/json");
    res.setHeader("Access-Control-Allow-Origin", "*");
    return res.end(JSON.stringify({ message: "Lagu berhasil dihapus" }));
  }

  res.statusCode = 405;
  res.end(JSON.stringify({ message: "Method Not Allowed" }));
};
