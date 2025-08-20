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


const urlStore = {};
const clickStats = {};
app.post("/shorturls", (req, res) => {
  const { url, validity, shortcode } = req.body;

  if (!url || typeof url !== "string" || !/^https?:\/\/.+/.test(url)) {
    return res.status(400).json({ error: "Invalid or missing URL" });
  }

  const code = shortcode || generateShortcode();
  const minutes = typeof validity === "number" && validity > 0 ? validity : 30;
  const expiryDate = new Date(Date.now() + minutes * 60000).toISOString();
  const shortLink = `http://localhost:${PORT}/${code}`;


  urlStore[code] = {
    url,
    createdAt: new Date().toISOString(),
    expiry: expiryDate,
    shortLink,
    clicks: 0,
    clickDetails: []
  };
   console.log("URL Store initialized:", urlStore);

  res.status(201).json({
    shortLink,
    expiry: expiryDate
  });
});



app.get("/shorturls/:shortcode", (req, res) => {
  const { shortcode } = req.params;
  const info = urlStore[shortcode];
  console.log(info);
  console.log("URL Store initialized:", urlStore);
  if (!info) {
    return res.status(404).json({ error: "Shortcode not found" });
  }

  res.json({
    totalClicks: info.clicks,
    url: info.url,
    createdAt: info.createdAt,
    expiry: info.expiry,
    clickDetails: info.clickDetails 
  });
});

app.get("/:shortcode", (req, res) => {
  const { shortcode } = req.params;
  const info = urlStore[shortcode];
  if (!info) return res.status(404).send("Not found");

  info.clicks += 1;
  info.clickDetails.push({
    timestamp: new Date().toISOString(),
  });

  res.redirect(info.url);
});




app.listen(PORT, () => console.log(`Server running on port ${PORT}`));