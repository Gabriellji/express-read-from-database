const connection = require("./config");
const express = require("express");
const movies = require("./movies");

const app = express();
const port = 3000;

connection.connect(function(err) {
  if (err) {
    console.error('error connecting: ' + err.stack);
    return;
  }

  console.log('connected as id ' + connection.threadId);
});

app.get("/", (request, response) => {
  response.send("Welcome to my favourite movie list");
});

app.get("/api/movies", (req, res) => {
  connection.query("SELECT * from movies", (err, results) => {
    if (err) {
      res.status(500).send("Error retrieving data");
    } else {
      res.status(200).json(results);
    }
  });
});

app.get("/api/movies/:id", (req, res) => {
  connection.query(
    "SELECT * from movies WHERE id=?",
    [req.params.id],
    (err, results) => {
      if (err) {  
        console.log(err);
        res.status(500).send("Error retrieving data");
      } else {
        res.status(200).json(results);
      }
    }
  );
});

app.get("/api/search", (req, res) => {
  const duration = movies.find(
    (elem) => elem.duration <= Number(req.query.maxDuration)
  );
  if (!duration) {
    res.status(404).send("No movies found for this duration");
  }
  res.status(200).json(duration);
});

app.get("/api/users", (req, res) => {
  res.status(401).send("Unauthorized");
});

app.listen(port, () => {
  console.log(`Server is running on ${port}`);
});
