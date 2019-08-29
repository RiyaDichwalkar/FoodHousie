$(document).ready(function(){
	//toggler-button
	$('.navbar-toggler').click(function(){
		
		$('.navbar-toggler').toggleClass('change')
		
	});
	//sticky nav-bar less padding
	$(window).scroll(function(){
		let position= $(this).scrollTop();
		
		if(position>=718)
			{
				$('.navbar').addClass('navbar-background');
				$('.navbar').addClass('fixed-top');
			}
		else{
			$('.navbar').removeClass('navbar-background');
				$('.navbar').removeClass('fixed-top');
		}
	});
	
	
	
	
	//smooth-scroll
	$('.nav-item a, .header-links, #back-to-top').click(function(link){
		link.preventDefault();
		
		let target= $(this).attr('href');
		//problem here is when you press many times on nav-items it will keep on scrolling to complete its querry, so it will continuosly scroll up and down as in order of your clicking.
		//here parameters are objects. solution adding stop() before animate i.e every time i'm clicking stop previous animations.
		
		$('html ,body ').stop().animate({
			scrollTop: $(target).offset().top -25
		},3000);
	})
	
	//backtotop
	
	$(window).scroll(function(){
		let position= $(this).scrollTop();
		
		if(position>=718)
			{
				$('#back-to-top').addClass('scrollTop');

			}
		else{
			$('#back-to-top').removeClass('scrollTop');
		}
	});
	
	
	
	
	
	
	
	
	
	
	
	
    //ripples
 try{
      $('#header').ripples({
  dropRadius: 5,
  perturbance: 0.0008, 
 });
} 
    catch(e){
        $('.error').show().text(e);
    }
//magnific popup
$('.parent-container').magnificPopup({
    delegate: 'a',//child items selector, by clicking it popup will open
    type: 'image',
    
    gallery:{
        enabled:true
    
}
  });
    
    
});

