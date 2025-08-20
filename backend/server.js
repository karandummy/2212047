const express = require("express");
const cors = require("cors");
const fetch = require("node-fetch");
const app = express();
const PORT = 5000;

app.use(cors());

app.use(express.json());

function generateShortcode(length = 6) {
  const chars = "abcdefghijklmnopqrstuvwxyz0123456789";
  let code = "";
  for (let i = 0; i < length; i++) {
    code += chars[Math.floor(Math.random() * chars.length)];
  }
  return code;
}

app.post("/shorturls",(req, res) => {
  const { url, validity, shortcode } = req.body;

  if (!url || typeof url !== "string" || !/^https?:\/\/.+/.test(url)) {
    return res.status(400).json({ error: "Invalid or missing URL" });
  }


  const code = shortcode || generateShortcode();

  const minutes = typeof validity === "number" && validity > 0 ? validity : 30;
  const expiryDate = new Date(Date.now() + minutes * 60000).toISOString();

  const shortLink = `https://localhost:${PORT}/${code}`;

  res.status(201).json({
    shortLink,
    expiry: expiryDate
  });
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));