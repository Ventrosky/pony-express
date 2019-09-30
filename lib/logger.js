const morgan = require('morgan');

let logger = morgan('tiny');
   
module.exports = logger;