(function($) {
	
	jQuery(document).ready(function($){

	/*  ==========================================================================
		Custom Events
		========================================================================== */
		//Add mobile navigation
		$( "#menu-toggle" ).on('click', function() {
			$( "#allcontent" ).toggleClass( "open" ); 	
	  	});	

		
		
	/*  ==========================================================================
		jQuery Plugins
		========================================================================== */		

	});
		
	$(window).on( 'load', function() {					
		
		//Custom height of home slider
		var viewportHeight = $(window).height();				
		jQuery( ".bh" ).css( "height", viewportHeight);
		
		
		jQuery(window).resize(function(){
			var viewportHeight = $(window).height();			
			jQuery( ".bh" ).css( "height", viewportHeight);
			
		});
		
	});
	

})(jQuery);
