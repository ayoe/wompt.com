UI.once('init',function(){
	if(!$('#landing').get(0)) return;
	
	$('input#channel').autocomplete({source:'/rooms/search'});

	var form = $('#embed_form');
	form.find('input').keyup(updateCode);
	
	
	function updateCode(){
		var code = [
		'<iframe src="http://wompt.com/chat/',
			encodeURIComponent(form.find('#room_name').val()),
		'?iframe=1#c=',
			form.find('#color').val(),
		'" style="width:',
			form.find('#width').val(),
		,"; height:",
			form.find('#height').val(),
		,';" allowtransparency="true"></iframe>'
		,'<a href="http://wompt.com">Chat Powered by Wompt</a>'];
		$('#code').text(code.join(''));
	}
	updateCode();

	var slides = $('.slides .slide'),
		current = 0,
		buttons = $('#slide_buttons > a').get();
	
	buttons = buttons.map(function(b, i){
		var slide = $(slides.get(i));
		b = $(b);
		b.attr('href','#');
		b.click(function(e){
			show(i);
			e.preventDefault();
		});
		return b;
	});
	
	buttons[0].addClass('selected');

	function show(index){
		if(index == current) return;

		slides.each(function(i){
			var s = $(this),
			is_next = i == index,
			is_cur = i == current;
			
			buttons[i].toggleClass('selected', i == index);
			
			// add 'future' to position the coming slide off in the right place
			s.toggleClass('future', is_next)
			
			 // animate current slide to the default position
			 // make sure no slide is in the 'current' position
			.removeClass('current')
			
			// hide all slides except the one moving to the default position
			// -- this ensures a slide moving from default to 'current' moves
			//    invisibly from default to 'future' before being animated
			.toggleClass('hide', !is_cur); 
		});
		
		// Give the UI thread some time to begin the animation and apply the CSS changes
		Util.nextTick(function(){
			var next = $(slides.get(index));
			next.removeClass('hide');
			
			Util.nextTick(function(){
				next.removeClass('future').addClass('current');
			});
		});
		
		current = index;
	}
});


