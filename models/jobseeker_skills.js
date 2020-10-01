var Sequelize = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    const Jobseeker_Skills = sequelize.define('jobseeker_skills', {
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

        skill: {
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

    return Jobseeker_Skills;
};
