const { state, addSong } = require("../data");

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
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");
    res.statusCode = 200;
    return res.end();
  }

  if (req.method === "GET") {
    res.setHeader("Content-Type", "application/json");
    res.setHeader("Access-Control-Allow-Origin", "*");
    return res.end(JSON.stringify(state.songs));
  }

  if (req.method === "POST") {
    try {
      const body = await parseJSON(req);
      const newId = Date.now();
      const song = { id: newId, ...body };
      addSong(song);
      res.setHeader("Content-Type", "application/json");
      res.setHeader("Access-Control-Allow-Origin", "*");
      return res.end(JSON.stringify(song));
    } catch (err) {
      res.statusCode = 500;
      return res.end(JSON.stringify({ message: "Internal Server Error" }));
    }
  }

  res.statusCode = 405;
  res.end(JSON.stringify({ message: "Method Not Allowed" }));
};
