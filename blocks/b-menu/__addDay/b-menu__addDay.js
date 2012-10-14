$(function() {
	$('.b-menu__addDay').click(function(e) {
		if (form.self.is(':visible'))
			return;
		form.toggle();
		$('.b-editDayForm').remove();
	});
});