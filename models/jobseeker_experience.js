var Sequelize = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    const Jobseeker_Experience = sequelize.define('jobseeker_experince', {
        id: {
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
            type: Sequelize.INTEGER
        },

        jobseeker_id: {
            allowNull: false,
            type: Sequelize.INTEGER
        },

        job_title: {
            type: Sequelize.STRING,
            allowNull: false
        },
        job_type: {
            type: Sequelize.STRING,
            allowNull: false
        },

        company_name: {
            type: Sequelize.STRING,
            allowNull: false
        },

        location: {
            type: Sequelize.STRING,
            allowNull: false
        },

        start_date: {
            type: Sequelize.DATE,
            allowNull: false
        },

        end_date: {
            type: Sequelize.DATE,
            allowNull: false
        },

        createdAt: {
            type: Sequelize.DATE,
            allowNull: false
        },
        updatedAt: {
            type: Sequelize.DATE,
            allowNull: false
        },








    });

    return Jobseeker_Experience;
};
