$(function() {
	$('.b-menu__addDay').click(function(e) {
		if (form.self.is(':visible'))
			return;

		if ($('.b-impExpForm').is(':visible')) {
			$('.b-impExpForm').hide();
		}

		form.toggle();
		$('.b-editDayForm').remove();
	});
});