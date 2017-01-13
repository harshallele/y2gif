jQuery(document).ready(function(){

  //youtube url text field
  var ytUrlText = jQuery('#yturl')[0];
  //next button for first section
  var nextBtnSec1 = jQuery('#sec1-next');

  //Section 1
  var sec1 = jQuery('#sec1');
  var sec2 = jQuery('#sec2');






  var selectedVidUrl = '';


  //click listener for next button of first section
  nextBtnSec1.click(function(){
    if(ytUrlText.value) {
      //destroy the popover
      $('#yturl').popover('destroy');

      selectedVidUrl = ytUrlText.value;

      sec1.slideUp('fast');
      sec2.slideDown('fast');


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




});
