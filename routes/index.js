var express = require('express');
var router = express.Router();

  
var jobseeker = require("../controller/jobseekerController");
var employer = require("../controller/employerController")
var job = require("../controller/jobsController");
var application = require("../controller/applicationsController");
var auth = require('../midleware/auth');
var {JobseekerValidationRules, loginValidationRules, validate} = require('../midleware/validator');



/* GET users listing. */
router.get('/', jobseeker.getLandingPage);
router.post('/auth/jsregister', JobseekerValidationRules(), validate, jobseeker.registerNewJobseeker);
router.get('/jobseekers/:jobseekerId/applications', jobseeker.getJobseekerApplications);

router.post('/auth/registerEmployer', validate, employer.registerNewEmployer);

router.get('/employers', employer.getEmployers);
router.get('/employers/:employerId', employer.getEmployerProfile);
router.get('/employers/:employerId/jobs', employer.getEmployerJobs);
router.get('/employers/:employerId/applicants', employer.getEmployerApplicants);

router.post('/auth/signin', loginValidationRules(), validate, jobseeker.JobseekerSignin);

router.post('/jobs/create', auth, validate, job.createJob);
router.put('/jobs/:jobId/update', auth, validate, job.updateJobs);
router.delete('/jobs/:jobId/delete', auth, validate, job.updateJobs);
router.get('/jobs', job.getJobs);
router.get('/jobs/:jobId', job.getSingleJob);

router.get('/applications', application.getApplications);
router.post('/apply', application.createApplication);
router.delete('/applications/:applicationId/delete', application.deleteApplication);
router.get('/applications/:applicationId', application.getSingleApplication);

module.exports = router;



//router.get('/users/:userId/products', getUsersProducts);


module.exports = router;
