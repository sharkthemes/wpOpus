jQuery(document).ready(function($) {

    $( '.wp-block-wpopus-header-search svg' ).on( 'click', function() {
        $( '.st-search-form' ).addClass( 'search-open' );
        $('.st-search-form input.search-field').focus();
    } );

    var searchClose = true;
    $('.st-search-form form').hover(function(){ 
        searchClose=false; 
    }, function(){ 
        searchClose=true; 
    });

    $('.st-search-form').on('click', function() { 
        if ( searchClose ) {
            $(this).toggleClass('search-open');
        }
    });

});
