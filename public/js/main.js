$(document).ready(function(){

  //youtube url text field
  var ytUrlText = $('#yturl')[0];
  //next button for first section
  var nextBtnSec1 = $('#sec1-next');

  //Back button of second section
  var prevBtnSec2 = $('#sec2-prev');

  //Section 1
  var sec1 = $('#sec1');
  var sec2 = $('#sec2');

  //The selected Youtube URL
  var selectedVidUrl = '';

  var selectedVidDurationSec = 0;

  //click listener for next button of first section
  nextBtnSec1.click(function(){
    if(ytUrlText.value) {
      //destroy the popover
      $('#yturl').popover('destroy');

      selectedVidUrl = ytUrlText.value;
      //Load the second section
      loadSecondScreen();

    }
    else {
      //Show a popover asking the user to enter url
      $('#yturl').popover({
        title:'Empty URL',
        content:'Please paste Youtube URL',
        placement:'top'
      }).popover('show');
    }
  });

  //Click listener for back button of second section
  prevBtnSec2.click(function () {
    loadFirstScreen();
  });


  //resize the video size according to the window size
  $(window).resize(resizeVideoPlayer);


  function resizeVideoPlayer(){
    if(sec2.width() < 992){
      $('#main-video').width(sec2.width()*0.8);
      $('#main-video').height((sec2.width()*0.8*9)/16);
    }
    else{
      $('#main-video').width(854);
      $('#main-video').height(480);
    }
  }


  //empty out the selected URL and display the first section
  var loadFirstScreen = function(){

    sec1.slideDown('fast');
    sec2.slideUp('fast');

    selectedVidUrl = '';
  }

  //function to load the second screen with the video id, and
  var loadSecondScreen  = function() {

    sec1.slideUp('fast');
    sec2.slideDown('fast');

    var videoId = '';
    videoId = getYtId(selectedVidUrl);

    $('#main-video').hide();
    $('#video-title').show();

    if(videoId === ''){
      $('#video-title').text('Youtube URL is invalid');
      $('#spinner').hide();
    }
    else{

      //Use the Youtube Data Api to get the video title using the id
      $.ajax({
      url: "https://www.googleapis.com/youtube/v3/videos?id=" + videoId + "&key=AIzaSyCNEFLZTLyoR25zgHQxPMFCAvQtg3f8WF4&fields=items(snippet(title),contentDetails(duration))&part=snippet,contentDetails",
      //url: "https://www.googleapis.com/youtube/v3/videos?id=" + videoId + "&key=AIzaSyCNEFLZTLyoR25zgHQxPMFCAvQtg3f8WF4&fields=items(snippet(title))&part=snippet",
      dataType: "jsonp",
      success: function(data){
               //Set the video title and the video source
               $('#video-title').text(data.items[0].snippet.title);
               var mainPlayer = videojs('main-video');
               mainPlayer.src({type: 'video/youtube', src: selectedVidUrl});
               mainPlayer.muted(true);
               $('#main-video').show();
               resizeVideoPlayer();

               //Hide the loading spinner
               $('#spinner').hide();

               setVidDuration(data.items[0].contentDetails.duration);
               //Set the slider range according to video length
               $('#slider-strttime').slider({
                 min:0,
                 max:selectedVidDurationSec,
                 step:parseInt(selectedVidDurationSec/100)
               });

             },
      error: function(jqXHR, textStatus, errorThrown) {
              $('#video-title').text(textStatus, + ' | ' + errorThrown);
              //Hide the loading spinner
              $('#spinner').hide();
      }
  });


    }
  }

  //listener for slide event to update the start time
  $('#slider-strttime').on('slide',function(slideEvt){
    if(slideEvt.value > 3600){
      var hr = parseInt(slideEvt.value/3600);
      var hrStr = '0' + hr.toString();

      var rem = hr%3600;

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
      var min = parseInt(slideEvt.value/60);
      var minStr = ''
      if(min < 10){
        minStr = '0' + min.toString();
      }
      else{
        minStr = min.toString();
      }
      var sec = (slideEvt.value)%(60);
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



  });

    //listener for slide event to update the duration
  $('#slider-duration').on('slide',function(slideEvt){
    var val = slideEvt.value;
    var valStr = '';
    if(val < 10){
      valStr = '0';
    }
    valStr+=val.toString();
    $('.slider-value-duration').text(valStr + ' secs');
  });


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


});
