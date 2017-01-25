
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

//download, cut and convert the video to gif
var convertVideo = function () {
  createJobDir(options.id);

  var dir = dataPath+options.id.toString()+'/';

  downloadAndConvertVid(options.decodedId,dir);
}

//create a directory that will contain all files
var createJobDir = function(id){
  var dir = dataPath+id.toString();

  if(!fs.existsSync(dir)){
    fs.mkdirSync(dir);
  }

}

//download and convert the video
var downloadAndConvertVid = function(videoId,dir){
    //video url
    var url = 'https://www.youtube.com/watch?v='+videoId;

    getVideoInfo(url,dir);
}

var getVideoInfo = function(url,dir){
  //execute a shell command that uses youtube-dl to get available formats
  exec('youtube-dl ' + url + ' --list-formats | grep \'video only\' | grep 360 | head -n1 | awk \'{print $1,$2}\' ',{maxBuffer: 1024 * 500} , function(error,stdout,stderr){

    if(error) throw error;
    downloadVid(stdout,url,dir);
  });
}

//download the video
var downloadVid = function(vidInfo,url,dir){
  //format
  var format = vidInfo.split(' ')[0];
  //file extension
  var ext = vidInfo.split(' ')[1];


  var video = ytdl(url,['--format='+format]);

  video.pipe(fs.createWriteStream(dir+'vid.'+ext));

  video.on('end',function() {
    console.log('Download Over ' + options.id);
  });

}

/*
var makeGif(vidInfo,dir){

}
*/
