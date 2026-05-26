const dotenv = require("dotenv");
dotenv.config();

const { Pool, Client } = require("pg");
const express = require("express");

const app = express();
const port = 3000;
const pool = new Pool({
  connectionString: process.env.PG_CONNECTION_STRING,
});

app.use(express.json());

//Logging middleware to log incoming requests
app.use((req, res, next) => {
  console.log(`Request received: ${req.method},  ${req.url}`);
  next();
});

//Error handling middleware to catch and log errors
app.use((err, req, res, next) => {
  console.error("An error occurred:", err);
  res.status(500).json({ error: "Internal Server Error" });
});

//Input validation middleware to ensure required fields are present and of correct type
const inputValidationMiddleware = (req, res, next) => {
  const { title, year } = req.body;
  if (!title || !year) {
    return res.status(400).json({ error: "Title and year are required" });
  }
  if (typeof title !== "string" || typeof year !== "number") {
    return res
      .status(400)
      .json({ error: "Invalid data types for title or year" });
  }
  next();
};

app.get("/", (req, res) => {
  const options = {
    root: __dirname,
    headers: {
      "Content-Type": "text/html",
    },
  };
  res.sendFile("index.html", options, (err) => {
    if (err) {
      console.error("Error sending index.html:", err);
      res.status(500).send("Internal Server Error");
    }
  });
});

app.get("/script.js", (req, res) => {
  const options = {
    root: __dirname,
    headers: {
      "Content-Type": "application/javascript",
    },
  };
  res.sendFile("script.js", options, (err) => {
    if (err) {
      console.error("Error sending script.js:", err);
      res.status(500).send("Internal Server Error");
    }
  });
});

app.get("/styles.css", (req, res) => {
  const options = {
    root: __dirname,
    headers: {
      "Content-Type": "text/css",
    },
  };
  res.sendFile("styles.css", options, (err) => {
    if (err) {
      console.error("Error sending style.css:", err);
      res.status(500).send("Internal Server Error");
    }
  });
});

app.get("/allMovies.html", (req, res) => {
  const options = {
    root: __dirname,
    headers: {
      "Content-Type": "text/html",
    },
  };
  res.sendFile("allMovies.html", options, (err) => {
    if (err) {
      console.error("Error sending allMovies.html:", err);
      res.status(500).send("Internal Server Error");
    }
  });
});

app.get("/getMovie.html", (req, res) => {
  const options = {
    root: __dirname,
    headers: {
      "Content-Type": "text/html",
    },
  };
  res.sendFile("getMovie.html", options, (err) => {
    if (err) {
      console.error("Error sending getMovie.html:", err);
      res.status(500).send("Internal Server Error");
    }
  });
});

app.get("/updateMovie.html", (req, res) => {
  const options = {
    root: __dirname,
    headers: {
      "Content-Type": "text/html",
    },
  };
  res.sendFile("updateMovie.html", options, (err) => {
    if (err) {
      console.error("Error sending updateMovie.html:", err);
      res.status(500).send("Internal Server Error");
    }
  });
});

app.get("/deleteMovie.html", (req, res) => {
  const options = {
    root: __dirname,
    headers: {
      "Content-Type": "text/html",
    },
  };
  res.sendFile("deleteMovie.html", options, (err) => {
    if (err) {
      console.error("Error sending deleteMovie.html:", err);
      res.status(500).send("Internal Server Error");
    }
  });
});

app.get("/movies", (req, res) => {
  pool.query('SELECT * FROM "Movies"', (error, results) => {
    if (error) {
      console.error("Error fetching movies from database:", error);
      return res.status(500).json({ error: "Internal Server Error" });
    }
    res.json(results.rows);
  });
  //res.json(movies);
});

app.post("/movies", inputValidationMiddleware, (req, res) => {
  const movie = req.body;
  const id = Math.floor(Math.random() * 1000);
  const { title, year } = movie;

  movies.push({ id, ...movie });
  res.json({ message: "Movie added successfully!", movie });
});

app.get("/movies/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const movie = movies.find((movie) => movie.id === id);
  if (!movie) {
    return res.status(404).json({ error: "Movie not found" });
  }
  res.json(movie);
});

app.put("/movies/:id", inputValidationMiddleware, (req, res) => {
  const id = parseInt(req.params.id);
  const movie = req.body;
  const { title, year } = movie;

  const movieIndex = movies.findIndex((movie) => movie.id === id);
  if (movieIndex === -1) {
    return res.status(404).json({ error: "Movie not found" });
  }
  const updatedMovie = { id, title, year };
  movies[movieIndex] = updatedMovie;
  res.json({ message: "Movie updated successfully!", movie: updatedMovie });
});

app.delete("/movies/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const movieIndex = movies.findIndex((movie) => movie.id === id);
  if (movieIndex === -1) {
    return res.status(404).json({ error: "Movie not found" });
  }
  movies.splice(movieIndex, 1);
  res.json({ message: "Movie deleted successfully!" });
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
