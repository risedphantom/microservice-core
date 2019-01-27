const express = require('express');


const setHeaders = (res) => {
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, DELETE, PUT');
  res.setHeader('Access-Control-Allow-Origin', '*');
};


module.exports = express.static('server/static', {setHeaders});
