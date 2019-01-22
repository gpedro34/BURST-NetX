'use strict';

const app = require('./api/api')

// Start the server
const port = process.env.PORT || require('./config/defaults').webserver.port || 3000;
app.listen(port, () => {
  console.log('Server is listening on port '+port);
});
