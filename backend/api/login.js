const jwt = require("jsonwebtoken");
const { SECRET } = require("./data");

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
    res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");
    res.statusCode = 200;
    return res.end();
  }

  if (req.method !== "POST") {
    res.statusCode = 405;
    return res.end(JSON.stringify({ message: "Method Not Allowed" }));
  }

  try {
    const body = await parseJSON(req);
    const { username } = body;
    const token = jwt.sign({ username }, SECRET, { expiresIn: "1h" });
    res.setHeader("Content-Type", "application/json");
    res.setHeader("Access-Control-Allow-Origin", "*");
    return res.end(JSON.stringify({ token }));
  } catch (err) {
    res.statusCode = 500;
    res.end(JSON.stringify({ message: "Internal Server Error" }));
  }
};
