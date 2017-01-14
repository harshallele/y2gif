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
      url: "https://www.googleapis.com/youtube/v3/videos?id=" + videoId + "&key=AIzaSyCNEFLZTLyoR25zgHQxPMFCAvQtg3f8WF4&fields=items(snippet(title))&part=snippet",
      dataType: "jsonp",
      success: function(data){

               //Set the video title and the video source
               $('#video-title').text(data.items[0].snippet.title);
               var mainPlayer = videojs('main-video');
               mainPlayer.src({type: 'video/youtube', src: selectedVidUrl});
               $('#main-video').show();
               $('#main-video').width(sec2.width());
               $('#main-video').height((sec2.width()*9)/16);
               //Hide the loading spinner
               $('#spinner').hide();

             },
      error: function(jqXHR, textStatus, errorThrown) {
              $('#video-title').text(textStatus, + ' | ' + errorThrown);
              //Hide the loading spinner
              $('#spinner').hide();
      }
  });


    }
  }




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


});
