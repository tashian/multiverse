#include "common.jsxinc"
var STEPS_PER_REFRESH = 1;
var TWIDDLE = false;
var CONCURRENT_ACTIONS = 5;
var OPACITY_STEPS = 6;
var TOP_PCT_OF_LAYERS_TO_VARY_OPACITY = 30;

function forever(layers) {
  var step = 0;
  var remix = getLayerSetByName(app.activeDocument, "remix");

  while (1) {
      // opacity actions
      var opacityGoals = {};
      var opacity_layers = nVisibleLayers(layers, CONCURRENT_ACTIONS);

      // showing action
      var show_me = candidateForShowing(remix.layers);
      if (show_me) {
          show_me.visible = true;
          if (Math.random() < 0.2) {
              show_me.opacity = 100;
          } else {
              opacityGoals[show_me.name] = newOpacityGoal(0, getRandomInt(60, 95));
              opacity_layers.push(show_me);
          }
      }

      // hiding action
      var hide_me = candidateForHiding(remix.layers);
      if (hide_me) {
          hide_me.visible = false;
          hide_me.move(remix.layers[0], ElementPlacement.PLACEBEFORE)
      }

      for (var j = 0; j < opacity_layers.length; j++) {
          var layer = opacity_layers[j];
          if (!(layer.name in opacityGoals)) {
              opacityGoals[layer.name] = newRandomOpacityGoal(layer.opacity);
          }
      }

      for (var i = 0; i < OPACITY_STEPS; i++) {
          for (var j = 0; j < opacity_layers.length; j++) {
              var layer = opacity_layers[j];
              if (layer.name in opacityGoals) {
                 layer.opacity = opacityGoals[layer.name].next();
              }
          }
          refresh();
      }
  }
}

function candidateForHiding(layers) {
    for (var i = layers.length - 1; i >= 0; i--) {
        var layer = layers[i];
        if (layer.visible && !layer.allLocked && !layer.isBackgroundLayer &&
            layer.opacity <= 20) {
            return layer;
        }
    }
}

function candidateForShowing(layers) {
    for (var i = 0; i < layers.length; i++) {
        var layer = layers[i];
        if (!layer.visible && !layer.allLocked && !layer.isBackgroundLayer) {
            return layer;
        }
    }
}

function nVisibleLayers(layers, n) {
    var max_layer_idx = Math.min(
        layers.length - 1,
        Math.floor(layers.length * (TOP_PCT_OF_LAYERS_TO_VARY_OPACITY/100))
    );
    var layerlist = [];
    while (layerlist.length < n) {
        var i = getRandomInt(0, max_layer_idx);
        var layer = layers[i];
        if (!layer.allLocked && !layer.isBackgroundLayer && layer.visible) {
            layerlist.push(layer);
        }
    }
    return layerlist;
}


function newOpacityGoal(currentOpacity, target) {
    return {
        target: target,
        next: sigmoid(currentOpacity, target, OPACITY_STEPS)
    };
}

function newRandomOpacityGoal(currentOpacity) {
    return newOpacityGoal(currentOpacity, getRandomOpacity());
}

function twiddle(layers) {
  var i = getRandomInt(0, layers.length - 2)
  var layer = layers[i];
  if (!layer.visible || layer.opacity <= 10) {
      layer.move(layers[0], ElementPlacement.PLACEBEFORE)
  }
}

forever(getAllArtLayers(app.activeDocument));
