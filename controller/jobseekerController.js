var bcrypt = require('bcrypt');
var jwt = require('jsonwebtoken');
const {sequelize, Job, Jobseeker, Employer, Application, Education, Experience, CV, Certification, Language, Skill } = require("../config/sequelize");






const getLandingPage = (req, res, next) => {
  res.json({
    status: 'success',
    data: {
      message: 'getjobs server is running'
    }
  });
};


// Register new users
const registerNewJobseeker = (req, res, next) => {
  const {
    firstName, lastName, otherName, email, contact_number, gender, dob, country, state, qualification, profession, password, allow_mail
  } = req.body;

  // Check if given email is already in use
  Jobseeker.findOne({ where: { email } })
    .then((check) => {
      if (check) {
        return res.status(403).json({
          status: 'error',
          errors: {
            message: `User with the email: ${email} already exist`
          }
        });
      }


      sequelize
        .sync()
        .then(() => {
          // Generate hashed password and store along with other user data
          bcrypt.hash(password, 10, (err, hashed) => {
            if (err) {
              return res.status(500).json({
                status: 'error',
                errors: {
                  message: err
                }
              });
            }
            return Jobseeker.build({
              firstName,
              lastName,
              otherName,
              email,
              contact_number,
              gender,
              dob,
              country,
              state,
              qualification,
              profession,
              allow_mail,
              password: hashed
            })
              .save()
              .then((jobseeker) => {
                const { id } = jobseeker.dataValues;
                res.status(201).json({
                  status: 'success',
                  data: {
                    message: 'jobseeker created successfully',
                    userId: id
                  }
                });
              });
          });
        })
        .catch((err) => res.status(500).json({
          status: 'error',
          error: {
            message: err
          }
        }));
      return true;
    })
    .catch((err) => res.send(500).json({
      status: 'error',
      error: {
        message: err
      }
    }));
};

const JobseekerSignin = (req, res, next) => {
  const { email, password } = req.body;

  // Check if given user email is in database
  Jobseeker.findOne({ where: { email } })
    .then((jobseeker) => {
      if (jobseeker === null) {
        return res.status(404).json({
          status: 'error',
          error: {
            message: `user with email ${email} does not exist`
          }
        });
      }

      // If found in database decode password from database and compare with one given
      bcrypt.compare(password, jobseeker.dataValues.password, (err, response) => {
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
              email: jobseeker.dataValues.email,
              id: jobseeker.dataValues.id
            },
            process.env.JWT_KEY,
            {
              expiresIn: '24hr'
            }
          );
          return res.send({token});
        }

        return res.status(401).json({
          status: 'error',
          error:{message: 'Authentication Failed'}
        });
      });
      return true;
    })
    .catch((err) => {
      res.status(500).json({
        status: 'error',
        error: {
          message: err.message
        }
      });
    });
};


const getJobseekerApplications = async (req, res) => {
  let { page } = req.query;
  const { jobseekerId } = req.params;

  !page || parseInt(page) <= 1 ? page = 0 : page = parseInt(page) - 1;

  const limit = 30;
  const offset = Number(page * limit);

  try {
      const applications = await Application.findAndCountAll({
          where: {
              jobseeker_id: jobseekerId
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

//Experience section

const createExperience = async (req, res) => {
  const {
    job_title, job_type, company_name, location, start_date, end_date
  } = req.body;
  try {
    const jobseeker_id = req.jobseeker.id;
    const jobseeker = await Jobseeker.findByPk(jobseeker_id);


    const experience = await Experience.build({
      jobseeker_id,
      job_title,
      job_type,
      company_name,
      location,
      start_date,
      end_date
    }).save();

    const created = experience.dataValues;

    return res.status(201).json({
      status: 'success',
      data: {
        message: 'experience Created Successfully',
        ExperienceID: created.id,
      }
    });
  } catch (error) {
    return res.status(500).json({
      status: 'error',
      errors: {
        message: 'internal Server Error',
        error
      }
    });
  }
};


const getJobseekerExperience = async (req, res) => {
  const { jobseekerId } = req.params;

  try {
      const experience = await Experience.findAndCountAll({
          where: {
              jobseeker_id: jobseekerId
          },
      });

      if (experience) {
          return res.status(200).json(experience.rows,
                                  
          );
      }

      return res.status(404).json({
          status: 'error',
          error: {
              message: 'No experience Found'
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



const updateExperience = async (req, res) => {
  const {
    job_title, job_type, company_name, location, start_date, end_date
  } = req.body;
  try {
    const { experienceId } = req.params;
    const experienceExists = await Experience.findByPk(experienceId);
    const entries = {};

    if (!experienceExists) {
      return res.status(422).json({
        status: 'error',
        errors: {
          message: 'experience does not exist.'
        }
      });
    }

    if (job_title) entries.job_title = job_title;
    if (job_type) entries.job_type = job_type;
    if (company_name) entries.company_name = company_name;
    if (location) entries.location = location;
    if (start_date) entries.start_date = start_date;
    if (end_date) entries.end_date = end_date;



    const experience = await Experience.update(
      entries,
      {
        where: { id: experienceId },
        returning: true,
        plain: true
      }
    );

    if (!experience) {
      return res.status(500).json({
        status: 'error',
        errors: {
          message: 'There was an error updating the field'
        }
      });
    }

    return res.status(201).json({
      status: 'success',
      data: {
        message: 'Updated Successfully',
        product,
      }
    });
  } catch (error) {
    return res.status(500).json({
      status: 'error',
      errors: error
    });
  }
};




const deleteExperience = async (req, res) => {

  try {
    const { experienceId } = req.params;
    const experienceExists = await Experience.findByPk(experienceId);

    if (!experienceExists) {
      return res.status(422).json({
        status: 'error',
        errors: {
          message: 'experience does not exist.'
        }
      });
    }

    const experience = await Experience.destroy({
      where: { id: experienceId },
    });

    if (!experience) {
      return res.status(500).json({
        status: 'error',
        errors: {
          message: 'There was an error deleting this field'
        }
      });
    }

    return res.status(200).json({
      status: 'success',
      data: {
        message: 'Deleted Successfully',
      }
    });
  } catch (error) {
    return res.status(500).json({
      status: 'error',
      errors: error
    });
  }
};

//Education section

const createEducation = async (req, res) => {
  const {
    institution_name, course, location, start_date, end_date
  } = req.body;
  try {
    const jobseeker_id = req.jobseeker.id;
    const jobseeker = await Jobseeker.findByPk(jobseeker_id);


    const education = await Education.build({
      jobseeker_id,
      institution_name,
      course,
      location,
      start_date,
      end_date
    }).save();

    const created = education.dataValues;

    return res.status(201).json({
      status: 'success',
      data: {
        message: 'Created Successfully',
        EducationID: created.id,
      }
    });
  } catch (error) {
    return res.status(500).json({
      status: 'error',
      errors: {
        message: 'internal Server Error',
        error
      }
    });
  }
};


const getJobseekerEducation = async (req, res) => {
  const { jobseekerId } = req.params;

  try {
      const education = await Education.findAndCountAll({
          where: {
              jobseeker_id: jobseekerId
          },
      });

      if (education) {
          return res.status(200).json(education.rows,
                                  
          );
      }

      return res.status(404).json({
          status: 'error',
          error: {
              message: 'No education Found'
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



const updateEducation = async (req, res) => {
  const {
    institution_name, course, location, start_date, end_date
  } = req.body;
  try {
    const { educationId } = req.params;
    const educationExists = await Education.findByPk(educationId);
    const entries = {};

    if (!educationExists) {
      return res.status(422).json({
        status: 'error',
        errors: {
          message: 'does not exist.'
        }
      });
    }

    if (institution_name) entries.institution_name = institution_name;
    if (course) entries.course = course;
    if (location) entries.location = location;
    if (start_date) entries.start_date = start_date;
    if (end_date) entries.end_date = end_date;



    const education = await Education.update(
      entries,
      {
        where: { id: educationId },
        returning: true,
        plain: true
      }
    );

    if (!education) {
      return res.status(500).json({
        status: 'error',
        errors: {
          message: 'There was an error updating the field'
        }
      });
    }

    return res.status(201).json({
      status: 'success',
      data: {
        message: 'Updated Successfully',
        product,
      }
    });
  } catch (error) {
    return res.status(500).json({
      status: 'error',
      errors: error
    });
  }
};




const deleteEducation = async (req, res) => {

  try {
    const { educationId } = req.params;
    const educationExists = await Education.findByPk(educationId);

    if (!educationExists) {
      return res.status(422).json({
        status: 'error',
        errors: {
          message: 'does not exist.'
        }
      });
    }

    const education = await Education.destroy({
      where: { id: educationId },
    });

    if (!education) {
      return res.status(500).json({
        status: 'error',
        errors: {
          message: 'There was an error deleting this field'
        }
      });
    }

    return res.status(200).json({
      status: 'success',
      data: {
        message: 'Deleted Successfully',
      }
    });
  } catch (error) {
    return res.status(500).json({
      status: 'error',
      errors: error
    });
  }
};

//Certifications section

const createCert = async (req, res) => {
  const {
    cert_title, cert_body, start_date, end_date
  } = req.body;
  try {
    const jobseeker_id = req.jobseeker.id;
    const jobseeker = await Jobseeker.findByPk(jobseeker_id);


    const cert = await Certification.build({
      jobseeker_id,
      cert_title,
      cert_body,
      start_date,
      end_date
    }).save();

    const created = cert.dataValues;

    return res.status(201).json({
      status: 'success',
      data: {
        message: 'Created Successfully',
        ExperienceID: created.id,
      }
    });
  } catch (error) {
    return res.status(500).json({
      status: 'error',
      errors: {
        message: 'internal Server Error',
        error
      }
    });
  }
};


const getJobseekercert = async (req, res) => {
  const { jobseekerId } = req.params;

  try {
      const cert = await Certification.findAndCountAll({
          where: {
              jobseeker_id: jobseekerId
          },
      });

      if (cert) {
          return res.status(200).json(cert.rows,
                                  
          );
      }

      return res.status(404).json({
          status: 'error',
          error: {
              message: 'No certications Found'
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



const updateCert = async (req, res) => {
  const {
    cert_title, cert_body, start_date, end_date
  } = req.body;
  try {
    const { certId } = req.params;
    const certExists = await Certification.findByPk(certId);
    const entries = {};

    if (!certExists) {
      return res.status(422).json({
        status: 'error',
        errors: {
          message: 'does not exist.'
        }
      });
    }

    if (cert_title) entries.cert_title = cert_title;
    if (cert_body) entries.cert_body = cert_body;
    if (start_date) entries.start_date = start_date;
    if (end_date) entries.end_date = end_date;



    const cert = await Certification.update(
      entries,
      {
        where: { id: certId },
        returning: true,
        plain: true
      }
    );

    if (!cert) {
      return res.status(500).json({
        status: 'error',
        errors: {
          message: 'There was an error updating the field'
        }
      });
    }

    return res.status(201).json({
      status: 'success',
      data: {
        message: 'Updated Successfully',
        product,
      }
    });
  } catch (error) {
    return res.status(500).json({
      status: 'error',
      errors: error
    });
  }
};




const deleteCert = async (req, res) => {

  try {
    const { certId } = req.params;
    const certExists = await Certification.findByPk(certId);

    if (!certExists) {
      return res.status(422).json({
        status: 'error',
        errors: {
          message: 'this field does not exist.'
        }
      });
    }

    const cert = await Certification.destroy({
      where: { id: certId },
    });

    if (!cert) {
      return res.status(500).json({
        status: 'error',
        errors: {
          message: 'There was an error deleting this field'
        }
      });
    }

    return res.status(200).json({
      status: 'success',
      data: {
        message: 'Deleted Successfully',
      }
    });
  } catch (error) {
    return res.status(500).json({
      status: 'error',
      errors: error
    });
  }
};

//skills section


const createSkills = async (req, res) => {
  const {
    skill
  } = req.body;
  try {
    const jobseeker_id = req.jobseeker.id;
    const jobseeker = await Jobseeker.findByPk(jobseeker_id);


    const skills = await Skill.build({
      jobseeker_id,
      skill
    }).save();

    const created = skills.dataValues;

    return res.status(201).json({
      status: 'success',
      data: {
        message: 'Created Successfully',
        skillsID: created.id,
      }
    });
  } catch (error) {
    return res.status(500).json({
      status: 'error',
      errors: {
        message: 'internal Server Error',
        error
      }
    });
  }
};


const getJobseekerskills = async (req, res) => {
  const { jobseekerId } = req.params;

  try {
      const skills = await Skill.findAndCountAll({
          where: {
              jobseeker_id: jobseekerId
          },
      });

      if (skills) {
          return res.status(200).json(skills.rows,
                                  
          );
      }

      return res.status(404).json({
          status: 'error',
          error: {
              message: 'No skills Found'
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



const updateSkills = async (req, res) => {
  const {
    skill
  } = req.body;
  try {
    const { skillId } = req.params;
    const skillExists = await skill.findByPk(skillId);
    const entries = {};

    if (!skillExists) {
      return res.status(422).json({
        status: 'error',
        errors: {
          message: 'does not exist.'
        }
      });
    }

    if (skill) entries.skill = skill;



    const skills = await Skill.update(
      entries,
      {
        where: { id: skillId },
        returning: true,
        plain: true
      }
    );

    if (!skills) {
      return res.status(500).json({
        status: 'error',
        errors: {
          message: 'There was an error updating the field'
        }
      });
    }

    return res.status(201).json({
      status: 'success',
      data: {
        message: 'Updated Successfully',
        product,
      }
    });
  } catch (error) {
    return res.status(500).json({
      status: 'error',
      errors: error
    });
  }
};




const deleteSkill = async (req, res) => {

  try {
    const { skillId } = req.params;
    const skillExists = await Skill.findByPk(skillId);

    if (!skillExists) {
      return res.status(422).json({
        status: 'error',
        errors: {
          message: 'this field does not exist.'
        }
      });
    }

    const skills = await Skill.destroy({
      where: { id: skillId },
    });

    if (!skills) {
      return res.status(500).json({
        status: 'error',
        errors: {
          message: 'There was an error deleting this field'
        }
      });
    }

    return res.status(200).json({
      status: 'success',
      data: {
        message: 'Deleted Successfully',
      }
    });
  } catch (error) {
    return res.status(500).json({
      status: 'error',
      errors: error
    });
  }
};










module.exports = {
  getLandingPage,
  registerNewJobseeker,
  JobseekerSignin,

  getJobseekerApplications,

  createExperience,
  getJobseekerExperience,
  updateExperience,
  deleteExperience,

  createEducation,
  getJobseekerEducation,
  updateEducation,
  deleteEducation,

  createCert,
  getJobseekercert,
  updateCert,
  deleteCert,

  createSkills,
  getJobseekerskills,
  updateSkills,
  deleteSkill
};