/*
* Call function for rotating text
*/

(function($){
    $.fn.rotate = function(params){
        return this.each(function(index, el){
            var defaults = {
                text : [],
                interval : 500
            };
            
            var options = $.extend({}, defaults, params);
            var i = 0;
            
            if(options.text.length){
                setInterval(function(){
                    i = i < options.text.length -1 ? ++i : 0;
                    $(el).fadeOut(function(){ 
                        $(this).text(options.text[i]).fadeIn();
                    });
                }, options.interval);
            }
        });
    };
})(jQuery);

/*
* cahnge able text & delay intervals
*/

$("#rotate").rotate({ 
    text : ['FLAT & CLEAN DESIGN', 'ONEPAGE PARALLAX', 'EASY TO CUSTOMIZE', '100% RESPONSIVE'], 
    interval : 5000  // in miliseconds
});