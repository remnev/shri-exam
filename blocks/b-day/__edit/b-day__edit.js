$(function() {
	$('.b-day__edit').live('click', function(e) {
		var $trg = $(e.target),
			editObj,
			$editForm,
			month = ['январь', 'февраль', 'март', 'апрель', 'май', 'июнь',
					 'июль', 'август', 'сентябрь', 'октябрь', 'ноябрь', 'декабрь'],
			dayList = days.getStorage(),
			dateVal = $trg.closest('.b-day').find('.b-date__number .number').text(),
			monthVal = $trg.closest('.b-day').find('.b-date__number .month').text();

		if ($trg.is('.delete')) {
			for (var i = 0; i < dayList.length; i++) {
				if (dayList[i].date.number.number == dateVal
				&&  dayList[i].date.number.month == month.indexOf(monthVal)+1) {
						dayList.splice(i, 1);

						days.setStorage(dayList);
						days.buildDays(dayList);
						return;
				}
				
			}
		} else if ($trg.is('.edit')) {
			if (form.self.is(':visible')) {
				$('.b-menu__addDay').removeClass('b-linksWrapper__item_state_active');
				form.toggle();
			}

			$('.b-editDayForm').remove();
			$editForm = form.self.clone(false).removeClass('b-addDayForm')
										 .addClass('b-editDayForm')
										 .insertAfter($trg.closest('.b-day'))
										 .slideDown(100);

			for (var i = 0; i < dayList.length; i++) {
				if (dayList[i].date.number.number == dateVal
				&&  dayList[i].date.number.month == month.indexOf(monthVal)+1) {
						editObj = dayList[i];

						$editForm.find('.b-addDayForm__date').val(editObj.date.number.number+'.'+editObj.date.number.month+'.'+(new Date).getFullYear()).end()
								 .find('.b-addDayForm__timeStartHour1').val(editObj.lectures[0].time.start.h).end()
								 .find('.b-addDayForm__timeStartMin1').val(editObj.lectures[0].time.start.m).end()
								 .find('.b-addDayForm__timeStartHour2').val(editObj.lectures[1].time.start.h).end()
								 .find('.b-addDayForm__timeStartMin2').val(editObj.lectures[1].time.start.m).end()
								 .find('.b-addDayForm__timeEndHour1').val(editObj.lectures[0].time.end.h).end()
								 .find('.b-addDayForm__timeEndMin1').val(editObj.lectures[0].time.end.m).end()
								 .find('.b-addDayForm__timeEndHour2').val(editObj.lectures[1].time.end.h).end()
								 .find('.b-addDayForm__timeEndMin2').val(editObj.lectures[1].time.end.m).end()
								 .find('.b-addDayForm__topic1').val(editObj.lectures[0].topics[0].text).end()
								 .find('.b-addDayForm__topic2').val(editObj.lectures[1].topics[0].text).end()
								 .find('.b-addDayForm__pdf1').val(editObj.lectures[0].topics[0].pdf).end()
								 .find('.b-addDayForm__pdf2').val(editObj.lectures[1].topics[0].pdf).end()
								 .find('.b-addDayForm__club1').val(editObj.lectures[0].topics[0].href).end()
								 .find('.b-addDayForm__club2').val(editObj.lectures[1].topics[0].href).end()
								 .find('.b-addDayForm__video1').val(editObj.lectures[0].topics[0].video).end()
								 .find('.b-addDayForm__video2').val(editObj.lectures[1].topics[0].video).end()
								 .find('.b-addDayForm__lectorName1').val(editObj.lectures[0].lector.name).end()
								 .find('.b-addDayForm__lectorName2').val(editObj.lectures[1].lector.name).end()
								 .find('.b-addDayForm__lectorPage1').val(editObj.lectures[0].lector.href).end()
								 .find('.b-addDayForm__lectorPage2').val(editObj.lectures[1].lector.href).end()
								 .find('.b-addDayForm__lectorAva1').val(editObj.lectures[0].lector.src).end()
								 .find('.b-addDayForm__lectorAva2').val(editObj.lectures[1].lector.src)
						return;
				}
				
			}
		}
	});

	$('.b-editDayForm .cancel').live('click', function(e) {
		$(this).closest('.b-editDayForm').remove();
	});

	$('.b-editDayForm .ok').live('click', function(e) {
		var form = $(this).closest('.b-editDayForm'),
			dayList = days.getStorage(),
			dayObj,
			dateVal = form.find('.b-addDayForm__date').val().split('.')[0],
			monthVal = form.find('.b-addDayForm__date').val().split('.')[1];

		if (form.find('.b-addDayForm__date').val() == '') {
			$('.b-editDayForm .cancel').click();
			return;
		}

		dayObj = {
					date: {
							number: {
									month: monthVal || '',
									number: form.find('.b-addDayForm__date').val().split('.')[0] || ''
								},
							text: daysOfWeek[(new Date(form.find('.b-addDayForm__date').val().split('.')[2], monthVal-1, dateVal).getDay())] || ''
						},
					lectures: [
								{
									time: {
										start: { h: form.find('.b-addDayForm__timeStartHour1').val(), m: form.find('.b-addDayForm__timeStartMin1').val() },
										end: { h: form.find('.b-addDayForm__timeEndHour1').val(), m: form.find('.b-addDayForm__timeEndMin1').val() }
									},
									topics: [
										{
											href: form.find('.b-addDayForm__club1').val(),
											text: form.find('.b-addDayForm__topic1').val(),
											pdf: form.find('.b-addDayForm__pdf1').val(),
											video: form.find('.b-addDayForm__video1').val()
										}
									],
									lector: {
										src: form.find('.b-addDayForm__lectorAva1').val(),
										href: form.find('.b-addDayForm__lectorPage1').val(),
										name: form.find('.b-addDayForm__lectorName1').val()
									}
								},
								{
									time: {
										start: { h: form.find('.b-addDayForm__timeStartHour2').val(), m: form.find('.b-addDayForm__timeStartMin2').val() },
										end: { h: form.find('.b-addDayForm__timeEndHour2').val(), m: form.find('.b-addDayForm__timeEndMin2').val() }
									},
									topics: [
										{
											href: form.find('.b-addDayForm__club2').val(),
											text: form.find('.b-addDayForm__topic2').val(),
											pdf: form.find('.b-addDayForm__pdf2').val(),
											video: form.find('.b-addDayForm__video2').val()
										}
									],
									lector: {
										src: form.find('.b-addDayForm__lectorAva2').val(),
										href: form.find('.b-addDayForm__lectorPage2').val(),
										name: form.find('.b-addDayForm__lectorName2').val()
									}
								}
					]
		};

		for (var i = 0; i < dayList.length; i++) {
			if (dayList[i].date.number.number == dateVal
			&&  dayList[i].date.number.month == monthVal) {
					dayList.splice(i, 1);

					days.setStorage(dayList);
					break;
			}
		}

		days.addToStorage(dayObj);
		days.buildDays(days.getStorage());
		form.remove();
	});
});