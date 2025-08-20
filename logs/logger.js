const express = require('express');
const app = express();

const LOG_API_URL = "http://20.244.56.144/evaluation-service/logs";

app.use(async (req, res, next) => {
  const logData = {
    stack: req.stack,
    level: req.stack,   
    package: req.package,
    message: req.message,
    timestamp: new Date().toISOString(),
  };
  const response=fetch(LOG_API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(logData)
  }).catch(err => {
    console.error("Failed to send log:", err);
  });
  const data=await response.json();
  console.log("Log sent successfully:", data);
  res.json(data);

  next();
});

app.listen(3000, () => {
  console.log('Server running on port 3000');
});