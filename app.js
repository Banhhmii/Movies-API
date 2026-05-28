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
  const { title, year, director_id } = req.body;
  if (!title || !year || !director_id) {
    return res
      .status(400)
      .json({ error: "Title, year, and director_id are required" });
  }
  if (
    typeof title !== "string" ||
    typeof year !== "number" ||
    typeof director_id !== "number"
  ) {
    return res
      .status(400)
      .json({ error: "Invalid data types for title, year, or director_id" });
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

app.get("/addDirector.html", (req, res) => {
  const options = {
    root: __dirname,
    headers: {
      "Content-Type": "text/html",
    },
  };
  res.sendFile("addDirector.html", options, (err) => {
    if (err) {
      console.error("Error sending addDirector.html:", err);
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
  const { title, year, director_id, length } = movie;
  pool.query(
    'INSERT INTO "Movies" ("Title", "Year", "Director_id", "Length(mins)") VALUES ($1, $2, $3, $4) RETURNING *',
    [title, year, director_id, length],
    (error, results) => {
      if (error) {
        console.error("Error inserting movie into database:", error);
        return res.status(500).json({ error: "Internal Server Error" });
      }
      res.status(201).json({
        message: "Movie added successfully!",
        movie: results.rows[0],
      });
    },
  );
});

app.get("/movies/:title", (req, res) => {
  const title = req.params.title;
  pool.query(
    'SELECT * FROM "Movies" WHERE "Title" = $1',
    [title],
    (error, results) => {
      if (error) {
        console.error("Error fetching movie from database:", error);
        return res.status(500).json({ error: "Internal Server Error" });
      }
      if (results.rows.length === 0) {
        return res.status(404).json({ error: "Movie not found" });
      }
      res.json(results.rows[0]);
    },
  );
});

app.put("/movies/:title", inputValidationMiddleware, (req, res) => {
  const title = req.params.title;
  const movie = req.body;
  const { year, director_id, length } = movie;

  pool.query(
    'UPDATE "Movies" SET "Year" = $1, "Director_id" = $2, "Length(mins)" = $3 WHERE "Title" = $4 RETURNING *',
    [year, director_id, length, title],
    (error, results) => {
      if (error) {
        console.error("Error updating movie in database:", error);
        return res.status(500).json({ error: "Internal Server Error" });
      }
      if (results.rows.length === 0) {
        return res.status(404).json({ error: "Movie not found" });
      }
      res.json({
        message: "Movie updated successfully!",
        movie: results.rows[0],
      });
    },
  );
});

app.delete("/movies/:title", (req, res) => {
  const title = req.params.title;
  pool.query(
    'DELETE FROM "Movies" WHERE "Title" = $1 RETURNING *',
    [title],
    (error, results) => {
      if (error) {
        console.error("Error deleting movie from database:", error);
        return res.status(500).json({ error: "Internal Server Error" });
      }
      if (results.rows.length === 0) {
        return res.status(404).json({ error: "Movie not found" });
      }
      res.json({
        message: "Movie deleted successfully!",
        movie: results.rows[0],
      });
    },
  );
  // const id = parseInt(req.params.id);
  // const movieIndex = movies.findIndex((movie) => movie.id === id);
  // if (movieIndex === -1) {
  //   return res.status(404).json({ error: "Movie not found" });
  // }
  // movies.splice(movieIndex, 1);
  // res.json({ message: "Movie deleted successfully!" });
});

app.post("/directors", (req, res) => {
  const director = req.body;
  const { name, birthYear } = director;
  pool.query(
    'INSERT INTO "Directors" ("Name", "Birth_year") VALUES ($1, $2) RETURNING *',
    [name, birthYear],
    (error, results) => {
      if (error) {
        console.error("Error inserting director into database:", error);
        return res.status(500).json({ error: "Internal Server Error" });
      }
      res.status(201).json({
        message: "Director added successfully!",
        director: results.rows[0],
      });
    },
  );
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
