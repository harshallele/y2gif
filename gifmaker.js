
/*Module that processes options to download video, add options and returns a download link*/

var fs = require('fs');
var ytdl = require('youtube-dl');
var exec = require('child_process').exec;

const dataPath = './data/';

var gifFileLink = '';

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

  return gifFileLink;
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

    //download the video
    //slice stdout to remove the new line at the end
    downloadVid(stdout.slice(0,-1),url,dir);
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

  //After the video has finished,cut the video and change it's framerate
  video.on('end',function() {
    cutVideo(vidInfo,dir);
  });

}

//cuts the video to desired length and changes framerate
var cutVideo = function(vidInfo,dir) {

  //file extension
  var ext = vidInfo.split(' ')[1];
  //name of full length file
  var ytFile = dir+'vid.'+ext;

  var command = 'ffmpeg -i ' + ytFile + ' -ss ' + options.startTimeSecs + ' -t ' + options.durationSecs + ' -vf fps=' + options.outputFps + ' ' + dir +'c.' + ext;

  exec(command,{maxBuffer:1024*500},function(error,stdout,stderr){

    if(error) throw error;

    addCaptionsAndEffects(vidInfo,dir);

  });
}

//Adds captions and effects
var addCaptionsAndEffects = function (vidInfo,dir) {

  //file extension
  var ext = vidInfo.split(' ')[1];


  //ffmpeg command to execute
  var command = 'ffmpeg -i ' + dir + 'c.'+ext + ' ';

  var effectsAdded = false;

  //Add captions
  if(options.captionText != ''){

    command += ' -vf "drawtext= fontfile=/usr/share/fonts/truetype/ubuntu-font-family/Ubuntu-M.ttf: text=' + options.captionText + ': fontcolor=white: fontsize=24: x=(w-text_w)/2: y=(h-text_h)*0.9 ';

    effectsAdded = true;

  }

  //Reverse the video
  if(options.reverseGif == true){

    if(!effectsAdded){
      command += ' -vf "';
    }

    else{
      command += ' , ';
    }

    command += ' reverse ';
    effectsAdded = true;
  }

  //Make the video black and white
  if(options.greyScaleGif == true){

    if(!effectsAdded){
      command += ' -vf "';
    }
    else{
      command += ' , ';
    }

    command += ' hue=s=0 ';
    effectsAdded = true;

  }

  //End the quotes (if any have started)
  if(effectsAdded){
    command += ' " ';
  }

  //Output file
  command+= dir + 't.' + ext;

  console.log(command);

  exec(command,{maxBuffer: 1024*500},function (error,stdout,stderr) {

    if(error) throw error;

    makeGif(vidInfo,dir);

  });

}

//Convert video to gif
var makeGif = function(vidInfo,dir){
  //format
  var format = vidInfo.split(' ')[0];
  //file extension
  var ext = vidInfo.split(' ')[1];

  //video file name
  var vidFile = dir+'t.'+ext;
  //output video
  var gifFileName = dir + 'g.gif';


  var ffmpegCommand = 'ffmpeg -i ' + vidFile + ' -pix_fmt rgb8 ' + ' ' + gifFileName;

  exec(ffmpegCommand,{maxBuffer: 1024*500},function (error,stdout,stderr) {

    if(error) throw error;

    deleteRawContent(vidInfo,dir);

    gifFileLink = gifFileName;

  });

}

//delete raw content
var deleteRawContent = function (vidInfo,dir) {
  //file extension
  var ext = vidInfo.split(' ')[1];

  fs.unlink(dir + 'vid.' + ext , function (err) {
    if(err) throw err;
  });

  fs.unlink(dir + 'c.' + ext , function (err) {
    if(err) throw err;
  });

  fs.unlink(dir + 't.' + ext , function (err) {
    if(err) throw err;
  });

}
