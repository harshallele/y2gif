
/*Module that processes options to download video, add options and returns a download link*/

var fs = require('fs');
var ytdl = require('youtube-dl');
var exec = require('child_process').exec;

const dataPath = './data/';

//customisation options
var options = {
  id:0,
  decodedId:'',
  startTimeSecs:0,
  durationSecs:0,
  outputFps:15,
  captionText:'',
  reverseGif:false,
  greyScaleGif:false
}

exports.processVideo = function(params,id){
  var paramsArr = params.split('&');

  //Create options object
  var encodedId = paramsArr[0].split('=')[1];
  options.decodedId = decodeURIComponent(encodedId);

  options.startTimeSecs = paramsArr[1].split('=')[1];

  options.durationSecs = paramsArr[2].split('=')[1];

  options.outputFps = paramsArr[3].split('=')[1];

  options.captionText = paramsArr[4].split('=')[1];

  options.reverseGif = paramsArr[5].split('=')[1];

  options.greyScaleGif = paramsArr[6].split('=')[1];

  options.id = id;

  convertVideo();

}

var convertVideo = function () {
  //createJobDir(options.id);

  downloadVideo(options.decodedId);
}


var createJobDir = function(id){
  var dir = dataPath+id.toString();

  if(!fs.existsSync(dir)){
    fs.mkdirSync(dir);
  }

}

var downloadVideo = function(videoId){
    var url = 'https://www.youtube.com/watch?v='+videoId;


    exec('youtube-dl ' + url + ' --list-formats | grep medium',function(error,stdout,stderr){
      console.log(stdout);
    });



}
