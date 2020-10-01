var Sequelize = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    const Jobseeker_Cert = sequelize.define('jobseeker_cert', {
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

        cert_title: {
            type: Sequelize.STRING,
            allowNull: false
        },
        cert_body: {
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

    return Jobseeker_Cert;
};
