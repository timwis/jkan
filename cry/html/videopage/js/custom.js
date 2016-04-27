/*
  * @package Cyprass
  * @subpackage Cyprass HTML
  * 
  * Template Scripts
  * Created by Themeturn
  
  1. Fixed header
  2. Site search
  3. Main slideshow
  4. Owl Carousel
      a. Testimonial
      b. Clients
      c. Team
  5. Back to top
  6. Skills
  7. BX slider
      a. Blog Slider
      b. Portfolio item slider
  8. Isotope
  9. Animation (wow)
  10. Flickr
  
*/


jQuery(function($) {
  "use strict";

  $.noConflict();
     $('.nav a').on('click', function(){ 
        if($('.navbar-toggle').css('display') !='none'){
            $(".navbar-toggle").trigger( "click" );
        }
    });

  
//  Navigation scrolling

      $('a.page-scroll').click(function() {
          if (location.pathname.replace(/^\//,'') == this.pathname.replace(/^\//,'') && location.hostname == this.hostname) {
            var target = $(this.hash);
            target = target.length ? target : $('[name=' + this.hash.slice(1) +']');
            if (target.length) {
              $('html,body').animate({
                scrollTop: target.offset().top - 40
              }, 900);
              return false;
            }
          }
        });


 
  // accordian
  $('.accordion-toggle').on('click', function(){
    $(this).closest('.panel-group').children().each(function(){
    $(this).find('>.panel-heading').removeClass('active');
     });

    $(this).closest('.panel-heading').toggleClass('active');
  });

 
 /* ----------------------------------------------------------- */
/*  BX slider
/* ----------------------------------------------------------- */

      //Portfolio item and blog slider
    
/*Smooth Scroll*/
      smoothScroll.init({
          speed: 400,
          easing: 'easeInQuad',
          offset:0,
          updateURL: true,
          callbackBefore: function ( toggle, anchor ) {},
          callbackAfter: function ( toggle, anchor ) {}
        }); 


  /* ----------------------------------------------------------- */
  /*  Main slideshow
  /* ----------------------------------------------------------- */

  $('#slider_part').carousel({
    pause: true,
    interval: 100000,
  });

  /* ----------------------------------------------------------- */
 /*ISotope Portfolio
 /* ----------------------------------------------------------- */   
    
      var $container = $('.portfolio-wrap');
      var $filter = $('#isotope-filter');
      // Initialize isotope 
      $container.isotope({
          filter: '*',
          layoutMode: 'fitRows',
          animationOptions: {
              duration: 750,
              easing: 'linear'
          }
      });
      // Filter items when filter link is clicked
      $filter.find('a').click(function () {
          var selector = $(this).attr('data-filter');
          $filter.find('a').removeClass('current');
          $(this).addClass('current');
          $container.isotope({
              filter: selector,
              animationOptions: {
                  animationDuration: 750,
                  easing: 'linear',
                  queue: false,
              }
          });
          return false;
      }); 


  // Portfolio Isotope
    
    
    var container = $('.portfolio-wrap'); 
    
      function splitColumns() { 
        var winWidth = $(window).width(), 
          columnNumb = 1;
        
        
        if (winWidth > 1024) {
          columnNumb = 4;
        } else if (winWidth > 900) {
          columnNumb = 2;
        } else if (winWidth > 479) {
          columnNumb = 2;
        } else if (winWidth < 479) {
          columnNumb = 1;
        }
        
        return columnNumb;
      }   
      
      function setColumns() { 
        var winWidth = $(window).width(), 
          columnNumb = splitColumns(), 
          postWidth = Math.floor(winWidth / columnNumb);
        
        container.find('.portfolio-box').each(function () { 
          $(this).css( { 
            width : postWidth + 'px' 
          });
        });
      }   
      
      function setProjects() { 
        setColumns();
        container.isotope('reLayout');
      }   
      
      container.imagesLoaded(function () { 
        setColumns();
      });
      
    
      $(window).bind('resize', function () { 
        setProjects();      
      });

   
   
   
   

  /* ----------------------------------------------------------- */
  /* Team Carousel
  /* ----------------------------------------------------------- */

  $("#owl-demo").owlCarousel({
  
  navigation : true, // Show next and prev buttons
  // navigationText: ["prev","next"], 
   navigationText: [
      "<i class='fa fa-angle-left'></i>",
      "<i class='fa fa-angle-right'></i>"
      ],
  slideSpeed : 300,
  paginationSpeed : 400,
  autoPlay: true,  
  items : 4,
  itemsDesktop:[1199,4],  
  itemsDesktopSmall:[979,3],  //As above.
  itemsTablet:[768,3],    //As above.
  // itemsTablet:[640,2],   
  itemsMobile:[479,1],    //As above
  goToFirst: true,    //Slide to first item if autoPlay reach end
  goToFirstSpeed:1000 
  });




    //Testimonial

    $("#testimonial-carousel").owlCarousel({
 
      navigation : true, // Show next and prev buttons
      slideSpeed : 600,
      pagination:false,
      singleItem:true
 
    });

    // Custom Navigation Events
    var owl = $("#testimonial-carousel");


    // Custom Navigation Events
    $(".next").click(function(){
      owl.trigger('owl.next');
    })
    $(".prev").click(function(){
      owl.trigger('owl.prev');
    })
    $(".play").click(function(){
      owl.trigger('owl.play',1000); //owl.play event accept autoPlay speed as second parameter
    })
    $(".stop").click(function(){
      owl.trigger('owl.stop');
    })
    

//Clients
//
    $("#client-carousel").owlCarousel({

      navigation : true, // Show next and prev buttons
      navigationText: ["<i class='fa fa-chevron-left'></i>", "<i class='fa fa-chevron-right'></i>"],
      slideSpeed : 400,
      pagination:false,
      items : 5,
      rewindNav: true,
      itemsDesktop : [1199,3],
      itemsDesktopSmall : [979,3],
      itemsTablet:[768,3],    //As above.
      // itemsMobile:[479,2],
      itemsMobile:[320,1],
      stopOnHover:true,
      autoPlay:true

    });


  /* ----------------------------------------------------------- */
  /* Team Carousel
  /* ----------------------------------------------------------- */

  $("#owl-blog").owlCarousel({
    autoPlay: true,  
    items : 4,
    itemsDesktop:[1199,4], 
    itemsDesktopSmall:[979,3],  //As above.
    itemsTablet:[768,2],    //As above.
    itemsMobile:[479,1],    //As above
    goToFirst: true,    //Slide to first item if autoPlay reach end
    goToFirstSpeed:1000, 
  
  });


//Counter 
  
   
    // jQuery(document).ready(function( $ ) {
        $('.counter').counterUp({
            delay: 100,
            time: 2000
        });
    // }); 

// prettyphoto

 $("a[data-rel^='prettyPhoto']").prettyPhoto();
 
    
 


/* ==============================================
Back To Top Button
=============================================== */  
 
  $(window).scroll(function () {
            if ($(this).scrollTop() > 50) {
                $('#back-top').fadeIn();
            } else {
                $('#back-top').fadeOut();
            }
        });
      // scroll body to 0px on click
      $('#back-top').click(function () {
          $('#back-top a').tooltip('hide');
          $('body,html').animate({
              scrollTop: 0
          }, 800);
          return false;
      });
      
      $('#back-top').tooltip('hide');




});