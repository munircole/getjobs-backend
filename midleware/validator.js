var { body, validationResult } = require('express-validator');

 const JobseekerValidationRules = () => [
    body('firstName', 'firstName is required').not().isEmpty(),
    body('lastName', 'lastName is required').not().isEmpty(),
    body('otherName').optional(),
    body('email', 'email is required, make sure it is in the pattern yourmailname@domain.com').isEmail().not().isEmpty(),
    body('contact_number', 'contact_number is required').not().isEmpty(),
    body('gender', 'gender is required').not().isEmpty(),
    body('dob', 'dob is required').not().isEmpty(),
    body('country', 'country is required').not().isEmpty(),
    body('state', 'state is required').not().isEmpty(),
    body('qualification', 'qualification is required').not().isEmpty(),
    body('profession', 'profession is required').not().isEmpty(),
    body('password', 'password is required').not().isEmpty(),
    body('allow_mail').optional()
];

 const employerValidationRules = () => [
    body('firstName', 'firstName is required').not().isEmpty(),
    body('lastName', 'lastName is required').not().isEmpty(),
    body('otherName').optional(),
    body('email', 'email is required, make sure it is in the pattern yourmailname@domain.com').isEmail().not().isEmpty(),
    body('contact_number', 'contact_number is required').not().isEmpty(),
    body('company_position', 'company_position is required').not().isEmpty(),
    body('company_name', 'company_name is required').not().isEmpty(),
    body('country', 'country is required').not().isEmpty(),
    body('state', 'state is required').not().isEmpty(),
    body('address', 'address is required').not().isEmpty(),
    body('gender', 'gender is required').not().isEmpty(),
    body('industry', 'industry is required').not().isEmpty(),
    body('company_description', 'company_description is required').not().isEmpty(),
    body('password', 'password is required').not().isEmpty(),
    body('comapany_logo').optional(),
    body('company_website', 'company_website is required').not().isEmpty(),

];


 const loginValidationRules = () => [
    body('email', 'email is required, make sure it is in the pattern yourmailname@domain.com').isEmail().not().isEmpty(),
    body('password', 'password is required').not().isEmpty()
];


 const validate = (req, res, next) => {
    const errors = validationResult(req);
    if (errors.isEmpty()) {
        return next();
    }

    const extractedErrors = {};

    /* eslint-disable no-return-assign */
    errors.array().map((err) => (extractedErrors[err.param] = err.msg));

    return res.status(400).json({
        status: 'error',
        errors: extractedErrors
    });
};

 module.exports = { JobseekerValidationRules, employerValidationRules, loginValidationRules, validate };

