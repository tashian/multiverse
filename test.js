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

    // Tests TBD
});
