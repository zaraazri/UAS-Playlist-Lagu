const serverless = require("serverless-http");
const app = require("../backend/index.js");

// Export handler untuk Vercel Serverless Functions
module.exports = serverless(app);
