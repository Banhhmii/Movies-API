const { hashPassword, verifyPassword } = require("./passwordHashing");
const { movieValidation, registerAndLoginValidation  } = require("./middleware/inputValidation");
const { loggingMiddleware, errorHandlingMiddleware } = require("./middleware/appLevel");
const { generateToken, authenticateUser } = require("./middleware/authentication");
const dotenv = require("dotenv");
dotenv.config();
const { Pool } = require("pg");
const knex = require("knex");
const jwt = require("jsonwebtoken");
const express = require("express");


const knexInstance = knex({
  client: "pg",
  connection: process.env.PG_CONNECTION_STRING,
});

const app = express();
const port = 3000;
const pool = new Pool({
  connectionString: process.env.PG_CONNECTION_STRING,
});

app.use(express.json());

//Logging middleware to log incoming requests
app.use(loggingMiddleware);

//Error handling middleware to catch and log errors
app.use(errorHandlingMiddleware);


app.get("/", (req, res) => {
  const options = {
    root: __dirname + "/views",
    headers: {
      "Content-Type": "text/html",
    },
  };
  res.sendFile("./index.html", options, (err) => {
    if (err) {
      console.error("Error sending index.html:", err);
      res.status(500).send("Internal Server Error");
    }
  });
});

app.get("/index.html", (req, res) => {
  const options = {
    root: __dirname + "/views",
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
    root: __dirname + "/views",
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

app.get("/addMovie.html", (req, res) => {
  const options = {
    root: __dirname + "/views",
    headers: {
      "Content-Type": "text/html",
    },
  };
  res.sendFile("addMovie.html", options, (err) => {
    if (err) {
      console.error("Error sending addMovie.html:", err);
      res.status(500).send("Internal Server Error");
    }
  });
});

app.get("/getMovie.html", (req, res) => {
  const options = {
    root: __dirname  + "/views",
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
    root: __dirname + "/views",
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
    root: __dirname + "/views",
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
    root: __dirname + "/views",
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

app.get("/login.html", (req, res) => {
  const options = {
    root: __dirname + "/views",
    headers: {
      "Content-Type": "text/html",
    },
  };
  res.sendFile("login.html", options, (err) => {
    if (err) {
      console.error("Error sending login.html:", err);
      res.status(500).send("Internal Server Error");
    } 
    
  });
});

app.get("/movies", authenticateUser, (req, res) => {
  pool.query('SELECT * FROM "Movies" WHERE "user_id" = $1', [req.user.userId], (error, results) => {
    if (error) {
      console.error("Error fetching movies from database:", error);
      return res.status(500).json({ error: "Internal Server Error" });
    }
    res.json(results.rows);
  });
});

app.post("/movies", authenticateUser, movieValidation, (req, res) => {
  const movie = req.body;
  const { title, year, director_id, length } = movie;
  pool.query(
    'INSERT INTO "Movies" ("Title", "Year", "Director_id", "Length(mins)", "user_id") VALUES ($1, $2, $3, $4, $5) RETURNING *',
    [title, year, director_id, length, req.user.userId],
    (error, results) => {
      if (error) {
        console.error("Error inserting movie into database:", error);
        return res.status(500).json({ error: "Internal Server Error" });
      }
      res.status(201).json({
        message: "Movie added successfully!",
      });
    },
  );
});

app.get("/movies/:title", authenticateUser, (req, res) => {
  const title = req.params.title;
  pool.query(
    'SELECT * FROM "Movies" WHERE "Title" = $1 AND "user_id" = $2',
    [title, req.user.userId],
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

app.put("/movies/:title", authenticateUser, movieValidation, (req, res) => {
  const title = req.params.title;
  const movie = req.body;
  const { year, director_id, length } = movie;

  pool.query(
    'UPDATE "Movies" SET "Year" = $1, "Director_id" = $2, "Length(mins)" = $3 WHERE "Title" = $4 AND "user_id" = $5 RETURNING *',
    [year, director_id, length, title, req.user.userId],
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

app.delete("/movies/:title", authenticateUser, (req, res) => {
  const title = req.params.title;
  pool.query(
    'DELETE FROM "Movies" WHERE "Title" = $1 AND "user_id" = $2 RETURNING *',
    [title, req.user.userId],
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

app.post("/register", registerAndLoginValidation, (req, res) => {
  const { username, password } = req.body;
  hashPassword(password)
    .then((hashedPassword) => {
      // Store the username and hashed password in the database
      pool.query(
        'INSERT INTO  "Users" ("username", "password") VALUES ($1, $2) RETURNING id, username',
        [username, hashedPassword],
        (error, results) => {
          if (error) {
            console.error("Error registering user in database:", error);
            return res.status(500).json({ error: "Internal Server Error" });
          }
          res.status(201).json({
            message: "User registered successfully!",
            user: results.rows[0],
          });
        },
      );
    })
    .catch((error) => {
      console.error("Error hashing password:", error);
      res.status(500).json({ error: "Internal Server Error" });
    });
});

app.post("/login", registerAndLoginValidation, (req, res) => {
  const { username, password } = req.body;
  pool.query(
    'SELECT * FROM "Users" WHERE "username" = $1',
    [username],
    (error, results) => {
      if (error) {
        console.error("Error fetching user from database:", error);
        return res.status(500).json({ error: "Internal Server Error" });
      }
      if (results.rows.length === 0) {
        return res.status(401).json({ error: "Invalid username or password" });
      }
      const user = results.rows[0];
      verifyPassword(password, user.password)
        .then((isMatch) => {
          if (!isMatch) {
            return res
              .status(401)
              .json({ error: "Invalid username or password" });
          }
          // Generate JWT token
          const token = generateToken({ userId: user.id });
          res.json({
            message: "Login successful!",
            token: token,
          });
        })
        .catch((error) => {
          console.error("Error verifying password:", error);
          res.status(500).json({ error: "Internal Server Error" });
        });
    },
  );
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
