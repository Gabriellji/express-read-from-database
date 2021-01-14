const connection = require("./config");
const express = require("express");
const movies = require("./movies");

const app = express();
const port = 3000;

connection.connect(function (err) {
  if (err) {
    console.error('error connecting: ' + err.stack);
    return;
  }

  console.log('connected as id ' + connection.threadId);
});

app.use(express.json())

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

app.post("/api/movies", (req, res) => {
  const { title, director, year, color, duration } = req.body;
  connection.query(
    "INSERT INTO movies(title, director, year, color, duration) VALUES(?, ?, ?, ?, ?)",
    [title, director, year, color, duration], 
    (err, results) => {
          if (err) {
            console.log(err);
            res.status(500).send("Error saving a movie");
          } else {
            res.status(200).send("Successfully saved");
          }
        }
    ); 
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

app.put("/api/movies/:id", (req, res) => {
  const movieId = req.params.id;
  const newMovie = req.body;
  connection.query(
    "UPDATE movies SET ? WHERE id = ?",
    [newMovie, movieId],
    (err, results) => {
      if (err) {
        console.log(err);
        res.status(500).send("Error updating a movie");
      } else {
        res.status(200).send("Movie updated successfully 🎉");
      }
    }
  )
});

app.delete("/api/movies/:id", (req, res) => {
  const movieId = req.params.id;
  connection.query(
    "DELETE FROM movies WHERE id=?",
    [movieId],
    (err) => {
      if (err) {
        console.log(err);
        res.status(500).send("😱 Error deleting an movie");
      } else {
        res.status(200).send("🎉 Movie deleted!");
      }
    }
  )
})

app.get("/api/search", (req, res) => {
  connection.query(
    "SELECT * from movies WHERE duration <=?",
    [req.query.maxDuration],
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

app.get("/api/users", (req, res) => {
  res.status(401).send("Unauthorized");
});

app.post("/api/users", (req, res) => {
  const { firstname, lastname, email } = req.body;
  connection.query(
    "INSERT INTO users(firstname, lastname, email) VALUES(?, ?, ?)",
    [firstname, lastname, email], 
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

app.put("/api/users/:id", (req, res) => {
  const idUser = req.params.id;
  const newUser = req.body;
  connection.query(
    "UPDATE users SET ? WHERE id = ?",
    [newUser, idUser],
    (err, results) => {
      if (err) {
        console.log(err);
        res.status(500).send("Error updating a user");
      } else {
        res.status(200).send("User updated successfully 🎉");
      }
    }
  );
});

app.delete("/api/users/:id", (req, res) => {
  const idUser = req.params.id; 
  connection.query(
    "DELETE FROM users WHERE id = ?",
    [idUser],
    (err) => {
      if (err) {
        console.log(err);
        res.status(500).send("😱 Error deleting an user");
      } else {
        res.status(200).send("🎉 User deleted!");
      }
  });
});

app.listen(port, () => {
  console.log(`Server is running on ${port}`);
});
