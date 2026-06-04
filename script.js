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
    const directorId = Number(document.getElementById("director_id").value);
    const movieLength = Number(document.getElementById("length").value);
    const {title, year, director_id, length} = {title: movieTitle, year: movieYear, director_id: directorId, length: movieLength};
    try {
        const response = await fetch('/movies', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({title, year, director_id, length  })
        });
    } catch (error) {
        console.error('Error adding movie:', error);
    }
};

const getMovie = async (event) => {
    event.preventDefault();
    const movieTitle = document.getElementById("movieTitle").value;
    const movieDetails = document.getElementById("movieDetails");
    try{
        const response = await fetch(`/movies/${movieTitle}`);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        let resultString = `<p>Title: ${data.Title}</p><p>Year: ${data.Year}</p><p>Director ID: ${data.Director_id}</p><p>Length: ${data["Length(mins)"]} mins</p>`;
        movieDetails.innerHTML = resultString;
    } catch (error) {
        console.error('Error fetching movie:', error);
    }
};

const updateMovie = async (event) => {
    event.preventDefault();
    const movieTitle = document.getElementById("movieTitle").value;
    const movieYear = Number(document.getElementById("updateYear").value);
    const directorId = Number(document.getElementById("updateDirectorId").value);
    const movieLength = Number(document.getElementById("updateLength").value);

    if(movieTitle && movieYear && directorId && movieLength) {
        try{
            const updateResponse = await fetch(`/movies/${movieTitle}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({title: movieTitle, year: movieYear, director_id: directorId, length: movieLength})
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
    const movieTitle = document.getElementById("deleteMovieTitle").value;
    if(movieTitle) {
        try {
            const deleteResponse = await fetch(`/movies/${movieTitle}`, {
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

const registerUser = async (event) => {
    event.preventDefault();
    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;

    try{
        const response = await fetch('/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({username: username, password: password})
        });
        if(response.ok) {
            window.location.href = '/login.html';
        }
    } catch (error) {
        console.error('Error registering user:', error);
    }
}

const loginUser = async (event) => {
    event.preventDefault();
    const loginUsername = document.getElementById("username").value;
    const loginPassword = document.getElementById("password").value;

    try{
        const response = await fetch('/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({username: loginUsername, password: loginPassword})
        });
        console.log("Login response:", response);
        if(response.ok) {
            window.location.href = '/addMovie.html';
        }
    } catch (error) {
        console.error('Error logging in user:', error);
    }
};

const movieForm = document.getElementById("movieForm");
const updateForm = document.getElementById("updateForm");
const deleteForm = document.getElementById("deleteForm");
const getForm = document.getElementById("getForm");
const moviesList = document.getElementById("moviesList");
const directorForm = document.getElementById("directorForm");
const registerForm = document.getElementById("registerForm");
const loginForm = document.getElementById("loginForm");

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

if (document.getElementById("registerForm")) {
    registerForm.addEventListener('submit', registerUser);
}

if (loginForm) {
    console.log("Login form found, adding event listener");
    loginForm.addEventListener('submit', loginUser);
}