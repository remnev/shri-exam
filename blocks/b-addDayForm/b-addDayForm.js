$(function() {
	// .b-addDayForm__topbar .ok, .b-addDayForm__topbar .cancel
	var form = {
		date: $('.b-addDayForm__date'),

		timeStartHour1: $('.b-addDayForm__timeStartHour1'),
		timeStartMin1: $('.b-addDayForm__timeStartMin1'),
		topic1: $('.b-addDayForm__topic1'),
		pdf1: $('.b-addDayForm__pdf1'),
		timeEndtHour1: $('.b-addDayForm__timeEndHour1'),
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
		timeEndtHour2: $('.b-addDayForm__timeEndHour2'),
		timeEndMin2: $('.b-addDayForm__timeEndMin2'),
		club2: $('.b-addDayForm__club2'),
		video2: $('.b-addDayForm__video2'),
		lectorName2: $('.b-addDayForm__lectorName2'),
		lectorPage2: $('.b-addDayForm__lectorPage2'),
		lectorAva2: $('.b-addDayForm__lectorAva2')
	};
	$('.b-addDayForm__topbar .ok').click(function(e) {
		console.log(form);
	});
});