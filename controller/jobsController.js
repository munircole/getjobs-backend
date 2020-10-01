const {sequelize, Job, Jobseeker, Employer} = require("../config/sequelize");





const createJob = async (req, res) => {
  const {
    job_title, location, job_skill, job_category, job_type, qualification, experience, salary, responsibilities, job_description, deadline
  } = req.body;
  try {
    const employer_id = req.employer.id;
    const employer_name = req.employer.company_name;
    const employer = await Employer.findByPk(employer_id, employer_name);


    const job = await Job.build({
      employer_id,
      employer_name,
      job_title,
      location,
      job_skill,
      job_category,
      job_type,
      qualification,
      experience,
      salary,
      responsibilities,
      job_description,
      post_date,
      deadline
    }).save();

    const created = job.dataValues;

    return res.status(201).json({
      status: 'success',
      data: {
        message: 'job Created Successfully',
        jobID: created.id,
        jobName: created.job_title
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




const getJobs = async (req, res) => {
  //let { page } = req.query;

  //!page || parseInt(page) <= 1 ? (page = 0) : (page = parseInt(page) - 1);

  //const limit = 30;
  //const offset = Number(page * limit);

  try {
    const jobs = await Job.findAndCountAll();

    if (jobs) {
      return res.status(200).json( jobs.rows
        );
    }

    return res.status(404).json({
      status: 'error',
      errors: {
        message: 'No jobs Found'
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



const getSingleJob = async (req, res) => {
  const { jobId } = req.params;
  try {
    const result = await Job.findOne({ where: { id: jobId } });

    if (result == null) {
      return res.status(204).json({
        status: 'success',
        data: {
          message: 'job not found'
        }
      });
    }

    return res.status(200).json( result
    );
  } catch (err) {
    res.status(500).json({
      status: 'error',
      errors: {
        message: err.message
      }
    });
  }
  return true;
};


const updateJobs = async (req, res) => {
  const {
    job_title, location, job_skill, job_category, job_type, qualification, experience, salary, responsibilities, job_description, deadline
  } = req.body;
  try {
    const { jobId } = req.params;
    const jobExists = await Job.findByPk(jobId);
    const entries = {};

    if (!jobExists) {
      return res.status(422).json({
        status: 'error',
        errors: {
          message: 'job does not exist.'
        }
      });
    }

    if (job_title) entries.job_title = job_title;
    if (location) entries.location = location;
    if (job_skill) entries.job_skill = job_skill;
    if (job_category) entries.job_category = job_category;
    if (job_type) entries.job_type = job_type;
    if (qualification) entries.qualification = qualification;
    if (experience) entries.experience = experience;
    if (salary) entries.salary = salary;
    if (responsibilities) entries.responsibilities = responsibilities;
    if (job_description) entries.job_description = job_description;
    if (deadline) entries.deadline = deadline;



    const job = await Job.update(
      entries,
      {
        where: { id: jobId },
        returning: true,
        plain: true
      }
    );

    if (!job) {
      return res.status(500).json({
        status: 'error',
        errors: {
          message: 'There was an error updating the job'
        }
      });
    }

    return res.status(201).json({
      status: 'success',
      data: {
        message: 'job Updated Successfully',
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




const deleteJob = async (req, res) => {

  try {
    const { jobId } = req.params;
    const jobExists = await Job.findByPk(jobId);

    if (!jobExists) {
      return res.status(422).json({
        status: 'error',
        errors: {
          message: 'Job does not exist.'
        }
      });
    }

    const job = await Job.destroy({
      where: { id: jobId },
    });

    if (!job) {
      return res.status(500).json({
        status: 'error',
        errors: {
          message: 'There was an error deleting the job'
        }
      });
    }

    return res.status(200).json({
      status: 'success',
      data: {
        message: 'job Deleted Successfully',
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
  createJob,
  updateJobs,
  getJobs,
  getSingleJob,
  deleteJob
};