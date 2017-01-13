jQuery(document).ready(function(){
  var ytUrlText = jQuery('#yturl')[0];
  var nextBtnSec1 = jQuery('#sec1-next');

  nextBtnSec1.click(function(){
    if(ytUrlText.value) {

      $('#yturl').popover('destroy');

    }
    else {
      $('#yturl').popover({
        title:'Empty URL',
        content:'Please paste Youtube URL',
        placement:'top'
      }).popover('show');
    }
  });




});
