const { body, validationResult } = require('express-validator');

const validationErrors = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    if(!errors.isEmpty()) {
        const errorsList = errors.array();

        const missingFields = errorsList.filter((error) => error.msg.includes('required'));
        const statuscode = missingFields.length > 0 ? 400 : 422;
        return res.status(statuscode).json({ errors: errorsList[0] });
    }
    next();
};

const validateLogin = [
    body('username')
    .exists()
    .withMessage('Username is required')
    .escape()
    .isString()
    .withMessage('Username must be a string')
    .isLength({ min: 4 })
    .withMessage('Username must be at least 4 characters long')
    .notEmpty()
    .withMessage('Username cannot be empty'),

    body('password')
    .exists()
    .withMessage('Password is required')
    .escape()
    .isString()
    .withMessage('Password must be a string')
    .isLength({ min: 8, max: 64 })
    .withMessage('Password must be between 8 and 64 characters long'),

    validationErrors
];

const validateMovie = [
    body('title')
    .exists()
    .withMessage('Title is required')
    .escape()
    .isString()
    .withMessage('Title must be a string')
    .notEmpty()
    .withMessage('Title cannot be empty'),

    body('year')
    .exists()
    .withMessage('Year is required')
    .escape()
    .isInt({ min: 1888, max: new Date().getFullYear() })
    .withMessage(`Year must be an integer between 1888 and ${new Date().getFullYear()}`),

    body('length')
    .exists()
    .withMessage('Length is required')
    .escape()
    .isInt({ min: 1, max: 51420 })
    .withMessage('Length must be a positive integer between 1 and 51420 minutes'),

    body('director_id')
    .exists()
    .withMessage('Director ID is required')
    .escape()
    .isInt({ min: 1 })
    .withMessage('Director ID must be a positive integer'),

    validationErrors
];

module.exports = {
    validateLogin,
    validateMovie
};