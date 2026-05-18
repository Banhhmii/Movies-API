const addMovie = async () => {
    event.preventDefault();
    const movieTitle = document.getElementById("title").value;
    const movieYear = Number(document.getElementById("year").value);
    const {title, year} = {title: movieTitle, year: movieYear};
    try {
        const response = await fetch('/movies', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({title, year})
        });
    } catch (error) {
        console.error('Error adding movie:', error);
    }
}

document.getElementById("movieForm").addEventListener("submit", addMovie);