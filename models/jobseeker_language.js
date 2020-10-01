var Sequelize = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    const Jobseeker_Language = sequelize.define('jobseeker_language', {
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

        language: {
            type: Sequelize.STRING,
            allowNull: false
        },
        level: {
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

    return Jobseeker_Language;
};
