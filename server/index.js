
// Set default node environment to development
var env = process.env.NODE_ENV = process.env.NODE_ENV || 'development';

// if (env === 'development' || env === 'test') {
//     // Register the Babel require hook
//     require('babel-register');
// }

/**
 * Main application file
 */

'use strict';

const express = require('express');
const http = require('http');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const cors = require('cors');
const fetch = require('node-fetch');

// Setup server
var app = express();
var server = http.createServer(app);
app.use(bodyParser.json({ limit: '50mb' }));

app.use(cors());
app.use(cookieParser());

app.post('/api/cgt/', (req,res) => {
  // console.log('BODY',JSON.stringify(req.body));
  console.log("API BODY ABOUT TO BE SENT",req.body);
  // old api url: http://cryptoniteapiv2.herokuapp.com/api/v1/cgt
  fetch('http://52.65.99.64/api/v1/cgt', 
    {
      method: 'POST',
      // headers: req.headers
       headers: {
        'Content-Type': 'Application/JSON',
        'x-access-token': 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJwdWJsaWNfaWQiOiI4MThmYjdlNi03MDc0LTQ3MzAtOGJkOC1jYmE2NzU1MzUyODAifQ.zfdgQ-CeDSjXp6zYFEARlPjqi4BIuuJvT7Cndi1LbsI'
      },
    body: JSON.stringify(req.body)
    })
  .then((res)=>{
    return res.json()
  })
  .then(json => {
    return res.status(200).json(json);
  })
  .catch(err => {
    console.log(err);
    return res.status(500).json({err});
  });
});
app.get('/', (req, res) => {
    console.log('hit')
    return res.status(200).json({text: 'Hello World!'});
})

app.get('/entities', (req, res) => {
  // console.log('hitting entities on local server');
  fetch('http://52.65.99.64/api/v1/entitytypes', 
  {
    method: 'GET',
    // headers: req.headers
     headers: {
      'Content-Type': 'Application/JSON',
      'x-access-token': 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJwdWJsaWNfaWQiOiI4MThmYjdlNi03MDc0LTQ3MzAtOGJkOC1jYmE2NzU1MzUyODAifQ.zfdgQ-CeDSjXp6zYFEARlPjqi4BIuuJvT7Cndi1LbsI'
     }
  })
  .then((res) => res.json())
  .then(res => console.log("JSON RESPONSE",res));
})

// Start server
function startServer() {
  app.server = server.listen('8080', function() {
    console.log('Express server listening on %d, in %s mode', '8080', app.get('env'));
  });
}

startServer();

// Expose app
exports = module.exports = app;
