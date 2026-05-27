const displayMovies = async () => {
    const moviesList = document.getElementById("moviesList");
    try {
        const response = await fetch('/movies');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const movies = await response.json();
        moviesList.innerHTML = movies.map(movie => `<p>ID: ${movie.id},  Title: ${movie.title} (${movie.year})</p>`).join('');
    } catch (error) {
        console.error('Error fetching movies:', error);
    }
};

const addMovie = async (event) => {
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
};

const getMovie = async (event) => {
    event.preventDefault();
    const movieId = document.getElementById("movieId").value;
    const movieDetails = document.getElementById("movieDetails");
    try{
        const response = await fetch(`/movies/${movieId}`);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        let resultString = `<p>Title: ${data.title}</p><p>Year: ${data.year}</p>`;
        movieDetails.innerHTML = resultString;
    } catch (error) {
        console.error('Error fetching movie:', error);
    }
};

const updateMovie = async (event) => {
    event.preventDefault();

    const movieId = Number(document.getElementById("movieId").value);
    const movieTitle = document.getElementById("updateTitle").value;
    const movieYear = Number(document.getElementById("updateYear").value);

    if(movieTitle && movieYear && movieId) {
        try{
            const updateResponse = await fetch(`/movies/${movieId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({id: movieId, title: movieTitle, year: movieYear})
            });
            if (!updateResponse.ok) {
                throw new Error(`HTTP error! status: ${updateResponse.status}`);
            }
            const updateData = await updateResponse.json();
            console.log("Movie updated successfully:");
        } catch (error) {
            console.error('Error updating movie:', error);
        }
    }

};

const deleteMovie = async (event) => {
    event.preventDefault();
    console.log("Delete movie function called");
    const movieId = Number(document.getElementById("deleteMovieId").value);
    if(movieId) {
        try {
            const deleteResponse = await fetch(`/movies/${movieId}`, {
                method: 'DELETE'
            });
            if (!deleteResponse.ok) {
                throw new Error(`HTTP error! status: ${deleteResponse.status}`);
            }
            const deleteData = await deleteResponse.json();
            console.log("Movie deleted successfully:");
        } catch (error) {
            console.error('Error deleting movie:', error);
        }
    }
};

const addDirector = async (event) => {
    event.preventDefault();
    const directorName = document.getElementById("name").value;
    const directorBirthYear = Number(document.getElementById("birthYear").value);
    try {
        const response = await fetch('/directors', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({name: directorName, birthYear: directorBirthYear})
        });
    } catch (error) {
        console.error('Error adding director:', error);
    }
};

const movieForm = document.getElementById("movieForm");
const updateForm = document.getElementById("updateForm");
const deleteForm = document.getElementById("deleteForm");
const getForm = document.getElementById("getForm");
const moviesList = document.getElementById("moviesList");
const directorForm = document.getElementById("directorForm");

if(moviesList) {
    displayMovies();
}

if (getForm) {
    getForm.addEventListener('submit', getMovie);
}

if (movieForm) {
    movieForm.addEventListener('submit', addMovie);
}

if (updateForm) {
    updateForm.addEventListener('submit', updateMovie);
}

if (deleteForm) {
    deleteForm.addEventListener('submit', deleteMovie);
}

if (directorForm) {
    directorForm.addEventListener('submit', addDirector);
}