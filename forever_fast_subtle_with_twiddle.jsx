#include "common.jsxinc"
var STEPS_PER_REFRESH = 4;
var TOGGLE_VISIBILITY = true;

// looping forever,
// - adjust a random visible layer's opacity by a random amount +- 10%
// - occasionally swap two layers with each other
// - refresh the view every STEPS_PER_REFRESH iteration

function forever(layers) {
  var step = 0;
  var remixLayerSet = getLayerSetByName(app.activeDocument, "remix");

  while (1) {
    var i = getRandomInt(0, layers.length - 1)
    var layer = layers[i];

    if (!layer.allLocked && !layer.isBackgroundLayer) {
      step++;

      if (TOGGLE_VISIBILITY) {
        layer.visible = getRandomBool();
      }
      if (layer.visible) {
        if (Math.random() < 0.5) {
          layer.opacity = Math.min(layer.opacity + getRandomInt(1, 10), 100);
        } else {
          layer.opacity = Math.max(layer.opacity - getRandomInt(1, 10), 1);
        }
      }

      if (remixLayerSet) {
        twiddle(remixLayerSet.layers);
      }

      if (step % STEPS_PER_REFRESH == 0) {
          refresh();
      }
    }
  }
}

function twiddle(layers) {
  var i = getRandomInt(0, layers.length - 1)
  var layer = layers[i];
  layer.move(layers[i+1], ElementPlacement.PLACEAFTER)
}

forever(getAllArtLayers(app.activeDocument));
