# Movie Manager API

A RESTful API for managing a movie collection.

**Live Demo:** https://movies-api-uc4p.onrender.com

## Tech Stack
* **Backend:** Node.js, Express
* **Storage:** In-memory array 
* **Deployment:** Render

## Setup Instructions
To run this project locally on your machine:
1. Clone the repository: `git clone [your-repo-link]`
2. Navigate to the project folder: `cd [your-folder-name]`
3. Install dependencies: `npm install`
4. Start the server: `node [your-main-file-name].js` 
5. The server will run on `http://localhost:3000`.

## API Documentation

### Get All Movies
* **Method:** `GET`
* **URL:** `/movies`
* **Response Format:**
  ```json
  [
    { "id": 1, "title": "Inception", "year": 2010 }
  ]
### Get a Specific Movie
* **Method**: GET  
* **URL**: /movies/:id  
* **Response Format**:  
```
//example
{id: 1234, title: Rush Hour, year: 2004}
```
* **Error Cases**: Returns 404 Not Found if the movie ID does not exist.  

### Add a New Movie
* **Method**: POST  
* **URL**: /movies  
* **Response Format**: Returns a success message.  
* **Error Cases**: Returns 400 Bad Request if the title or year is missing, or if the data types are invalid.

### Update a Movie
* **Method**: PUT 
* **URL**: /movies/:id  
* **Response Format**: Returns a success message.  
* **Error Cases**: Returns 400 Bad Request if data is missing/invalid, or 404 Not Found if the ID does not exist. 
## Delete a Movie
* **Method**: DELETE  
* **URL**: /movies/:id  
* **Response Format**: Returns a success message confirming deletion. 
* **Error Cases**: Returns 404 Not Found if the ID does not exist.  
## What I Learned
* I learned what middleware is how to use middleware chaining in between requests
* I learned how the frontend and backend interact with each other.  
* I learned how to deploy my API using on Render.