var Sequelize = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    const Application = sequelize.define('applications', {
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

        jobseeker_firstName: {
            type: Sequelize.STRING,
            allowNull: false
        },
        jobseeker_lastName: {
            type: Sequelize.STRING,
            allowNull: false
        },

        jobseeker_otherName: {
            type: Sequelize.STRING,
            allowNull: false
        },

        company_id: {
            type: Sequelize.INTEGER,
            allowNull: false
        },

        company_name: {
            type: Sequelize.STRING,
            allowNull: false
        },

        job_id: {
            type: Sequelize.INTEGER,
            allowNull: false
        },

        job_title: {
            type: Sequelize.STRING,
            allowNull: false
        },

        qualification: {
            type: Sequelize.STRING,
            allowNull: false
        },

        email: {
            type: Sequelize.STRING,
            allowNull: false
        },

        contact_number: {
            type: Sequelize.STRING,
            allowNull: false
        },

        cv: {
            type: Sequelize.STRING,
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

    return Application;
};
