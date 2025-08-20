const express = require("express");
const cors = require("cors");
const fetch = require("node-fetch");
const app = express();
const PORT = 5000;

app.use(cors());
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));