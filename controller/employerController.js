var bcrypt = require('bcrypt');
var jwt = require('jsonwebtoken');

const {sequelize, Job, Jobseeker, Employer,  Application } = require("../config/sequelize");


// Register new Employer
const registerNewEmployer = (req, res, next) => {
    let image;
    let uploadImage;
    let imgUrl = '';

    // Check if the user attach an image or not
    if (req.files) {
        uploadImage = req.files.company_logo;
    }

    const {
        firstName, lastName, otherName, email, contact_number, gender, company_position, company_name, country, state, address, industry, company_description, password, company_website
    } = req.body;

    // Check if given email is already in use
    Employer.findOne({ where: { email } })
        .then((check) => {
            if (check) {
                return res.status(403).json({
                    status: 'error',
                    error: {
                        message: `User with the email: ${email} already exist`
                    }
                });
            }

            
            sequelize
                .sync()
                .then(() => {
                    if (image) {
                        imgUrl = image.url;
                    }
                    // Generate hashed password and store along with other user data
                    bcrypt.hash(password, 10, (err, hashed) => {
                        if (err) {
                            return res.sendStatus(500).json({
                                status: 'error',
                                error: {
                                    message: err
                                }
                            });
                        }
                        return Employer.build({
                            firstName,
                            lastName,
                            otherName,
                            email,
                            contact_number,
                            gender,
                            company_position,
                            company_name,
                            country,
                            state,
                            address,
                            industry,
                            company_description,
                            password: hashed,
                            company_website,
                            company_logo: imgUrl
                        })
                            .save()
                            .then((employer) => {
                                const { id } = employer.dataValues;
                                res.status(201).json({
                                    status: 'success',
                                    data: {
                                        message: 'Employer created successfully',
                                        userId: id
                                    }
                                });
                            });
                    });
                })
                .catch((err) => res.status(500).json({
                    status: 'error',
                    error: {
                        message: err.message
                    }
                }));
            return true;
        })
        .catch((err) => res.status(500).json({
            status: 'error',
            error: {
                message: err.message
            }
        }));
};


const getEmployers = async (req, res) => {
    //let { page } = req.query;
  
    //!page || parseInt(page) <= 1 ? (page = 0) : (page = parseInt(page) - 1);
  
    //const limit = 30;
    //const offset = Number(page * limit);
  
    try {
      const employers = await Employer.findAndCountAll();
  
      if (employers) {
        return res.status(200).json(employers.rows,          
        );
      }
  
      return res.status(404).json({
        status: 'error',
        errors: {
          message: 'No employers Found'
        }
      });
    } catch (err) {
      return res.status(500).json({
        status: 'error',
        errors: {
          message: err.message,
        }
      });
    }
  };
  
  

const employerSignin = (req, res, next) => {
    const { email, password } = req.body;

    // Check if given user email is in database
    Employer.findOne({ where: { email } })
        .then((employer) => {
            if (employer === null) {
                return res.sendStatus(404).json({
                    status: 'error',
                    error: {
                        message: `Employer with email ${email} does not exist`
                    }
                });
            }

            // If found in database decode password from database and compare with one given
            bcrypt.compare(password, employer.dataValues.password, (err, response) => {
                if (err !== undefined) {
                    return res.status(500).json({
                        status: 'error',
                        error: { message: 'An error occurred on comaparing password' }
                    });
                }

                if (response === false) {
                    return res.status(401).json({
                        status: 'error',
                        error: { message: 'Authentication Failed: Wrong Password' }
                    });
                }

                // Generate token if password matches above
                if (response) {
                    const token = jwt.sign(
                        {
                            email: employer.dataValues.email,
                            id: employer.dataValues.id
                        },
                        process.env.JWT_KEY,
                        {
                            expiresIn: '24hr'
                        }
                    );
                    return res.status(200).json({
                        status: 'success',
                        data: {
                            message: 'Authentication Successful',
                            token
                        }
                    });
                }

                return res.status(401).json({
                    status: 'error',
                    error: 'Authentication Failed'
                });
            });
            return true;
        })
        .catch((err) => {
            res.status(500).json({
                status: 'error',
                error: {
                    message: err
                }
            });
        });
};





const getEmployerProfile = async (req, res, next) => {
    const { employerId } = req.params;
    try {
        // Find the user by primary key.
        const employer = await Employer.findOne(
            {
                where: {
                    id: employerId
                },
                attributes: [
                    'id',
                    'firstName',
                    'lastName',
                    'email',
                    'contact_number',
                    'gender',
                    'company_position',
                    'company_name',
                    'country',
                    'state',
                    'address',
                    'industry',
                    'company_description',
                    'company_website',
                    'company_logo'
                ]
            }
        );

        if (employer) {
            return res.status(200).json(employer.dataValues
                );
        }
        return res.status(404).json({
            status: 'error',
            error: {
                message: 'User does not exist.'
            }
        });
    } catch (error) {
        return res.status(500).json({
            status: 'error',
            error: {
                message: 'Internal Server error',
                error
            }
        });
    }
};


const getEmployerJobs = async (req, res) => {
    let { page } = req.query;
    const { employerId } = req.params;

    !page || parseInt(page) <= 1 ? page = 0 : page = parseInt(page) - 1;

    const limit = 30;
    const offset = Number(page * limit);

    try {
        const jobs = await Job.findAndCountAll({
            where: {
                employer_id: employerId
            },
            offset,
            limit
        });

        if (jobs) {
            return res.status(200).json(jobs.rows,
                                    
            );
        }

        return res.status(404).json({
            status: 'error',
            error: {
                message: 'No jobs Found'
            }
        });
    } catch (error) {
        return res.status(500).json({
            status: 'error',
            error: {
                message: error.message,
            }
        });
    }
};

const getEmployerApplicants = async (req, res) => {
    let { page } = req.query;
    const { employerId } = req.params;

    !page || parseInt(page) <= 1 ? page = 0 : page = parseInt(page) - 1;

    const limit = 30;
    const offset = Number(page * limit);

    try {
        const applications = await Application.findAndCountAll({
            where: {
                company_id: employerId
            },
            offset,
            limit
        });

        if (applications) {
            return res.status(200).json(applications.rows,
                                    
            );
        }

        return res.status(404).json({
            status: 'error',
            error: {
                message: 'No applications Found'
            }
        });
    } catch (error) {
        return res.status(500).json({
            status: 'error',
            error: {
                message: error.message,
            }
        });
    }
};

module.exports = {
    registerNewEmployer,
    employerSignin,
    getEmployerProfile,
    getEmployerJobs,
    getEmployers,
    getEmployerApplicants
}