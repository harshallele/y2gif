var express = require('express');

var app = express();

//Add public directory for static files
app.use(express.static('public'));



//listen on port 3000
app.listen(3000);

console.log('Listening on port 3000');
