#include "common.jsxinc"
var STEPS_PER_REFRESH = 4;

// looping forever,
// - adjust a random visible layer's opacity by a random amount +- 10%
// - refresh the view every STEPS_PER_REFRESH iteration

function forever(layers) {
  var step = 0;

  while (1) {
    step++;
    var layer = layers[getRandomInt(0, layers.length)];

    if (!layer.allLocked && !layer.isBackgroundLayer && layer.visible) {
      if (Math.random() < 0.5) {
        layer.opacity = Math.min(layer.opacity + getRandomInt(1, 10), 100);
      } else {
        layer.opacity = Math.max(layer.opacity - getRandomInt(1, 10), 1);
      }

      if (step % STEPS_PER_REFRESH == 0) {
          refresh();
      }
    }
  }
}

forever(getAllArtLayers(app.activeDocument));
