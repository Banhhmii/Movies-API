const movieValidation = (req,res,next) => {
    const { title, year, director_id } = req.body;
  if (!title || !year || !director_id) {
    return res
      .status(400)
      .json({ error: "Title, year, and director_id are required" });
  }
  if (
    typeof title !== "string" ||
    typeof year !== "number" ||
    typeof director_id !== "number"
  ) {
    return res
      .status(400)
      .json({ error: "Invalid data types for title, year, or director_id" });
  }
  next();
}
 const registerAndLoginValidation = (req,res,next) => {
    const { username, password } = req.body;
  if (!username || !password) {
    return res
      .status(400)
      .json({ error: "Username and password are required" });
  }
  if (typeof username !== "string" || typeof password !== "string") {
    return res
      .status(400)
      .json({ error: "Invalid data types for username or password" });
  }
  if (password.length > 64) {
    return res
      .status(400)
      .json({ error: "Password cannot be longer than 64 characters" });
  }
  next();
}
module.exports = {
    movieValidation,
    registerAndLoginValidation
}