
/*Module that processes options to download video, add options and returns a download link*/

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


  console.log(options);

}
