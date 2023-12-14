
(function($) {
  /*
   * ページ内見出しナビゲーション
	 */
	$.fn.stickyNavigator = function(opts) {

		// 引数に値が存在する場合、デフォルト値を上書きする
		var settings = $.extend({}, $.fn.stickyNavigator.defaults, opts);
		
		var self = $(this);

		var targets = $(settings.wrapselector).find(settings.targetselector);
		if (self.length === 0 || targets.length === 0) {
			return;
		}

		var navigationMenu = [
			'<ul>',
			targets.map(function() {
				var target = $(this),
					text = target.text();
				var num = Math.floor( Math.random() * 99999999 );
				var href = 'js-nav-'+num;
				target.addClass('js-nav');
				target.addClass(href);
				target.data('num', num);
				var clazz = 'nav-'+target[0].tagName.toLowerCase();
			  clazz = clazz + ' nav-'+num;
				return '<li class="'+clazz+'"><a href="#" data-href=".'+href+'">' + $('<dummy>').text(text).html() + '</li>';
			}).get().join(''),
			'</ul>'
		].join('');

		self.append(navigationMenu);
		
		self.find('li>a').click(function(e) {
			var a = $(this),
				href = a.data('href'),
				to = $(href);
			e.preventDefault();
			$('html, body').animate({scrollTop: to.offset().top}, 500);
		});

		// 現在表示中のインデックスを見つける
		var findIndexNum = function() {
			var scrollTop = $(window).scrollTop();
			var num = '';
			if (scrollTop < $('.js-nav:eq(0)').offset().top) {
				return num;
			}
			$('.js-nav').each(function (i) {
				if (i === 0) {
					return;
				}
				if (Math.floor(scrollTop) < (Math.floor($(this).offset().top)-1)) {
					num = $('.js-nav:eq('+(i-1)+')').data('num');
					return false;
				}
			});
			if (num === '') {
				num = $('.js-nav:last').data('num');
			}
			return num;
		}

		// 見出しナビゲーションのカレントを選択します。
		var selectCurrent = function(obj) {
			if ($(obj).scrollTop() > self.parent().offset().top) {
				var num = findIndexNum();
				self.find('li').removeClass('current');
				self.find('li.nav-'+num).addClass('current');
			} 
		}

		$(window).scroll(function () {
			selectCurrent(this);
		});
		selectCurrent(window);
		
		return this;
	}

	$.fn.stickyNavigator.defaults = {
		wrapselector	: document,
		targetselector	: "h2,h3",
	};

})(jQuery);


