var Sequelize = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    const Job = sequelize.define('jobs', {
        id: {
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
            type: Sequelize.INTEGER
        },

        employer_id: {
            allowNull: false,
            type: Sequelize.INTEGER
        },

        employer_name: {
            type: Sequelize.STRING,
            allowNull: false
        },
        job_title: {
            type: Sequelize.STRING,
            allowNull: false
        },
        location: {
            type: Sequelize.STRING,
            allowNull: true
        },

        job_skill: {
            type: Sequelize.STRING,
            allowNull: false,
            unique: true
        },
        job_category: {
            type: Sequelize.STRING,
            allowNull: false
        },
        job_type: {
            type: Sequelize.STRING,
            allowNull: false
        },
        qualification: {
            type: Sequelize.STRING,
            allowNull: false
        },
        experience: {
            type: Sequelize.STRING,
            allowNull: false
        },

        salary: {
            type: Sequelize.STRING,
            allowNull: false
        },
        responsibilities: {
            type: Sequelize.STRING,
            allowNull: false
        },
        job_description: {
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

        deadline: {
            type: Sequelize.DATE,
            allowNull: false
        },

    });

    return Job;
};
