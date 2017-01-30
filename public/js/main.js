
//youtube player
var player;

//options
var gifStartTimeSecs = 0;
var gifDurationSecs = 1;
var outputFps = 15;
var captionText = '';
var reverseVid = false;
var greyScaleVid = false;

//video id
var videoId = '';

$(document).ready(function(){

  var currentSec = 1;


  //The selected Youtube URL
  var selectedVidUrl = '';



  var selectedVidDurationSec = 0;


  //youtube url text field
  var ytUrlText = $('#yturl')[0];
  //next button for first section
  var nextBtnSec1 = $('#sec1-next');

  //next button for second section
  var nextBtnSec2 = $('#sec2-next');

  //Back button of second section
  var prevBtnSec2 = $('#sec2-prev');

  //Sections
  var sec1 = $('#sec1');
  var sec2 = $('#sec2');
  var sec3 = $('#sec3');


  var tag = document.createElement('script');
  tag.src = "https://www.youtube.com/iframe_api";

  var playerDiv = document.getElementById('player');

  playerDiv.parentNode.insertBefore(tag,playerDiv);

  //click listener for next button of first section
  nextBtnSec1.click(onNxtBtn1Click);


  //Click listener for back button of second section
  prevBtnSec2.click(function () {
    loadFirstScreen();
    currentSec = 1;
  });


  //click listener for next button of second section
  nextBtnSec2.click(onNxtBtn2Click);

  //resize the video size according to the window size
  $(window).resize(resizeVideoPlayer);


  function resizeVideoPlayer(){
    if(sec2.width() < 992){
      player.setSize( sec2.width()*0.8 , (sec2.width()*0.8*9)/16 );
    }
    else{
      player.setSize( 854 , 480 );
    }
  }


  //empty out the selected URL and display the first section
  var loadFirstScreen = function(){

    player.stopVideo();

    //reset options
    gifStartTimeSecs = 0;
    gifDurationSecs = 1;
    outputFps = 15;
    captionText = '';
    reverseVid = false;
    greyScaleVid = false;

    sec1.slideDown('fast');
    sec2.slideUp('fast');

    selectedVidUrl = '';
  }

  //function to load the second screen with the video id, and
  var loadSecondScreen  = function() {

    sec1.slideUp('fast');
    sec2.slideDown('fast');

    videoId = getYtId(selectedVidUrl);

    $('#video-title').show();

    if(videoId === ''){
      $('#video-title').text('Youtube URL is invalid');
      $('#spinner-sec2').hide();
      $('.options').hide();
      nextBtnSec2.hide();
      player.getIframe().display = 'none';
    }
    else{
      //show the options and next button if it was hidden
      $('.options').show();
      nextBtnSec2.show();

      //Use the Youtube Data Api to get the video title using the id
      $.ajax({
      url: "https://www.googleapis.com/youtube/v3/videos?id=" + videoId + "&key=AIzaSyCNEFLZTLyoR25zgHQxPMFCAvQtg3f8WF4&fields=items(snippet(title),contentDetails(duration))&part=snippet,contentDetails",
      //url: "https://www.googleapis.com/youtube/v3/videos?id=" + videoId + "&key=AIzaSyCNEFLZTLyoR25zgHQxPMFCAvQtg3f8WF4&fields=items(snippet(title))&part=snippet",
      dataType: "jsonp",
      success: function(data){
               //Set the video title and the video source
               $('#video-title').text(data.items[0].snippet.title);

               resizeVideoPlayer();

               player.getIframe().display = 'block';
               //Hide the loading spinner
               $('#spinner-sec2').hide();

               setVidDuration(data.items[0].contentDetails.duration);
               //Set the slider range according to video length
               $('#slider-strttime').slider({
                 min:0,
                 max:selectedVidDurationSec,
                 step:parseInt(selectedVidDurationSec/100)
               });

              player.loadVideoById(videoId);
             },
      error: function(jqXHR, textStatus, errorThrown) {
              $('#video-title').text('Error while loading video');
              //Hide the loading spinner
              $('#spinner-sec2').hide();

              player.getIframe().display = 'none';

      }
  });


    }
  }

  var loadThirdScreen = function(){
    sec1.hide();
    sec2.slideUp('fast');
    sec3.slideDown('fast');
}



  //listener for slide event to update the start time
  $('#slider-strttime').on('change',function(slideEvt){

    var newVal = slideEvt.value.newValue;

    if(newVal > 3600){
      var hr = parseInt(newVal/3600);
      var hrStr = '0' + hr.toString();

      var rem = newVal%3600;

      var min = parseInt(rem/60);
      var minStr = ''
      if(min < 10){
        minStr = '0' + min.toString();
      }
      else{
        minStr = min.toString();
      }
      var sec = rem%60;
      var secStr = '';
      if(sec < 10){
        secStr = '0' + sec.toString();
      }
      else{
        secStr = sec.toString();
      }

      var valStr = hrStr + ':' + minStr + ':' + secStr;
      $('.slider-value-strt').text(valStr);
    }
    else{
      var min = parseInt(newVal/60);
      var minStr = ''
      if(min < 10){
        minStr = '0' + min.toString();
      }
      else{
        minStr = min.toString();
      }
      var sec = (newVal)%(60);
      var secStr = '';
      if(sec < 10){
        secStr = '0' + sec.toString();
      }
      else{
        secStr = sec.toString();
      }

      var valStr = minStr + ':' + secStr;
      $('.slider-value-strt').text(valStr);

    }

    //store the value
    gifStartTimeSecs = newVal;

    //set current time of playing video to the slider value
    playVideoContent();
  });

    //listener for slide event to update the duration
  $('#slider-duration').on('change',function(slideEvt){
    var val = slideEvt.value.newValue;
    var valStr = '';
    if(val < 10){
      valStr = '0';
    }
    valStr+=val.toString();
    $('.slider-value-duration').text(valStr + ' secs');

    //store the value
    gifDurationSecs = val;

    playVideoContent();
  });



  //listener for caption text
  $("#text-caption").on("change paste keyup", function() {
    captionText = $(this).val();
  });

  //listener for framerate
  $('#text-framerate').on('change paste keyup' , function(){
    outputFps = parseInt($(this).val());
  });

  //listener for checkboxes
  $('#checkbox-reverse').change(function(){
    reverseVid = this.checked;
  });

  $('#checkbox-bw').change(function(){
    greyScaleVid = this.checked;
  });


  $('#btn-replay').click(playVideoContent);




  //Listener for enter key
  $(document).keypress(function(e) {
    if(e.which == 13) {
      e.preventDefault();
      //If the user is in the first section, call the click listener for the next button
      if(currentSec === 1){
        onNxtBtn1Click();
      }
      else if (currentSec === 2) {
        onNxtBtn2Click();
      }
    }
});




  function onNxtBtn1Click() {

    if(ytUrlText.value) {
      //destroy the popover
      $('#yturl').popover('destroy');

      selectedVidUrl = ytUrlText.value;
      //Load the second section
      loadSecondScreen();

      currentSec = 2;


    }
    else {
      //Show a popover asking the user to enter url
      $('#yturl').popover({
        title:'Empty URL',
        content:'Please paste Youtube URL',
        placement:'top'
      }).popover('show');
    }


  }


  function onNxtBtn2Click(){

      loadThirdScreen();

      sendPostRequest();

      currentSec = 3;
  }





  //Get the youtube video id from the URL
  function getYtId(url){
    var ID = '';
    url = url.replace(/(>|<)/gi,'').split(/(vi\/|v=|\/v\/|youtu\.be\/|\/embed\/)/);
    if(url[2] !== undefined) {
      ID = url[2].split(/[^0-9a-z_\-]/i);
      ID = ID[0];

    }
    else {
      ID = '';

    }
      return ID;
}


function setVidDuration(durationString){
  var reptms = /^PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?$/;
  var hours = 0, minutes = 0, seconds = 0, totalseconds;

  if (reptms.test(durationString)) {
    var matches = reptms.exec(durationString);
    if (matches[1]) hours = Number(matches[1]);
    if (matches[2]) minutes = Number(matches[2]);
    if (matches[3]) seconds = Number(matches[3]);
    totalseconds = hours * 3600  + minutes * 60 + seconds;
  }
  selectedVidDurationSec = totalseconds;
}


  //Send an HTTP POST request with the link and options
  function sendPostRequest(){

    var http = new XMLHttpRequest();
    var url = '/vid';

    var params = '';

    var encodedId = encodeURIComponent(videoId);
    params+='v='+encodedId+'&';
    params+='s='+gifStartTimeSecs+'&';
    params+='d='+gifDurationSecs+'&';
    params+='f='+outputFps+'&';
    params+='t='+captionText+'&';
    params+='r='+reverseVid+'&';
    params+='g='+greyScaleVid;

    http.open('POST',url,true);

    //Send the proper header information along with the request
    http.setRequestHeader("Content-type", "application/x-www-form-urlencoded");

    http.onreadystatechange = function() {//Call a function when the state changes.
      if(http.readyState == 4 && http.status == 200) {
          alert(http.responseText);
      }
    }
    http.send(params);


  }

});


function onYouTubeIframeAPIReady() {
  player = new YT.Player('player', {
    events: {
      'onReady': onPlayerReady,
      'onStateChange': onPlayerStateChange
      }
  });
}


function onPlayerReady(event){
  event.target.playVideo();
  event.target.mute();
}

function onPlayerStateChange(event) {
    if (event.data == YT.PlayerState.PAUSED && player.getCurrentTime() == gifStartTimeSecs + gifDurationSecs) {
      playVideoContent();
    }
}


function playVideoContent(){
  player.loadVideoById({
    'videoId' : videoId,
    'startSeconds' : gifStartTimeSecs,
    'endSeconds' : gifStartTimeSecs + gifDurationSecs
  });

}
