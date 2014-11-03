var IMAGE_FADER = IMAGE_FADER || {};

if(!Array.indexOf) {// IE fix
		Array.prototype.indexOf = function(obj) {
			for(var i = 0; i < this.length; i++) {
				if(this[i] === obj) {
					return i;
				}
			}
			return -1;
		}
	}

var beforeImage, afterImage, mouseDown = false, fadeTime = 2.5, mouseMove = false, startMouseX = 0, lastFade = 0, firstImage = true, tweens, currentFaderIndex = 0;

var _isNextGen = true;

var _element = "#image-fader-container";
var _context = window;

var _flag = false;

var _key = window.location.search.slice(1);


IMAGE_FADER.App = function() {

	"use strict";

	IMAGE_FADER.load();

};

IMAGE_FADER.load = function() {

				var key = "0AhDtwXOtiI5edHd6amY2ME5POVozYVNYV05VSUpJUEE";
				var url;

				try {

					 url = "http://interactive.guim.co.uk/spreadsheetdata/" + key + ".json";

        				jQ.getJSON ( url, function( data ) {

          				IMAGE_FADER.handleMainDataResponse(data);

        			});

					} catch (e) {

						url = "http://interactive.guim.co.uk/spreadsheetdata/" + key + ".jsonp";

				jQ.ajax({
					type:'get',
					dataType:'jsonp',
					url: url,
					jsonpCallback: 'gsS3Callback',
					cache: true
				});

			}

}

window.gsS3Callback = function (data) {

		IMAGE_FADER.handleMainDataResponse(data);
	
}


IMAGE_FADER.handleMainDataResponse = function(data) {

	var dataset = [], d = data.sheets.Sheet1;

	for (var i = 0; i < d.length; i++) {

		if (d[i].uniquefadername == _key) {
			dataset.push(d[i]);
		}

	}

	IMAGE_FADER.buildSliders(dataset);

	IMAGE_FADER.addListeners();

	//var h = jQ(_element).height();

	//jQ("body").css({"minHeight" : h});

}



IMAGE_FADER.arrayObjectIndexOf = function (myArray, searchTerm, property) {
		for (var i = 0, len = myArray.length; i < len; i++) {
			if (myArray[i][property] === searchTerm)
				return i;
		}
		return -1;
}


IMAGE_FADER.buildSliders = function(data) {

		var i, faders = [], beforeImage, afterImage, caption, credit, htmlString = '';
	
			for (i = 0; i < data.length; i++) {

				beforeImage = data[i].beforeimage;
				afterImage = data[i].afterimage;
				altTag = data[i].alttag;
				caption = data[i].caption;
				credit = data[i].credit;


				htmlString += '<div class="gdn-fader-slider" style="cursor:pointer;position:relative;" ><img  class="before-image" src="' + beforeImage + '" alt="' + altTag + '" style="width:100%;position:relative;top:0px;left:0px;" /><img class="after-image" src="' + afterImage + '" alt="' + altTag + '" style="width:100%;position:absolute;top:0px;left:0px;" /></div><div class="caption">' + caption + '</div><div class="credit">' + credit + '</div>';
				
			}

			
	jQ(_element).html(htmlString);

	if (!_isNextGen) {

			jQ(_element).find('.caption').css({
				"font-size" : "14px",
				"padding-top" : "10px",
				"line-height" : "1.25"
			});

			jQ(_element).find('.credit').css({
				"font-size" : "12px",
				"line-height" : "1.357",
				"color" : "#999999",
				"padding-bottom" : "25px"
			});

		} else {

			var creditHtml = jQ(_element).find('.credit').html();

			jQ(_element).find('.caption').append(" " + creditHtml).css({
				"padding-bottom" : "25px"
			});
			
			jQ(_element).find('.credit').hide();

		}


		tweens = [];

		var ind, tween;

		jQ(_element).find('.gdn-fader-slider').each(function(index, value) {

			var slider = this;

			jQ(slider).attr('id', 'gdn-fader-slider_' + index);

			ind = index * 2;

			beforeImage = jQ(".before-image", slider);
			afterImage = jQ(".after-image", slider);

			tween = TweenMax.from(afterImage, fadeTime, {
				css : {
					autoAlpha : 0
				},
				yoyo : true,
				repeat : -1,
				onRepeat : IMAGE_FADER.repeatListener,
				onRepeatParams : [index],
				ease : Quad.easeInOut
			});

			tweens.push(tween);

			tween.pause();

		});

}


IMAGE_FADER.addListeners = function() {
		//tween.seek(0.5);

		jQ(_element).find('.gdn-fader-slider img').on('dragstart', function(event) {
			event.preventDefault();
		});
		

		jQ(_element).find('.gdn-fader-slider').bind('mousedown touchstart', function(event) {

			event.preventDefault();

			 if (!_flag) {
    			_flag = true;
    			setTimeout(function(){ _flag = false; }, 100);
 

			
			var offset = jQ(this).offset();

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

  			}

			return false;

		});

		jQ(_element).find('.gdn-fader-slider').bind('pointermove', function(event) {

			event.preventDefault();
			
			if (mouseDown) {


				
				var div = this;
				var splitArr = div.id.split("_");
				var index = Number(splitArr[1]);

				var offset = jQ(this).offset();
				var relX;

				relX = event.originalEvent.clientX - offset.left;

				var faderWidth = jQ(this).width();

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
		
		

		jQ(_context).bind('mouseup touchend', function(event) {

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

		jQ( window ).load(function() {

			var h = jQ(_element).innerHeight();

			iframeMessenger.resize(h);
			
		});

	}


IMAGE_FADER.repeatListener = function (index) {
		tweens[index].pause();
}



