jQuery(document).ready(function(){

  //youtube url text field
  var ytUrlText = jQuery('#yturl')[0];
  //next button for first section
  var nextBtnSec1 = jQuery('#sec1-next');

  //click listener for next button of first section
  nextBtnSec1.click(function(){
    if(ytUrlText.value) {
      //destroy the popover
      $('#yturl').popover('destroy');

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
