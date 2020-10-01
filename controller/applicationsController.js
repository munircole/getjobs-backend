const { sequelize, Job, Jobseeker, Employer, Application } = require("../config/sequelize");





const createApplication = async (req, res) => {
    const {
        email, contact_number, cv
    } = req.body;
    try {
        const jobseeker_id = req.jobseeker.id;
        const jobseeker_firstName = req.jobseeker.jobseeker_firstName;
        const jobseeker_lastName = req.jobseeker.jobseeker_lastName
        const jobseeker_otherName = req.jobseeker.jobseeker_otherName
        const qualification = req.jobseeker.qualification;


        const company_id = req.job.employer_id;
        const company_name = req.job.employer_name;

        const job_id = req.job.id;
        const job_title = req.job.job_title;


        const jobseeker = await Jobseeker.findByPk(jobseeker_id, jobseeker_firstName, jobseeker_lastName, jobseeker_otherName, qualification)
        const job = await Job.findByPk(job_id, job_title, company_id, company_name, );


        const application = await Application.build({
            jobseeker_id,
            jobseeker_firstName,
            jobseeker_lastName,
            jobseeker_otherName,
            company_id,
            company_name,
            job_id,
            job_title,
            qualification,
            email,
            contact_number,
            cv,
            
        }).save();

        const created = application.dataValues;

        return res.status(201).json({
            status: 'success',
            data: {
                message: 'Application Created Successfully',
                ApplicationID: created.id,
                jobseekerName: created.jobseeker_firstName
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




const getApplications = async (req, res) => {
    //let { page } = req.query;

    //!page || parseInt(page) <= 1 ? (page = 0) : (page = parseInt(page) - 1);

    //const limit = 30;
    //const offset = Number(page * limit);

    try {
        const applications = await Application.findAndCountAll();

        if (applications) {
            return res.status(200).json(applications.rows
            );
        }

        return res.status(404).json({
            status: 'error',
            error: {
                message: 'No applications Found'
            }
        });
    } catch (err) {
        return res.status(500).json({
            status: 'error',
            error: {
                message: err.message,
            }
        });
    }
};



const getSingleApplication = async (req, res) => {
    const { applicationId } = req.params;
    try {
        const result = await Application.findOne({ where: { id: applicationId } });

        if (result == null) {
            return res.status(204).json({
                status: 'success',
                message: 'Application not found'
                
            });
        }

        return res.status(200).json(result
        );
    } catch (err) {
        res.status(500).json({
            status: 'error',
            error: {
                message: err.message
            }
        });
    }
    return true;
};






const deleteApplication = async (req, res) => {

    try {
        const { applicationId } = req.params;
        const applicationExists = await Application.findByPk(applicationId);

        if (!applicationExists) {
            return res.status(422).json({
                status: 'error',
                error: {
                    message: 'application does not exist.'
                }
            });
        }

        const application = await Application.destroy({
            where: { id: applicationId },
        });

        if (!application) {
            return res.status(500).json({
                status: 'error',
                error: {
                    message: 'There was an error deleting the Application'
                }
            });
        }

        return res.status(200).json({
            status: 'success',
            message: 'Application Deleted Successfully',
            
        });
    } catch (error) {
        return res.status(500).json({
            status: 'error',
            error: error
        });
    }
};

module.exports = {
    createApplication,
    getApplications,
    getSingleApplication,
    deleteApplication
};