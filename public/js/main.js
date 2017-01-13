jQuery(document).ready(function(){

  //youtube url text field
  var ytUrlText = jQuery('#yturl')[0];
  //next button for first section
  var nextBtnSec1 = jQuery('#sec1-next');

  //Section 1
  var sec1 = jQuery('#sec1');
  var sec2 = jQuery('#sec2');

  //The selected Youtube URL
  var selectedVidUrl = '';



  //function to load the second screen with the video id, and
  var loadSecondScreen  = function() {

    var videoId = '';
    videoId = getYtId(selectedVidUrl);
    console.log(videoId);
    if(videoId === undefined | videoId === null |videoId == ''){
      alert('URL is invalid');
    }
  }




  //click listener for next button of first section
  nextBtnSec1.click(function(){
    if(ytUrlText.value) {
      //destroy the popover
      $('#yturl').popover('destroy');

      selectedVidUrl = ytUrlText.value;

      sec1.slideUp('fast');
      sec2.slideDown('fast');

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


  function getYtId(url){
    var ID = '';
    url = url.replace(/(>|<)/gi,'').split(/(vi\/|v=|\/v\/|youtu\.be\/|\/embed\/)/);
    if(url[2] !== undefined) {
      ID = url[2].split(/[^0-9a-z_\-]/i);
      ID = ID[0];
    }
    else {
      ID = url;
    }
      return ID;
}


});
