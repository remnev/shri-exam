var $bDays,
	$bWorkDay,
	$bWeekend,

	days = {
		init: function() {
			var schema = this.getStorage();

			$bDays = $('.b-days');
			$bWorkDay = $('.b-templates__work');
			$bWeekend = $('.b-templates__weekend');

			this.buildDays(schema);
		},
		setStorage: function(data) {
			localStorage.setItem('schema', JSON.stringify(data));
		},
		getStorage: function() {
			return JSON.parse(localStorage.getItem('schema')) || [];
		},
		addToStorage: function(day) {
			var schema = this.getStorage();

			schema.push(day);
			schema.sort(function(a, b) {
				var aDate = new Date((new Date).getFullYear(), a.date.number.month-1, a.date.number.number),
					bDate = new Date((new Date).getFullYear(), b.date.number.month-1, b.date.number.number);

				return aDate - bDate;
			});

			this.setStorage(schema);
		},
		buildDays: function(schema) {
			var $dayCur,
				dayType;

			for (var i = 0; i < schema.length; i++) {
				dayType = schema[i].date.text;
				$dayCur = buildDay(schema[i], dayType);
				$bDays.append($dayCur);
			}

			function buildDay (block, dayType) {
				var $clone,
					month = ['январь', 'февраль', 'март', 'апрель', 'май', 'июнь',
							 'июль', 'август', 'сентябрь', 'октябрь', 'ноябрь', 'декабрь'];

				if (dayType == 'суббота') {
					$clone = $bWeekend.clone();
				} else {
					$clone = $bWorkDay.clone();
				}

				  $clone.find('.b-date__number div.month').text(month[block.date.number.month-1]).end()
						.find('.b-date__number div.number').text(block.date.number.number).end()
						.find('.b-date__text').text(block.date.text).end()
						.find('.b-lecture__time:eq(0)').html(block.lectures[0].time.start.h+'<sup>'+block.lectures[0].time.start.m+'</sup> — '+
															 block.lectures[0].time.end.h+'<sup>'+block.lectures[0].time.end.m+'</sup>').end()
						.find('.b-lecture__time:eq(1)').html(block.lectures[1].time.start.h+'<sup>'+block.lectures[1].time.start.m+'</sup> — '+
															 block.lectures[1].time.end.h+'<sup>'+block.lectures[1].time.end.m+'</sup>').end()
						.find('.b-lecture__topic:eq(0)').html( buildTopic(block.lectures[0].topics) ).end()
						.find('.b-lecture__topic:eq(1)').html( buildTopic(block.lectures[1].topics) ).end()
						.find('.b-lecture__lector:eq(0)').html('<img src="'+block.lectures[0].lector.src+'"> '+
																'<a href="'+block.lectures[0].lector.href+'">'+block.lectures[0].lector.name+'</a>').end()
						.find('.b-lecture__lector:eq(1)').html('<img src="'+block.lectures[1].lector.src+'"> '+
																'<a href="'+block.lectures[1].lector.href+'">'+block.lectures[1].lector.name+'</a>');
				return $clone;
			}

			function buildTopic (topics) {
				var href,
					text,
					pdf,
					video,
					resultHtml = '';

				for (var i = 0; i < topics.length; i++) {
					href = topics[i].href;
					text = topics[i].text;
					pdf = topics[i].pdf;
					video = topics[i].video;

					resultHtml += '<a href="'+href+'">'+text+'</a> <sup class="green"><a href="'+pdf+'">pdf</a></sup> <sup class="brown"><a href="'+video+'">video</a></sup>';
					if (i != topics.length-1) resultHtml += ', ';
				}
				return resultHtml;
			}
		},
		schema: [
					{
						date: {
								number: {
										month: 10,
										number: 13
									},
								text: 'суббота'
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
					},
					{
						date: {
								number: {
										month: 10,
										number: 23
									},
								text: 'вторник'
							},
						lectures: [
									{
										time: {
											start: { h: '19', m: '00' },
											end: { h: '20', m: '00' }
										},
										topics: [
											{
												href: 'yandex.ru',
												text: 'Командная строка Unix',
												pdf: 'yandex.ru',
												video: 'yandex.ru'
											}
										],
										lector: {
											src: 'http://avatars.yandex.net/get-avatar/81394922/b6273a6746952143e7df9325f87d2c55.5214-small',
											href: 'yandex.ru',
											name: 'Михаил Давыдов'
										}
									},
									{
										time: {
											start: { h: '20', m: '00' },
											end: { h: '21', m: '00' }
										},
										topics: [
											{
												href: 'yandex.ru',
												text: 'Безопасность веб-приложений',
												pdf: 'yandex.ru',
												video: 'yandex.ru'
											}
										],
										lector: {
											src: 'http://avatars.yandex.net/get-avatar/169749019/d0eec1fce57abed45a527ef3b0a1abf1.6412-small',
											href: 'yandex.ru',
											name: 'Тарас Иващенко'
										}
									}
						]
					}
				]
	};
$(function() {
	days.init();
});