$(function() {
	// .b-addDayForm__topbar .ok, .b-addDayForm__topbar .cancel
	var form = {
		date: $('.b-addDayForm__date').datepicker({ dateFormat: 'd.m.yy' }),

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
	},

	days = ['воскресенье', 'понедельник', 'вторник', 'среда', 'четверг', 'пятница', 'суббота'];

	$('.b-addDayForm__topbar .ok').click(function(e) {
		var dayObj = {
						date: {
								number: {
										month: form.date.val().split('.')[1] || '',
										number: form.date.val().split('.')[0] || ''
									},
								text: days[(new Date(form.date.val().split('.')[2], form.date.val().split('.')[1]-1, form.date.val().split('.')[0]).getDay())] || ''
							},
						lectures: [
									{
										time: {
											start: { h: '01', m: '23' },
											end: { h: '12', m: '06' }
										},
										topics: [
											{
												href: 'yandex.ru',
												text: 'Общий цикл разработки',
												pdf: 'yandex.ru',
												video: 'yandex.ru'
											}
										],
										lector: {
											src: 'http://avatars.yandex.net/get-avatar/22422407/1f79b506bec259f72732e534813b6e52.6609-small',
											href: 'yandex.ru',
											name: 'Михаил Трошев'
										}
									},
									{
										time: {
											start: { h: '06', m: '10' },
											end: { h: '21', m: '38' }
										},
										topics: [
											{
												href: 'yandex.ru',
												text: 'Task tracker',
												pdf: 'yandex.ru',
												video: 'yandex.ru'
											},
											{
												href: 'yandex.ru',
												text: 'Wiki',
												pdf: 'yandex.ru',
												video: 'yandex.ru'
											}
										],
										lector: {
											src: 'http://avatars.yandex.net/get-avatar/1631268/d1475c0925815cdad8cbe33244d56097.6305-small',
											href: 'yandex.ru',
											name: 'Сергей Бережной'
										}
									}
						]
		};
		console.log(dayObj);
	});
});