var Sequelize = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    const Jobseeker = sequelize.define('jobseekers', {
        id: {
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
            type: Sequelize.INTEGER
        },
        firstName: {
            type: Sequelize.STRING,
            allowNull: false
        },
        lastName: {
            type: Sequelize.STRING,
            allowNull: false
        },
        otherName: {
            type: Sequelize.STRING,
            allowNull: true
        },

        email: {
            type: Sequelize.STRING,
            allowNull: false,
            unique: true
        },
        contact_number: {
            type: Sequelize.STRING,
            allowNull: false
        },
        gender: {
            type: Sequelize.STRING,
            allowNull: false
        },
        dob: {
            type: Sequelize.STRING,
            allowNull: false
        },

        country: {
            type: Sequelize.STRING,
            allowNull: false
        },
        state: {
            type: Sequelize.STRING,
            allowNull: false
        },
        qualification: {
            type: Sequelize.STRING,
            allowNull: false
        },

        profession: {
            type: Sequelize.STRING,
            allowNull: false
        },

        password: {
            type: Sequelize.STRING,
            allowNull: false
        },
        allow_mail: {
            type: Sequelize.INTEGER,
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

    return Jobseeker;
};
