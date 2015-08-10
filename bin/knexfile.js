// Update with your config settings.
var config = require('../server/config/db');

module.exports = {
  development: {
    client: 'postgresql',
    connection: config.connection
  }
};
