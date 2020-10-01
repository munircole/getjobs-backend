var Sequelize = require('sequelize');
const employerModel =  require("../models/employer");
const jobseekerModel = require("../models/jobseeker");
const jobModel = require("../models/jobs");
const ApplicationModel = require("../models/applications");
const EducationModel = require("../models/jobseeker_education");
const ExperienceModel = require("../models/jobseeker_experience");
const certModel = require("../models/jobseeker_cert");
const languageModel = require("../models/jobseeker_language");
const skillsModel = require("../models/jobseeker_skills");
const cvModel = require("../models/jobseeker_cv");

require('dotenv').config();
dbconfig = {
    host: 'localhost',
    user: 'root',
    password: 'password',
    database: 'getjobs',
    dialect: "mysql"

};


const defaultDbConn = {
  host: dbconfig.host,
  user: dbconfig.user,
  database: dbconfig.database,
  password: dbconfig.password
};

const testDbConn = {
  host: dbconfig.host,
  user: dbconfig.user,
  database: dbconfig.database,
  password: dbconfig.password
};

const conn = process.env.NODE_ENV === 'test' ? testDbConn : defaultDbConn;

const sequelize = new Sequelize(conn.database, conn.user, conn.password, {
  host: conn.host,
  dialect: dbconfig.dialect, /* one of 'mysql' | 'mariadb' | 'postgres' | 'mssql' ,*/
  logging: false
});




const Jobseeker = jobseekerModel(sequelize, Sequelize);
const Employer = employerModel(sequelize, Sequelize);
const Job = jobModel(sequelize, Sequelize); 
const Application = ApplicationModel(sequelize, Sequelize);
const Education = EducationModel(sequelize, Sequelize);
const Experience = ExperienceModel(sequelize, Sequelize);
const Certification = certModel(sequelize, Sequelize);
const Skill = skillsModel(sequelize, Sequelize);
const Language = languageModel(sequelize, Sequelize);
const CV = cvModel(sequelize, Sequelize);





module.exports = {sequelize, Jobseeker, Employer, Job, Application, Education, Experience, Certification, Skill, Language, CV};
