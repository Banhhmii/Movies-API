const request = require("supertest");
const { app } = require("./app");
const { Pool } = require("pg");
const { generateToken } = require("./middleware/authentication");

describe("POST /register Input Validation", () => {
  it("should return 400 when username is missing", async () => {
    const response = await request(app)
      .post("/register")
      .send({ password: "testpassword" });
    expect(response.status).toBe(400);
    expect(response.body).toEqual({
      error: "Validation error",
      message: "Username is required",
      success: false,
    });
  });
  it("should return 400 when password is missing", async () => {
    const response = await request(app)
      .post("/register")
      .send({ username: "testuser" });
    expect(response.status).toBe(400);
    expect(response.body).toEqual({
      error: "Validation error",
      message: "Password is required",
      success: false,
    });
  });
});

describe("POST /login Authentication", () => {
  it("should return 401 when password is incorrect", async () => {
    const response = await request(app)
      .post("/login")
      .send({ username: "tommy156", password: "wrongpassword" });
    expect(response.status).toBe(401);
    expect(response.body).toEqual({
      error: { error: "Invalid username or password", success: false },
    });
  });

  it("should return 200 and a token when credentials are correct", async () => {
    const response = await request(app)
      .post("/login")
      .send({ username: "testuser", password: "testuserpassword" });
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("token");
    expect(response.body.token).toBeTruthy();
  });
});

describe("GET /movies Authentication", () => {
  it("should return 401 when no token is provided", async () => {
    const response = await request(app).get("/movies");
    expect(response.status).toBe(401);
    expect(response.body).toEqual({
      success: false,
      error: "Access token missing",
    });
  });

  it("should return 403 when an expired token is provided", async () => {
    const response = await request(app)
      .get("/movies")
      .set("Authorization", "Bearer invalidtoken");
    expect(response.status).toBe(403);
    expect(response.body).toEqual({
      success: false,
      error: "Invalid access token",
      code: "INVALID_TOKEN",
    });
  });

  it("should return 200 and a success message when a valid token is provided", async () => {
    // Generate a valid token for testing
    const token = generateToken({ userId: 13, username: "testuser" });
    const response = await request(app)
      .get("/movies")
      .set("Authorization", `Bearer ${token}`);
    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      success: true,
      message: "Movies retrieved successfully",
    });
  });
});

describe("POST /movies Authentication", () => {
  it("should return 401 when no token is provided", async () => {
    const response = await request(app)
      .post("/movies")
      .send({ title: "Test Movie", year: 2020, length: 120, director_id: 1 });
    expect(response.status).toBe(401);
    expect(response.body).toEqual({
      success: false,
      error: "Access token missing",
    });
  });

it("should return 403 when an invalid token is provided", async () => {
    const response = await request(app)
      .post("/movies")
      .set("Authorization", "Bearer invalidtoken")
      .send({ title: "Test Movie", year: 2020, length: 120, director_id: 1 });
    expect(response.status).toBe(403);
    expect(response.body).toEqual({
      success: false,
      error: "Invalid access token",
      code: "INVALID_TOKEN",
    });
  });

  it("should return 201 and a success message when a valid token is provided", async () => {
    // Generate a valid token for testing
    const token = generateToken({ userId: 13, username: "testuser" });
    const response = await request(app)
      .post("/movies")
      .set("Authorization", `Bearer ${token}`)
      .send({ title: "Test Movie", year: 2020, length: 120, director_id: 1 });
    expect(response.status).toBe(201);
    expect(response.body).toEqual({
        success: true,
        message: "Movie added successfully!",
    });
  });

 it("should return 409 when a movie with the same title already exists", async () => {
    // Generate a valid token for testing
    const token = generateToken({ userId: 13, username: "testuser" });
    // First, add a movie to create a duplicate scenario
    await request(app)
      .post("/movies")
      .set("Authorization", `Bearer ${token}`)
      .send({ title: "Duplicate Movie", year: 2020, length: 120, director_id: 1 });

    // Attempt to add the same movie again
    const response = await request(app)
      .post("/movies")
      .set("Authorization", `Bearer ${token}`)
      .send({ title: "Test Movie", year: 2020, length: 120, director_id: 1 });

    expect(response.status).toBe(409);
    expect(response.body).toEqual({
        error: "Conflict",
        message: `A movie with the title "Test Movie" already exists`,
    });
  });   

});

describe("GET /movies/:title Authentication", () => {
    it("should return 401 when no token is provided", async () => {
        const response = await request(app).get("/movies/Test Movie");
        expect(response.status).toBe(401);
        expect(response.body).toEqual({
            success: false,
            error: "Access token missing",
        });
    });

    it("should return 403 when an invalid token is provided", async () => {
        const response = await request(app)
            .get("/movies/Test Movie")
            .set("Authorization", "Bearer invalidtoken");
        expect(response.status).toBe(403);
        expect(response.body).toEqual({
            success: false,
            error: "Invalid access token",
            code: "INVALID_TOKEN",
        });
    });

    it("should return 200 and a success message when a valid token is provided", async () => {
        // Generate a valid token for testing
        const token = generateToken({ userId: 13, username: "testuser" });
        const response = await request(app)
            .get("/movies/Test Movie")
            .set("Authorization", `Bearer ${token}`);
        expect(response.status).toBe(200);
        expect(response.body).toEqual({
            success: true,
            message: "Movie retrieved successfully",
            data: {
                Director_id: "1",
                "Length(mins)": "120",
                Title: "Test Movie",
                Year: "2020",
                id: expect.any(String),
                user_id: 13,
            }
        });
    });
});

describe("PUT /movies/:title Authentication", () => {
    it("should return 401 when no token is provided", async () => {
        const response = await request(app)
            .put("/movies/Test Movie")
            .send({ title: "Updated Movie", year: 2021, length: 130, director_id: 2 });
        expect(response.status).toBe(401);
        expect(response.body).toEqual({
            success: false,
            error: "Access token missing",
        });
    });

    it("should return 403 when an invalid token is provided", async () => {
        const response = await request(app)
            .put("/movies/Test Movie")
            .set("Authorization", "Bearer invalidtoken")
            .send({ title: "Updated Movie", year: 2021, length: 130, director_id: 2 });
        expect(response.status).toBe(403);
        expect(response.body).toEqual({
            success: false,
            error: "Invalid access token",
            code: "INVALID_TOKEN",
        });
    });

    it("should return 200 and a success message when a valid token is provided", async () => {
        // Generate a valid token for testing
        const token = generateToken({ userId: 13, username: "testuser" });
        const response = await request(app)
            .put("/movies/Test Movie")
            .set("Authorization", `Bearer ${token}`)
            .send({title: "Test Movie" ,year: 2021, length: 130, director_id: 1 });
        expect(response.status).toBe(200);
        expect(response.body).toEqual({
            success: true,
            message: "Movie updated successfully",
            data: {
                Director_id: "1",
                "Length(mins)": "130",
                Title: "Test Movie",
                Year: "2021",
                id: expect.any(String),
                user_id: 13,
            }
        });
    });
});

describe("DELETE /movies/:title Authentication", () => {
    it("should return 401 when no token is provided", async () => {
        const response = await request(app).delete("/movies/Test Movie");
        expect(response.status).toBe(401);
        expect(response.body).toEqual({
            success: false,
            error: "Access token missing",
        });
    });

    it("should return 403 when an invalid token is provided", async () => {
        const response = await request(app)
            .delete("/movies/Test Movie")
            .set("Authorization", "Bearer invalidtoken");
        expect(response.status).toBe(403);
        expect(response.body).toEqual({
            success: false,
            error: "Invalid access token",
            code: "INVALID_TOKEN",
        });
    });

    it("should return 200 and a success message when a valid token is provided", async () => {
        // Generate a valid token for testing
        const token = generateToken({ userId: 13, username: "testuser" });
        const response = await request(app)
            .delete("/movies/Test Movie")
            .set("Authorization", `Bearer ${token}`);
        expect(response.status).toBe(200);
        expect(response.body).toEqual({
            success: true,
            message: "Movie deleted successfully",

        });
    });
});


describe("POST /directors Authentication", () => {
    it("should return 401 when no token is provided", async () => {
        const response = await request(app)
            .post("/directors")
            .send({ name: "Test Director", birth_year: 1970 });
        expect(response.status).toBe(401);
        expect(response.body).toEqual({
            success: false,
            error: "Access token missing",
        });
    });

    it("should return 403 when an invalid token is provided", async () => {
        const response = await request(app)
            .post("/directors")
            .set("Authorization", "Bearer invalidtoken")
            .send({ name: "Test Director", birth_year: 1970 });
        expect(response.status).toBe(403);
        expect(response.body).toEqual({
            success: false,
            error: "Invalid access token",
            code: "INVALID_TOKEN",
        });
    });

    it("should return 201 and a success message when a valid token is provided", async () => {
        // Generate a valid token for testing
        const token = generateToken({ userId: 13, username: "testuser" });
        const response = await request(app)
            .post("/directors")
            .set("Authorization", `Bearer ${token}`)
            .send({ name: "Test Director", birthYear: 1970 });
        expect(response.status).toBe(201);
        expect(response.body).toEqual({
            success: true,
            message: "Director added successfully!",
            director: {
                id: expect.any(String),
                Name: "Test Director",
                Birth_year: "1970",
            }
        });
    });
});