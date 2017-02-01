#!/usr/bin/env nodejs

var express = require('express');
var gifmaker = require('./gifmaker.js');
var gifchecker = require('./gifchecker.js');

var app = express();

//Add public directory for static files
app.use(express.static('public',{
  dotfiles : 'deny'
}));

//Listen for POST request with video url and output options
app.post('/vid',function(req,res){
  if(req.method === 'POST'){
    req.on('data',function(data){
      var params = data.toString();
      var id = getRandomInt(10000,100000);
      res.writeHead(200,{'Content-type':'text/plain'});
      res.write(id.toString());
      res.end();
      gifmaker.processVideo(params,id);
    });
  }
});

//Listen for POST request with video id to check if a conversion has been done
app.post('/check',function(req,res){
  if(req.method === 'POST'){
    req.on('data',function (data) {
      var params = data.toString();
      var check = gifchecker.checkJob(params);
      res.writeHead(200,{'Content-type':'text/plain'});
      res.write(check.toString());
      res.end();
    });
  }
});


// Returns a random integer between min (included) and max (excluded)
function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min)) + min;
}



//listen on port 3000
var server = app.listen(3000);
console.log('Listening on port 3000');
