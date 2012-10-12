({
	block: 'b-page',
	title: 'Расписание занятий ШРИ',
	head: [
		{ elem: 'css', url: '_index.css' },
		{ block: 'i-jquery', elem: 'core' },
		{ elem: 'js', url: '_index.js' }
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
			block: 'b-days',
			content: [
		// 		{
		// 			block: 'b-day',
		// 			content: [
		// 				{
		// 					block: 'b-date',
		// 					content: ''
		// 				},
		// 				{
		// 					block: 'b-lectures',
		// 					content: [
		// 						{
		// 							block: 'b-lecture',
		// 							content: [
		// 								{
		// 									elem: 'b-lecture__time',
		// 									content: '19<span>00</span> — 20<span>00</span>'
		// 								},
		// 								{
		// 									elem: 'b-lecture__topic',
		// 									content: 'Общий цикл разработки'
		// 								}
		// 							]
		// 						}
		// 					]
		// 				}
		// 			]
		// 		}
			]
		},
		{
			block: 'b-footer',
			content: 'Сделано Юрием Ремневым с помощью БЭМ'
		}
	]
})
