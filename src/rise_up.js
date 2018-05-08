/*global require,
	$,
	app,
	File
*/
require([
    "underscore",
    "common"
],
function(
    _,
    utils
) {
    var CONCURRENT_ACTIONS = 5,
        OPACITY_STEPS = 6,
        TOP_PCT_OF_LAYERS_TO_VARY_OPACITY = 30;

    function forever(layers) {
      var remix = utils.getLayerSetByName(app.activeDocument, "remix");

      while (1) {
          // opacity actions
          var opacityGoals = {},
              layer,
              opacityLayers,
              showMe,
              hideMe;
          opacityLayers = nVisibleLayers(layers, CONCURRENT_ACTIONS);

          // showing action
          showMe = candidateForShowing(remix.layers);
          if (showMe) {
              showMe.visible = true;
              if (Math.random() < 0.2) {
                  showMe.opacity = 100;
              } else {
                  opacityGoals[showMe.name] = newOpacityGoal(0, utils.getNonUniformRandom(1, 100));
                  opacityLayers.push(showMe);
              }
          }

          // hiding action
          hideMe = candidateForHiding(remix.layers);
          if (hideMe) {
              hideMe.visible = false;
              hideMe.move(remix.layers[0], ElementPlacement.PLACEBEFORE);
          }

          _.each(opacityLayers, function(layer) {
              if (!(layer.id in opacityGoals)) {
                  opacityGoals[layer.id] = newRandomOpacityGoal(layer.opacity);
              }
          });

          for (var i = 0; i < OPACITY_STEPS; i++) {
              _.each(opacityLayers, function(layer) {
                  if (layer.id in opacityGoals) {
                     layer.opacity = opacityGoals[layer.id].next();
                  }
              });
              refresh();
          }
      }
    }

    function candidateForHiding(layers) {
        return _.chain(layers)
            .rest(Math.floor((layers.length-1) * 0.6))
            .where({visible: true, allLocked: false, isBackgroundLayer: false})
            .sample()
            .value();
    }

    function candidateForShowing(layers) {
        return _.findWhere(layers,
            {visible: false, allLocked: false, isBackgroundLayer: false});
    }

    function nVisibleLayers(layers, n) {
        var max_layer_idx = Math.min(
                layers.length - 1,
                Math.floor(layers.length * (TOP_PCT_OF_LAYERS_TO_VARY_OPACITY/100))
            ),
            layerlist = [],
            i,
            layer;
        // TODO: What if there aren't n visible layers?
        while (layerlist.length < n) {
            i = utils.getRandomInt(0, max_layer_idx);
            layer = layers[i];
            if (!layer.allLocked && !layer.isBackgroundLayer && layer.visible) {
                layerlist.push(layer);
            }
        }
        return layerlist;
    }

    // Deprecated variant of sigmoid function
    function sigmoid(start, end, steps) {
        var currentStep = 0, x;
        return function() {
            x = currentStep++;
            if (x == 0) { return start; }
            if (x >= steps) { return end; }
            return Math.round(((end-start)/(1 + Math.exp(-(x-(steps/2))))) + start);
         }
    }

    function newOpacityGoal(currentOpacity, target) {
        return {
            target: target,
            next: sigmoid(currentOpacity, target, OPACITY_STEPS)
        };
    }

    function newRandomOpacityGoal(currentOpacity) {
        return newOpacityGoal(currentOpacity, utils.getRandomInt(5, 100));
    }

    return forever(utils.getAllArtLayers(app.activeDocument));
});
