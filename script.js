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

const movieForm = document.getElementById("movieForm");
const updateForm = document.getElementById("updateForm");

if (movieForm) {
    movieForm.addEventListener('submit', addMovie);
}

if (updateForm) {
    updateForm.addEventListener('submit', updateMovie);
}