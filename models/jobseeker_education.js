var Sequelize = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    const Jobseeker_Education = sequelize.define('jobseeker_education', {
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

        institution_name: {
            type: Sequelize.STRING,
            allowNull: false
        },
        course: {
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

    return Jobseeker_Education;
};
