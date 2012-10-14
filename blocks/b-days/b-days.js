var $bDays,
	$bWorkDay,
	$bWeekend,

	days = {
		init: function() {
			var schema = this.getStorage();

			if (schema.length == 0) {
				$.getJSON('../schema/schema.js', function(data) {
					days.setStorage(data);
					days.buildDays(data);
				});
			}

			$bDays = $('.b-days');
			$bWorkDay = $('.b-templates__work').children('.b-day');
			$bWeekend = $('.b-templates__weekend').children('.b-day');

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

			$bDays.empty();
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
						.find('.b-lecture__time:eq(0)').html(block.lectures[0].time.start.h ? (block.lectures[0].time.start.h+'<sup>'+block.lectures[0].time.start.m+'</sup> — '+
															 block.lectures[0].time.end.h+'<sup>'+block.lectures[0].time.end.m+'</sup>') : '').end()
						.find('.b-lecture__time:eq(1)').html(block.lectures[1].time.start.h ? (block.lectures[1].time.start.h+'<sup>'+block.lectures[1].time.start.m+'</sup> — '+
															 block.lectures[1].time.end.h+'<sup>'+block.lectures[1].time.end.m+'</sup>') : '').end()
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

					resultHtml += text ? '<a href="'+href+'">'+text+'</a> '+(pdf ? '<sup class="green"><a href="'+pdf+'">pdf</a></sup> ' : '')+(video ? '<sup class="brown"><a href="'+video+'">video</a></sup>' : '')
									   : '';
					if (i != topics.length-1) resultHtml += ', ';
				}
				return resultHtml;
			}
		}
	};
$(function() {
	days.init();
});