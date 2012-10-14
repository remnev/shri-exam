var form = {};
$(function() {
	form = {
		date: $('.b-addDayForm__date').datepicker({ dateFormat: 'd.m.yy', onSelect: function() { form.timeStartHour1[0].focus() } }),

		timeStartHour1: $('.b-addDayForm__timeStartHour1'),
		timeStartMin1: $('.b-addDayForm__timeStartMin1'),
		topic1: $('.b-addDayForm__topic1'),
		pdf1: $('.b-addDayForm__pdf1'),
		timeEndHour1: $('.b-addDayForm__timeEndHour1'),
		timeEndMin1: $('.b-addDayForm__timeEndMin1'),
		club1: $('.b-addDayForm__club1'),
		video1: $('.b-addDayForm__video1'),
		lectorName1: $('.b-addDayForm__lectorName1'),
		lectorPage1: $('.b-addDayForm__lectorPage1'),
		lectorAva1: $('.b-addDayForm__lectorAva1'),

		timeStartHour2: $('.b-addDayForm__timeStartHour2'),
		timeStartMin2: $('.b-addDayForm__timeStartMin2'),
		topic2: $('.b-addDayForm__topic2'),
		pdf2: $('.b-addDayForm__pdf2'),
		timeEndHour2: $('.b-addDayForm__timeEndHour2'),
		timeEndMin2: $('.b-addDayForm__timeEndMin2'),
		club2: $('.b-addDayForm__club2'),
		video2: $('.b-addDayForm__video2'),
		lectorName2: $('.b-addDayForm__lectorName2'),
		lectorPage2: $('.b-addDayForm__lectorPage2'),
		lectorAva2: $('.b-addDayForm__lectorAva2'),

		self: $('.b-addDayForm'),
		toggle: function() {
			this.self.slideToggle(100)
				.find('input').each(function() { this.value = ''; });
		}
	},

	daysOfWeek = ['воскресенье', 'понедельник', 'вторник', 'среда', 'четверг', 'пятница', 'суббота'];

	$('.b-addDayForm__topbar .ok').live('click', function(e) {
		if (form.date.val() == '') {
			$('.b-addDayForm__topbar .cancel').click();
			return;
		}
		var dayObj = {
						date: {
								number: {
										month: form.date.val().split('.')[1] || '',
										number: form.date.val().split('.')[0] || ''
									},
								text: daysOfWeek[(new Date(form.date.val().split('.')[2], form.date.val().split('.')[1]-1, form.date.val().split('.')[0]).getDay())] || ''
							},
						lectures: [
									{
										time: {
											start: { h: form.timeStartHour1.val(), m: form.timeStartMin1.val() },
											end: { h: form.timeEndHour1.val(), m: form.timeEndMin1.val() }
										},
										topics: [
											{
												href: form.club1.val(),
												text: form.topic1.val(),
												pdf: form.pdf1.val(),
												video: form.video1.val()
											}
										],
										lector: {
											src: form.lectorAva1.val(),
											href: form.lectorPage1.val(),
											name: form.lectorName1.val()
										}
									},
									{
										time: {
											start: { h: form.timeStartHour2.val(), m: form.timeStartMin2.val() },
											end: { h: form.timeEndHour2.val(), m: form.timeEndMin2.val() }
										},
										topics: [
											{
												href: form.club2.val(),
												text: form.topic2.val(),
												pdf: form.pdf2.val(),
												video: form.video2.val()
											}
										],
										lector: {
											src: form.lectorAva2.val(),
											href: form.lectorPage2.val(),
											name: form.lectorName2.val()
										}
									}
						]
		};
		days.addToStorage(dayObj);
		days.buildDays(days.getStorage());
		form.toggle();
		$('.b-menu__addDay').removeClass('b-linksWrapper__item_state_active');
	});

	$('.b-addDayForm__topbar .cancel').live('click', function(e) {
		form.toggle();
		$('.b-menu__addDay').removeClass('b-linksWrapper__item_state_active');
	});
});