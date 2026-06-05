const loggingMiddleware = (req, res, next) => {
  console.log(`Request received: ${req.method},  ${req.url}`);
  next();
};

const errorHandlingMiddleware = (err, req, res, next) => {
  console.error("An error occurred:", err);
  res.status(500).json({ error: "Internal Server Error" });
};
module.exports = { 
    loggingMiddleware, 
    errorHandlingMiddleware 
};
