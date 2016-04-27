
  /***************** Waypoints ******************/

$(document).ready(function() {

  $('.wp1').waypoint(function() {
    $('.wp1').addClass('animated fadeInLeft');
  }, {
    offset: '75%'
  });
   $('.wp8').waypoint(function() {
    $('.wp8').addClass('animated fadeInLeft');
  }, {
    offset: '75%'
  });
  $('.wp2').waypoint(function() {
    $('.wp2').addClass('animated fadeInUp');
  }, {
    offset: '75%'
  });
  $('.wp3').waypoint(function() {
    $('.wp3').addClass('animated fadeInDown');
  }, {
    offset: '55%'
  });
  $('.wp4').waypoint(function() {
    $('.wp4').addClass('animated fadeInDown');
  }, {
    offset: '75%'
  });
  $('.wp5').waypoint(function() {
    $('.wp5').addClass('animated fadeInUp');
  }, {
    offset: '75%'
  });
  $('.wp6').waypoint(function() {
    $('.wp6').addClass('animated fadeInDown');
  }, {
    offset: '75%'
  });
    $('.wp7').waypoint(function() {
    $('.wp7').addClass('animated fadeInRight');
  }, {
    offset: '75%'
  });

});



  $(document).ready(function() {
  var nice = $("html").niceScroll();  // The document page (body)
    $("#boxscroll").niceScroll({touchbehavior:true}); // First scrollable DIV
  });



      $( function() {        
        $( '#cbp-qtrotator' ).cbpQTRotator();
      } );

  $(function(){
    $('#Grid').mixitup();
});


  $(document).ready(function() {

  $('.image-popup-no-margins').magnificPopup({type:'image'});

});


        // Set options
        var options = {
            offset: '#showHere',
            classes: {
                clone:   'banner--clone',
                stick:   'banner--stick',
                unstick: 'banner--unstick'
            }
        };

        // Initialise with options
        var banner = new Headhesive('.banner', options);

        // Headhesive destroy
        // banner.destroy();


$('.parallax-back').stellar();
$('.header-parallax').stellar();


    $(function(){

      $.stellar({

        horizontalScrolling: false,

        verticalOffset: 40

      });

    });
