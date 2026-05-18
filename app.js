const express = require('express');

const app = express();
const port = 3000;

const movies = [];

app.use(express.json());

app.get('/', (req, res) => {
    const options = {
        root: __dirname,
        headers: {
            'Content-Type': 'text/html'
        }
    };
    res.sendFile('index.html', options, (err) => {
        if (err) {
            console.error("Error sending index.html:", err);
            res.status(500).send("Internal Server Error");
        }
    });
})

app.get('/script.js', (req, res) => {
    const options = {
        root: __dirname,
        headers: {
            'Content-Type': 'application/javascript'
        }
    };
    res.sendFile('script.js', options, (err) => {
        if (err) {
            console.error("Error sending script.js:", err);
            res.status(500).send("Internal Server Error");
        }
    });
});

app.get('/updateMovie.html', (req, res) => {
    const options = {
        root: __dirname,
        headers: {
            'Content-Type': 'text/html'
        }
    };
    res.sendFile('updateMovie.html', options, (err) => {
        if (err) {
            console.error("Error sending updateMovie.html:", err);
            res.status(500).send("Internal Server Error");
        }
    });
});

app.get ('/movies', (req, res) => {
    res.json(movies);
});

app.post('/movies', (req, res) => {
    const movie = req.body;
    const id = Math.floor(Math.random() * 1000);
    const {title, year} = movie;
    if (!title || !year) {
        return res.status(400).json({ error: "Title and year are required" });
    }
    movies.push({id, ...movie});
    res.json({ message: "Movie added successfully!", movie });
});

app.get('/movies/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const movie = movies.find((movie) => movie.id === id);
    if (!movie) {
        return res.status(404).json({ error: "Movie not found" });
    }
    res.json(movie);
});

app.put('/movies/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const movie = req.body;
    const {title, year} = movie;
    if (!title || !year) {
        return res.status(400).json({ error: "Title and year are required" });
    }
    const movieIndex = movies.findIndex((movie) => movie.id === id);
    if (movieIndex === -1) {
        return res.status(404).json({ error: "Movie not found" });
    }
    const updatedMovie = { id, title, year };
    movies[movieIndex] = updatedMovie;
    res.json({ message: "Movie updated successfully!", movie: updatedMovie });
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
})