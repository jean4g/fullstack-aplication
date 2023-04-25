const Sequelize = require('sequelize');

const connection = new Sequelize('guiapergunta','root','Znjder.762',{
    host: 'localhost',
    dialect: 'mysql'
});

module.exports = connection;