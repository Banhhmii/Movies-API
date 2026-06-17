# Movie Manager API

A RESTful API for managing a relational database of movies and their directors.

**Live Demo:** https://movies-api-uc4p.onrender.com

## Tech Stack
* **Backend:** Node.js, Express
* **Database:** PostgreSQL (hosted on Supabase)
* **Database Client:** `pg` (Node Postgres)
* **Deployment:** Render

## Setup Instructions

### Prerequisites
* Node.js (v18+)
* A PostgreSQL database (e.g. [Supabase](https://supabase.com) for a free hosted option)

### Steps

1. **Clone the repository**
   ```bash
   git clone https://github.com/Banhhmii/REST-API.git
   cd REST-API
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**

   Create a `.env` file in the root directory with the following variables:

   | Variable | Description |
   |---|---|
   | `PG_CONNECTION_STRING` | PostgreSQL connection string (e.g. `postgresql://user:password@host:port/dbname`) |
   | `SECRET_ACCESS_TOKEN` | Secret key used to sign and verify JWTs — use a long random string |

   Example `.env`:
   ```
   PG_CONNECTION_STRING=postgresql://postgres:[YOUR-PASSWORD]@[YOUR-HOST]:6543/postgres
   SECRET_ACCESS_TOKEN=your_super_secret_key_here
   ```

   > **Tip:** If using Supabase, find your connection string under **Project Settings → Database → Connection string** and select the **Transaction pooler** mode (port 6543) for compatibility.

4. **Run database migrations**
   ```bash
   npx knex migrate:latest
   ```

5. **Start the server**
   ```bash
   node server.js
   ```

   The server will run on `http://localhost:3000`.

6. **Run tests** *(optional)*
   ```bash
   npm test
   ```

## API Documentation

### 1. Add a New Director
* **Method:** `POST`
* **URL:** `/directors`
* **Request Body:**
  ```json
  {
    "name": "Christopher Nolan",
    "birthYear": 1970
  }
  ```
* **Response Format:** Returns a `201 Created` status, a success message, and the newly created director object.

### 2. Get All Movies
* **Method:** `GET`
* **URL:** `/movies`
* **Response Format:** Returns a JSON array of all movies from the PostgreSQL database.
  ```json
  [
    { 
      "id": 1, 
      "Title": "Inception", 
      "Year": 2010, 
      "Director_id": 1, 
      "Length(mins)": 148 
    }
  ]
  ```

### 3. Get a Specific Movie
* **Method:** `GET`
* **URL:** `/movies/:title`
* **Response Format:** Returns the specific movie object.
  ```json
  { 
    "id": 1, 
    "Title": "Inception", 
    "Year": 2010, 
    "Director_id": 1, 
    "Length(mins)": 148 
  }
  ```
* **Error Cases:** Returns `404 Not Found` if the movie title does not exist.

### 4. Add a New Movie
* **Method:** `POST`
* **URL:** `/movies`
* **Request Body:**
  ```json
  {
    "title": "Inception",
    "year": 2010,
    "director_id": 1,
    "length": 148
  }
  ```
* **Response Format:** Returns a `201 Created` status, a success message, and the new movie object.
* **Error Cases:** Returns `400 Bad Request` if the `title`, `year`, or `director_id` are missing, or if the data types are invalid.

### 5. Update a Movie
* **Method:** `PUT`
* **URL:** `/movies/:title`
* **Request Body:** *(Note: `title` must be included in the JSON body to pass the strict input validation middleware)*
  ```json
  {
    "title": "Inception",
    "year": 2014,
    "director_id": 1,
    "length": 169
  }
  ```
* **Response Format:** Returns a success message and the updated movie object.
* **Error Cases:** Returns `400 Bad Request` if data is missing/invalid, or `404 Not Found` if the title does not exist.

### 6. Delete a Movie
* **Method:** `DELETE`
* **URL:** `/movies/:title`
* **Response Format:** Returns a success message confirming deletion.
* **Error Cases:** Returns `404 Not Found` if the title does not exist.

## What I Learned
* I learned what middleware is and how to use middleware chaining in between requests.
* I learned how the frontend and backend interact with each other.
* I learned how to deploy my API using Render.
* I learned how to integrate a real PostgreSQL database, enforce relational schemas with Primary and Foreign Keys, and execute raw SQL queries using the `pg` client.
* I learned how to resolve modern network connectivity issues (IPv6) by utilizing a Supabase connection pooler.
