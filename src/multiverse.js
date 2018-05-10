/*global require,
	$,
	app,
	File
*/
require([
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
    var fx_queue = new FxQueue();

    function surfaceOneLayer(layerSet, style) {
        var layer = sample(layerSet.layers);
        if (layer) {
            if (utils.DEBUG) $.writeln("Surfacing ", layerSet.name, " layer ", layer.id);
            if (layer.visible) {
                fx_queue.add(layer.id, 'fadeOut', layer.opacity);
                fx_queue.add(layer.id, 'moveBefore', layerSet);
            }
            fx_queue.add(layer.id, style);
        }
    }

    function fadeLayers(layerSet) {
        var n;
        _.chain(layerSet.layers)
         .where({allLocked: false, isBackgroundLayer: false, visible: true})
         .tap(function(layers) { n = layers.length * 0.8; })
         .sample(n)
         .each(function(layer) {
            fx_queue.add(layer.id, 'fadeOut', layer.opacity);
         });
    }
    
    function forever() {
        var remixLayers = utils.getLayerSetByName(app.activeDocument, "remix"),
            midfieldLayers = utils.getLayerSetByName(app.activeDocument, "midfield"),
            backgroundLayers = utils.getLayerSetByName(app.activeDocument, "background"),
            fsm = new Machine('init'),
            timer = new PollingTimer(300);

        fsm.add_state('init', function() {
            fadeLayers(remixLayers);
            fadeLayers(midfieldLayers);
   			while (!fx_queue.isEmpty()) {
				fx_queue.tick();
				refresh();
			}
        });

		fsm.add_state('reset', function() {
            timer.reset();
		});

        fsm.add_state('running', function() {
			while (!timer.isFinished()) {
				surfaceOneLayer(remixLayers, 'popOrFadeIn');
				surfaceOneLayer(midfieldLayers, 'fadeIn');
				fx_queue.tick();
				refresh();
			}
        });

        fsm.add_state('scene_change', function() {
            fx_queue.clear();
        });

        fsm.add_state('hide_top_layers', function() {
            fadeLayers(remixLayers);
            fadeLayers(midfieldLayers);
   			while (!fx_queue.isEmpty()) {
				fx_queue.tick();
				refresh();
			}
		});

        fsm.add_state('finish', function() {
            surfaceOneLayer(backgroundLayers, 'fadeInCompletely');
			while (!fx_queue.isEmpty()) {
				fx_queue.tick();
				refresh();
			}
        });

        fsm.add_transition('init', 'reset', fsm.always);
        fsm.add_transition('reset', 'running', fsm.always);
        fsm.add_transition('running', 'scene_change', fsm.always);
        fsm.add_transition('scene_change', 'hide_top_layers', fsm.always);
        fsm.add_transition('hide_top_layers', 'finish', fsm.always);
        fsm.add_transition('finish',  'reset', fsm.always);

        // main loop
        while (1) {
            fsm.tick();
        }
    }

    function sample(layers) {
        return _.chain(layers)
            .rest(Math.floor((layers.length-1) * 0.6))
            .where({allLocked: false, isBackgroundLayer: false})
            .sample()
            .value();
    }

    function candidateForShowing(layers) {
        return _.findWhere(layers,
            {visible: false, allLocked: false, isBackgroundLayer: false});
    }

    return forever();
});
