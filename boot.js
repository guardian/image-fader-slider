define([], function() {'use strict';

	return {
		/**
		 *
		 * @param el        : The Element of the interactive that is being progressively enhanced.
		 * @param context   : The DOM context this module must work within.
		 * @param config    : The configuration object for this page.
		 * @param mediator  : The event system (publish/subscribe) for this page.
		 *
		 **/
		boot : function(el, context, config, mediator) {
			
			
			var cfg = {
				context : 'interactive',
				baseUrl : 'http://interactive.guim.co.uk/next-gen/artanddesign/ng-interactive/2013/nov/london-endell-street-then-and-now', //http://interactive.guim.co.uk/next-gen/artanddesign/ng-interactive/2013/oct/kingsway-photography-then-and-now
				paths : {
					// the left side is the module ID,
					// the right side is the path to
					// the jQuery file, relative to baseUrl.
					// Also, the path should NOT include
					// the '.js' file extension. This example
					// is using jQuery 1.9.0 located at
					// js/lib/jquery-1.9.0.js, relative to
					// the HTML page.
					jquery : 'js/jquery-1.10.1.min',
					TweenMax : 'js/TweenMax.min',
					main : 'js/main'
				}
			};

			if ( typeof require() === 'function') {
				var req2 = require.config(cfg);
				req2(['main',  "http://interactive.guim.co.uk/next-gen/artanddesign/ng-interactive/2013/nov/london-endell-street-then-and-now/js/hand-1.1.2.js"], function(App) {
					App.setup(el, context, false);
					
				});
			} else {
				// curl, i.e. next-gen
				require(cfg, ['main', "js!http://interactive.guim.co.uk/next-gen/artanddesign/ng-interactive/2013/nov/london-endell-street-then-and-now/js/hand-1.1.2.js"]).then(function(App) {
					App.setup(el, context, true);
				});
			}
		}
	}
});
