$(function() {
	var $menuItems = $('.b-linksWrapper__item span');

	$menuItems.click(function(e) {
		var $trg = $(this);

		if ($trg.parent().is('.b-menu__print')) {
			return;
		};
		$trg.parent().addClass('b-linksWrapper__item_state_active')
					 .siblings().removeClass('b-linksWrapper__item_state_active');
	}).hover(function(e) {
		var $trg = $(this);

		$trg.parent().toggleClass('b-linksWrapper__item_state_hover');
	});
})