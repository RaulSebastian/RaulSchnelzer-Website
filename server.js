const express = require("express");
const path = require('path');
const fs = require('fs');

var app = express();
const port = process.env.NODE_PORT | 80;
const root = path.join(__dirname, "dist", "raulschnelzer");

app.use(express.static("raulschnelzer"));

app.get("/", function(req, res, next) {
  fs.stat(root + req.path, function(err) {
    if (err) {
      res.sendFile("index.html", { root });
    } else {
      res.sendFile(req.path, { root });
    }
  });
});

app.listen(port, "localhost");
console.log(`Listening on port ${port}`);
