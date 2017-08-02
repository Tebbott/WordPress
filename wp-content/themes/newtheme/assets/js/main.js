(function($) {
	
	jQuery(document).ready(function($){

	/*  ==========================================================================
		Custom Events
		========================================================================== */
		//Add mobile navigation
		$( "#mobile-nav-toggle" ).on('click', function() {
			$( "#allcontent, #side-navigation" ).toggleClass( "selected" );
			$( "#mobile-nav-toggle" ).toggleClass( "fa-navicon" );
			$( "#mobile-nav-toggle" ).toggleClass( "fa-times" );	 	
	  	});	

		
		
	/*  ==========================================================================
		jQuery Plugins
		========================================================================== */		

	});
		
	$(window).on( 'load', function() {					
		
		//Custom height of home slider
		var viewportHeight = $(window).height();				
		jQuery( "#home-slider .slides li" ).css( "height", viewportHeight);
		
		
		jQuery(window).resize(function(){
			var viewportHeight = $(window).height();			
			jQuery( "#home-slider .slides li" ).css( "height", viewportHeight);
			
		});
		
	});
	

})(jQuery);
