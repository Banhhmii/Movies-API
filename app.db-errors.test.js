const request = require("supertest");
const { app } = require("./app");
const { Pool } = require("pg");
const { generateToken } = require("./middleware/authentication");

// Mock the database connection
jest.mock("pg");

describe("POST /register Database Errors", () => {
  it("should return 500 when the database crashes", async () => {
    // 2. Force the query function to trigger the callback with an error
    Pool.prototype.query.mockImplementationOnce((text, params, callback) => {
      callback(new Error("Database connection lost"), null);
    });
    const response = await request(app)
      .post("/register")
      .send({ username: "testuser", password: "testpassword" });

    expect(response.status).toBe(500);
    expect(response.body).toEqual({
      error: "Database error",
      message: "Failed to register user",
      success: false,
    });
  });
});