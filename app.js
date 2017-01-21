var express = require('express');
var gifmaker = require('./gifmaker.js');

var app = express();

//Add public directory for static files
app.use(express.static('public'));

//Listen for POST request with video url and output options
app.post('/vid',function(req,res){
  if(req.method === 'POST'){
    req.on('data',function(data){
      var params = data.toString();
      gifmaker.processVideo(params);

    });
  }
});


//listen on port 3000
app.listen(3000);




console.log('Listening on port 3000');
