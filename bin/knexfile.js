// Update with your config settings.
var config = require('../server/config/db');
console.log('config.connection',config.connection);
module.exports = {
  development: {
    client: 'postgresql',
    connection: config.connection
  }
};
