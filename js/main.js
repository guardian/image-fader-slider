//define('app-name', ['$uery'], function($) {

//function init() {
//do stuff
//}

//return {
//init: init
//}
//})

/**
 *
 */
define(['jquery', 'TweenMax'], function($, TweenMax) {

	'use strict';

	// globals

	function is_touch_device() {
		return 'ontouchstart' in window// works on most browsers
		|| 'onmsgesturechange' in window;
		// works on ie10
	};

	//var baseURL = "http://interactive.guim.co.uk/next-gen/artanddesign/ng-interactive/2013/nov/london-endell-street-then-and-now/"; //
    var baseURL = "http://interactive.guim.co.uk/next-gen/artanddesign/ng-interactive/2013/nov/27/photography/";
	// ADD BASE URL HERE !!!!!!

	var _element, _context, _isNextGen;
	var isTouch, eventMove, eventDown, eventUp;
	var beforeImage, afterImage, mouseDown = false, fadeTime = 2.5, mouseMove = false, startMouseX = 0, lastFade = 0, firstImage = true, tweens, currentFaderIndex = 0;

	function initFaders() {

		if (!_isNextGen) {

			$(_element).find('.caption').css({
				"font-size" : "14px",
				"padding-top" : "10px",
				"line-height" : "1.25"
			});

			$(_element).find('.credit').css({
				"font-size" : "12px",
				"line-height" : "1.357",
				"color" : "#999999",
				"padding-bottom" : "25px"
			});

		} else {

			var creditHtml = $(_element).find('.credit').html();

			$(_element).find('.caption').append(" " + creditHtml).css({
				"padding-bottom" : "25px"
			});

			$(_element).find('.credit').hide();

		}

		tweens = [];

		var ind, tween;

		$(_element).find('.gdn-fader-slider').each(function(index, value) {

			var slider = this;

			$(slider).attr('id', 'gdn-fader-slider_' + index);

			ind = index * 2;

			beforeImage = $(".before-image", slider);
			afterImage = $(".after-image", slider);

			tween = TweenMax.from(afterImage, fadeTime, {
				css : {
					autoAlpha : 0
				},
				yoyo : true,
				repeat : -1,
				onRepeat : repeatListener,
				onRepeatParams : [index],
				ease : Quad.easeInOut
			});

			tweens.push(tween);

			tween.pause();

		});

	}

	function addListeners() {
		//tween.seek(0.5);

		$(_element).find('.gdn-fader-slider img').on('dragstart', function(event) {
			event.preventDefault();
		});


		$(_element).find('.gdn-fader-slider').bind('pointerdown', function(event) {
			event.preventDefault();

			var offset = $(this).offset();

			var div = this;
			var splitArr = div.id.split("_");
			var index = Number(splitArr[1]);

			currentFaderIndex = index;

			startMouseX = event.originalEvent.clientX - offset.left;

			mouseDown = true;
			var ratio = tweens[index].ratio;
			if (ratio < 0.5) {
				firstImage = true;
			} else {
				firstImage = false;
			}

		});


		$(_element).find('.gdn-fader-slider').bind('pointermove', function(event) {

			event.preventDefault();

			if (mouseDown) {

				var div = this;
				var splitArr = div.id.split("_");
				var index = Number(splitArr[1]);

				var offset = $(this).offset();
				var relX;

				relX = event.originalEvent.clientX - offset.left;

				var faderWidth = $(this).width();

				var change;
				//var relY = event.pageY - offset.top;
				if (startMouseX < (faderWidth / 2)) {
					change = relX / faderWidth;
				} else {
					change = (faderWidth - relX) / faderWidth;
				}

				if (!firstImage) {
					change = 1 - change;
				}

				var gotoTime = change * fadeTime;

				tweens[index].pause();
				tweens[index].seek(gotoTime);
			}

		});



		$(_context).bind('pointerup touchend mouseup', function(event) {

			mouseDown = false;

			var targ = event.originalEvent.target.className;

			if (targ == "after-image" || targ == "before-image") {

				var ratio = tweens[currentFaderIndex].ratio;

				if (ratio > 0.5 && ratio < 0.99) {

					tweens[currentFaderIndex].seek(fadeTime);

				} else if (ratio <= 0.5 && ratio > 0.01) {

					tweens[currentFaderIndex].seek(0);

				} else {
					tweens[currentFaderIndex].resume();
				}

			}

		});

	}

	function repeatListener(index) {
		tweens[index].pause();
	}

	function setup(el, context, isNextGen) {

		var url = baseURL + "data/scaffolding.jsonp";

		$.ajax({
			url : url,
			jsonp : false,
			dataType : "jsonp",
			jsonpCallback : "image_fader_2013_fn",
			cache : true,
			success : function(data) {

				$(el).html(data.myStr);

				_element = el;
				_context = context;
				_isNextGen = isNextGen;

				isTouch = is_touch_device();

				eventMove = isTouch ? "touchmove" : "mousemove";
				eventDown = isTouch ? "touchstart" : "mousedown";
				eventUp = isTouch ? "touchend" : "mouseup";

				initFaders();
				addListeners();
			}
		});
	}

	return {
		setup : setup
	};

});

