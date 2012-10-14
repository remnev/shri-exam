$(function() {
	var $impExpForm = $('.b-impExpForm'),
		daysArr;

	$('.b-menu__impExp').click(function(e) {
		if ($impExpForm.is(':visible'))
			return;

		$('.b-editDayForm').remove();
		if (form.self.is(':visible')) {
			form.toggle();
		}

		daysArr = days.getStorage();
		$impExpForm.slideDown(100)
				   .find('textarea').text(JSON.stringify(daysArr));
	});
});