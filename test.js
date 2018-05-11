var requirejs = require('requirejs');
var expect = require('chai').expect;
$ = { level: 0 };

requirejs.config({
	paths: {
		requireLib: "node_modules/requirejs/require",
		underscore: "node_modules/underscore/underscore",
        utils: "lib/utils",
        machine: "lib/machine",
        polling_timer: "lib/polling_timer",
        fx_queue: "lib/fx_queue"
	},
    baseUrl: __dirname
});

requirejs([
    "underscore",
    "utils",
	"fx_queue",
    "polling_timer",
    "machine"
],
function(
    _,
    utils,
    FxQueue,
    PollingTimer,
    Machine
) {

	var x = new FxQueue();

	// console.log(utils.ease(80, 90));
	// console.log(utils.ease(20, 30));
	// console.log(utils.ease(0, 0));
	// console.log(utils.ease(3, 0));

	console.log(x.width());
	x.add(1, 'fadeOut', 50);
	x.add(2, 'fadeOut', 50);
	x.add(3, 'fadeOut', 50);
	console.log(x.width());
	console.log(x.size());

});
