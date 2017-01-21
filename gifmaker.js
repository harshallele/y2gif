
/*Module that processes options to download video, add options and returns a download link*/

//customisation options
var options = {
  decodedUrl:'',
  startTimeSecs:0,
  durationSecs:0,
  outputFps:15,
  captionText:'',
  reverseGif:false,
  greyScaleGif:false
}

exports.processVideo = function(params){
  var paramsArr = params.split('&');

  //Fill options object
  var encodedURL = paramsArr[0].split('=')[1];
  options.decodedUrl = decodeURIComponent(encodedURL);

  options.startTimeSecs = paramsArr[1].split('=')[1];

  options.durationSecs = paramsArr[2].split('=')[1];

  options.outputFps = paramsArr[3].split('=')[1];

  options.captionText = paramsArr[4].split('=')[1];

  options.reverseGif = paramsArr[5].split('=')[1];

  options.greyScaleGif = paramsArr[6].split('=')[1];



}
