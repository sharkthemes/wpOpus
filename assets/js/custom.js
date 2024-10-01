/*------------------------------------------------
            PRELOADER
------------------------------------------------*/
window.onload = function() {
    var loader_container = jQuery('#wpopus-preload');
    var loader = jQuery('#wpopus-preload .preload-img');
    loader_container.fadeOut();
    loader.fadeOut('slow');
};

jQuery(document).ready(function ($) {

    // check for header search
    var hasHeaderSearch = $('body').find(".wp-block-wpopus-header-search");
    if (0 == hasHeaderSearch.length) {
        $(".st-search-form").remove();
    }

    // back to top
    $(window).on('scroll', function() {
        if ($(this).scrollTop() > 1) {
            $("#wpopus-backtotop").css({bottom:"10%"});
        } 
        else {
            $("#wpopus-backtotop").css({bottom:"-200px"});
        }
    });

    $("#wpopus-backtotop").on('click', function() {
        $('html, body').animate({scrollTop: '0px'}, 800);
        return false;
    });

});
