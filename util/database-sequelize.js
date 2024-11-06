// ** Using mysql2 **
// const mysql = require('mysql2');

// const pool = mysql.createPool({
//   host: '127.0.0.1', // => localhost
//   user: 'root', // => root
//   database: 'node-js-complete', // => nodejs-course
//   password: '123456'
// });

// module.exports = pool.promise();

// ** Using sequelize **
const Sequelize = require('sequelize');

const sequelize = new Sequelize('node-js-complete', 'root', '123456', {
  host: '127.0.0.1',
  dialect: 'mysql'
});

module.exports = sequelize;
