$(function() {
	$('.b-impExpForm .cancel').bind('click', function(e) {
		$('.b-impExpForm').slideUp(100);
		$('.b-menu__impExp').removeClass('b-linksWrapper__item_state_active');
	});

	$('.b-impExpForm .ok').bind('click', function(e) {
		var schemaText = $('.b-impExpForm__field textarea').val(),
			schemaObj;

		try {
			schemaObj = JSON.parse(schemaText);
		} catch(e) {
			console.log(e);
			return;
		}

		days.setStorage(schemaObj);
		days.buildDays(schemaObj);

		$('.b-impExpForm').slideUp(100);
		$('.b-menu__impExp').removeClass('b-linksWrapper__item_state_active');
	});
});