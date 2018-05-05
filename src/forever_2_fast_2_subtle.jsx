#include "common.jsxinc"
var OPACITY_TWEAK_PCT = 10;

// looping forever,
// - adjust ALL visible layers opacity by a random amount +- 5%
// - refresh the view every STEPS_PER_REFRESH iteration

function forever(layers) {
  while (1) {
    for (x = 0; x < layers.length; x++) {
      var layer = layers[x];

      if (!layer.allLocked && !layer.isBackgroundLayer && layer.visible) {
        if (Math.random() < 0.5) {
          layer.opacity = Math.min(layer.opacity + getRandomInt(1, OPACITY_TWEAK_PCT), 100);
        } else {
          layer.opacity = Math.max(layer.opacity - getRandomInt(1, OPACITY_TWEAK_PCT), 1);
        }
      }
    }
    refresh();
  }
}

forever(getAllArtLayers(app.activeDocument));
