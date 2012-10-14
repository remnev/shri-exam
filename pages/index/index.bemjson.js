({
	block: 'b-page',
	title: 'Расписание занятий ШРИ',
	head: [
		{ elem: 'css', url: '_index.css' },
		{ elem: 'css', url: 'http://code.jquery.com/ui/1.9.0/themes/base/jquery-ui.css' },
		{ block: 'i-jquery', elem: 'core' },
		{ elem: 'js', url: '_index.js' },
		{ elem: 'js', url: 'http://code.jquery.com/ui/1.9.0/jquery-ui.js' }
		
	],
	content: [
		{
			block: 'b-title',
			content: 'Расписание занятий ШРИ'
		},
		{
			block: 'b-menu',
			content: [
				{
					block: 'b-linksWrapper',
					tag: 'ul',
					content: [
						{ elem: 'item', tag: 'li', content: '<span>Занятия сегодня</span>' },
						{ elem: 'item', tag: 'li', content: '<span>Прошедшие занятия</span>' },
						{ elem: 'item', tag: 'li', content: '<span>Будущие занятия</span>' },
						{ elem: 'item', tag: 'li', content: '<span>Напечатать</span>' },
						{ elem: 'item', tag: 'li', content: '<span>Импорт/экспорт</span>' },
						{ elem: 'item', tag: 'li', content: '<span>Добавить занятие</span>' }
					]
				}
			]
		},
		{
			block: 'b-addDayForm',
			content: [
				{
					elem: 'topbar',
					content: '<span>Дата</span><input class="b-addDayForm__date" type="text" tabindex="1" placeholder="d.m.yyyy"><a href="#" tabindex="50" class="ok">Ок</a><a href="#" class="cancel">Отмена</a>'
				},
				{
					elem: 'lecture',
					// govnocode mode enable, TODO: rewrite this!
					content: [
						'<div>Время&nbsp;<span>c</span><input class="b-addDayForm__timeStartHour1 short" type="text" tabindex="2">ч<input class="b-addDayForm__timeStartMin1 short" type="text" tabindex="3">мин\
						&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Тема&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<input class="b-addDayForm__topic1 long" type="text" tabindex="4">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;pdf&nbsp;&nbsp;&nbsp;<input class="b-addDayForm__pdf1 long" type="text" tabindex="5"></div>',
						'<div>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;по</span><input class="b-addDayForm__timeEndHour1 short" type="text" tabindex="6">ч<input class="b-addDayForm__timeEndHour1 short" type="text" tabindex="7">мин&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;\
						<span style="display: inline-block; width: 50px;">Ссылка на клуб</span><input class="b-addDayForm__club1 long" type="text" tabindex="8">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;video<input class="b-addDayForm__video1 long" type="text" tabindex="9"></div>',
						'<div><span style="display: inline-block; width: 50px;">Имя лектора</span><input class="b-addDayForm__lectorName1 middle" type="text" tabindex="10">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span style="display: inline-block; width: 58px;">Ссылка на стр-цу</span><input class="b-addDayForm__lectorPage1 middle" type="text" tabindex="11">\
						&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span style="display: inline-block; width: 50px;">Ссылка на аву</span><input class="b-addDayForm__lectorAva1 middle" type="text" tabindex="12"></div>'
					]
					// govnocode mode disable
				},
				{
					elem: 'lecture',
					// govnocode mode enable, TODO: rewrite this!
					content: [
						'<div>Время&nbsp;<span>c</span><input class="b-addDayForm__timeStartHour2 short" type="text" tabindex="2">ч<input class="b-addDayForm__timeStartMin2 short" type="text" tabindex="3">мин\
						&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Тема&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<input class="b-addDayForm__topic2 long" type="text" tabindex="4">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;pdf&nbsp;&nbsp;&nbsp;<input class="b-addDayForm__pdf2 long" type="text" tabindex="5"></div>',
						'<div>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;по</span><input class="b-addDayForm__timeEndHour2 short" type="text" tabindex="6">ч<input class="b-addDayForm__timeEndHour2 short" type="text" tabindex="7">мин&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;\
						<span style="display: inline-block; width: 50px;">Ссылка на клуб</span><input class="b-addDayForm__club2 long" type="text" tabindex="8">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;video<input class="b-addDayForm__video2 long" type="text" tabindex="9"></div>',
						'<div><span style="display: inline-block; width: 50px;">Имя лектора</span><input class="b-addDayForm__lectorName2 middle" type="text" tabindex="10">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span style="display: inline-block; width: 58px;">Ссылка на стр-цу</span><input class="b-addDayForm__lectorPage2 middle" type="text" tabindex="11">\
						&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span style="display: inline-block; width: 50px;">Ссылка на аву</span><input class="b-addDayForm__lectorAva2 middle" type="text" tabindex="12"></div>'
					]
					// govnocode mode disable
				}
			]
		},
		{
			block: 'b-days',
			content: [
				// {
				// 	block: 'b-day',
				// 	content: [
				// 		{
				// 			block: 'b-date',
				// 			mix: [{ block: 'b-day', elem: 'date' }],
				// 			content: [
				// 				{
				// 					elem: 'number',
				// 					content: '<div class="month">октябрь</div><div class="number">6</div>'
				// 				},
				// 				{
				// 					elem: 'text',
				// 					content: 'вторник'
				// 				}
				// 			]
				// 		},
				// 		{
				// 			block: 'b-lectures',
				// 			content: [
				// 				{
				// 					block: 'b-lecture',
				// 					mix: [{ block: 'b-lectures', elem: 'lecture' }],
				// 					mods : { bottomLine : 'true' },
				// 					content: [
				// 						{
				// 							elem: 'time',
				// 							content: '19<sup>00</sup> — 20<sup>00</sup>'
				// 						},
				// 						{
				// 							elem: 'topic',
				// 							content: '<a href="yandex.ru">Общий цикл разработки</a> <sup class="green">pdf</sup><sup class="brown">video</sup>'
				// 						},
				// 						{
				// 							elem: 'lector',
				// 							content: '<img src="http://avatars.yandex.net/get-avatar/22422407/1f79b506bec259f72732e534813b6e52.6609-small"> <a href="yandex.ru">Михаил Трошев</a>'
				// 						}
				// 					]
				// 				},
				// 				{
				// 					block: 'b-lecture',
				// 					mix: [{ block: 'b-lectures', elem: 'lecture' }],
				// 					content: [
				// 						{
				// 							elem: 'time',
				// 							content: '20<sup>00</sup> — 21<sup>00</sup>'
				// 						},
				// 						{
				// 							elem: 'topic',
				// 							content: '<a href="yandex.ru">Task tracker</a> <sup class="green">pdf</sup><sup class="brown">video</sup>, \
				// 									<a href="yandex.ru">Wiki</a> <sup class="green">pdf</sup><sup class="brown">video</sup>'
				// 						},
				// 						{
				// 							elem: 'lector',
				// 							content: '<img src="http://avatars.static.yandex.net/silhouette/male-small"> <a href="yandex.ru">Георгий Мостоловица</a>'
				// 						}
				// 					]
				// 				}
				// 			]
				// 		}
				// 	]
				// },
				// {
				// 	block: 'b-day',
				// 	content: [
				// 		{
				// 			block: 'b-date',
				// 			mix: [{ block: 'b-day', elem: 'date' }],
				// 			content: [
				// 				{
				// 					elem: 'number',
				// 					content: '<div class="month">октябрь</div><div class="number">8</div>'
				// 				},
				// 				{
				// 					elem: 'text',
				// 					content: 'четверг'
				// 				}
				// 			]
				// 		},
				// 		{
				// 			block: 'b-lectures',
				// 			content: [
				// 				{
				// 					block: 'b-lecture',
				// 					mix: [{ block: 'b-lectures', elem: 'lecture' }],
				// 					mods : { bottomLine : 'true' },
				// 					content: [
				// 						{
				// 							elem: 'time',
				// 							content: '19<sup>00</sup> — 20<sup>00</sup>'
				// 						},
				// 						{
				// 							elem: 'topic',
				// 							content: '<a href="yandex.ru">Командная строка Unix</a> <sup class="green">pdf</sup><sup class="brown">video</sup>'
				// 						},
				// 						{
				// 							elem: 'lector',
				// 							content: '<img src="http://avatars.yandex.net/get-avatar/1631268/d1475c0925815cdad8cbe33244d56097.6305-small"> <a href="yandex.ru">Виктор Ашик</a>'
				// 						}
				// 					]
				// 				},
				// 				{
				// 					block: 'b-lecture',
				// 					mix: [{ block: 'b-lectures', elem: 'lecture' }],
				// 					content: [
				// 						{
				// 							elem: 'time',
				// 							content: '20<sup>00</sup> — 21<sup>00</sup>'
				// 						},
				// 						{
				// 							elem: 'topic',
				// 							content: '<a href="yandex.ru">Редакторы кода</a> <sup class="green">pdf</sup><sup class="brown">video</sup>'
				// 						},
				// 						{
				// 							elem: 'lector',
				// 							content: '<img src="http://avatars.yandex.net/get-avatar/44758029/708e5235c5aa2a7432347bc80eee1713.6509-small"> <a href="yandex.ru">Георгий Мостоловица</a>'
				// 						}
				// 					]
				// 				}
				// 			]
				// 		}
				// 	]
				// },
				// {
				// 	block: 'b-day',
				// 	mods: { saturday: 'true' },
				// 	content: [
				// 		{
				// 			block: 'b-date',
				// 			mix: [{ block: 'b-day', elem: 'date' }],
				// 			content: [
				// 				{
				// 					elem: 'number',
				// 					content: '<div class="month">октябрь</div><div class="number">10</div>'
				// 				},
				// 				{
				// 					elem: 'text',
				// 					content: 'суббота'
				// 				}
				// 			]
				// 		},
				// 		{
				// 			block: 'b-lectures',
				// 			content: [
				// 				{
				// 					block: 'b-lecture',
				// 					mix: [{ block: 'b-lectures', elem: 'lecture' }],
				// 					mods : { bottomLine : 'true' },
				// 					content: [
				// 						{
				// 							elem: 'time',
				// 							content: '19<sup>00</sup> — 20<sup>00</sup>'
				// 						},
				// 						{
				// 							elem: 'topic',
				// 							content: '<a href="yandex.ru">Кеширование на клиенте и сервере</a> <sup class="green">pdf</sup><sup class="brown">video</sup>'
				// 						},
				// 						{
				// 							elem: 'lector',
				// 							content: '<img src="http://avatars.yandex.net/get-avatar/45030666/4c4589e94bb45d46003da1d54e446684.6411-small"> <a href="yandex.ru">Егор Львовский</a>'
				// 						}
				// 					]
				// 				},
				// 				{
				// 					block: 'b-lecture',
				// 					mix: [{ block: 'b-lectures', elem: 'lecture' }],
				// 					content: [
				// 						{
				// 							elem: 'time',
				// 							content: '20<sup>00</sup> — 21<sup>00</sup>'
				// 						},
				// 						{
				// 							elem: 'topic',
				// 							content: '<a href="yandex.ru">CSS</a> <sup class="green">pdf</sup><sup class="brown">video</sup>'
				// 						},
				// 						{
				// 							elem: 'lector',
				// 							content: '<img src="http://avatars.yandex.net/get-avatar/81394922/b6273a6746952143e7df9325f87d2c55.5214-small"> <a href="yandex.ru">Иван Карев</a>'
				// 						}
				// 					]
				// 				}
				// 			]
				// 		}
				// 	]
				// }
			]
		},
		{
			block: 'b-footer',
			content: 'Сделано Юрием Ремневым с помощью БЭМ'
		},
		{
			block: 'b-templates',
			content: [
				{
					elem: 'work',
					content: [
						{
							block: 'b-day',
							content: [
								{
									block: 'b-date',
									mix: [{ block: 'b-day', elem: 'date' }],
									content: [
										{
											elem: 'number',
											content: '<div class="month">октябрь</div><div class="number">8</div>'
										},
										{
											elem: 'text',
											content: 'четверг'
										}
									]
								},
								{
									block: 'b-lectures',
									content: [
										{
											block: 'b-lecture',
											mix: [{ block: 'b-lectures', elem: 'lecture' }],
											mods : { bottomLine : 'true' },
											content: [
												{
													elem: 'time',
													content: '19<sup>00</sup> — 20<sup>00</sup>'
												},
												{
													elem: 'topic',
													content: '<a href="yandex.ru">Командная строка Unix</a> <sup class="green">pdf</sup><sup class="brown">video</sup>'
												},
												{
													elem: 'lector',
													content: '<img src="http://avatars.yandex.net/get-avatar/1631268/d1475c0925815cdad8cbe33244d56097.6305-small"> <a href="yandex.ru">Виктор Ашик</a>'
												}
											]
										},
										{
											block: 'b-lecture',
											mix: [{ block: 'b-lectures', elem: 'lecture' }],
											content: [
												{
													elem: 'time',
													content: '20<sup>00</sup> — 21<sup>00</sup>'
												},
												{
													elem: 'topic',
													content: '<a href="yandex.ru">Редакторы кода</a> <sup class="green">pdf</sup><sup class="brown">video</sup>'
												},
												{
													elem: 'lector',
													content: '<img src="http://avatars.yandex.net/get-avatar/44758029/708e5235c5aa2a7432347bc80eee1713.6509-small"> <a href="yandex.ru">Георгий Мостоловица</a>'
												}
											]
										}
									]
								}
							]
						}
					]
				},
				{
					elem: 'weekend',
					content: [
						{
							block: 'b-day',
							mods: { saturday: 'true' },
							content: [
								{
									block: 'b-date',
									mix: [{ block: 'b-day', elem: 'date' }],
									content: [
										{
											elem: 'number',
											content: '<div class="month">октябрь</div><div class="number">10</div>'
										},
										{
											elem: 'text',
											content: 'суббота'
										}
									]
								},
								{
									block: 'b-lectures',
									content: [
										{
											block: 'b-lecture',
											mix: [{ block: 'b-lectures', elem: 'lecture' }],
											mods : { bottomLine : 'true' },
											content: [
												{
													elem: 'time',
													content: '19<sup>00</sup> — 20<sup>00</sup>'
												},
												{
													elem: 'topic',
													content: '<a href="yandex.ru">Кеширование на клиенте и сервере</a> <sup class="green">pdf</sup><sup class="brown">video</sup>'
												},
												{
													elem: 'lector',
													content: '<img src="http://avatars.yandex.net/get-avatar/45030666/4c4589e94bb45d46003da1d54e446684.6411-small"> <a href="yandex.ru">Егор Львовский</a>'
												}
											]
										},
										{
											block: 'b-lecture',
											mix: [{ block: 'b-lectures', elem: 'lecture' }],
											content: [
												{
													elem: 'time',
													content: '20<sup>00</sup> — 21<sup>00</sup>'
												},
												{
													elem: 'topic',
													content: '<a href="yandex.ru">CSS</a> <sup class="green">pdf</sup><sup class="brown">video</sup>'
												},
												{
													elem: 'lector',
													content: '<img src="http://avatars.yandex.net/get-avatar/81394922/b6273a6746952143e7df9325f87d2c55.5214-small"> <a href="yandex.ru">Иван Карев</a>'
												}
											]
										}
									]
								}
							]
						}
					]
				}
			]
		}
	]
})
