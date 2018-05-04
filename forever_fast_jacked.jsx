#include "common.jsxinc"
var STEPS_PER_REFRESH = 3;
var FULL_OPACITY_PROBABILITY = 0.1;
var SLEEP_PER_REFRESH = 0;

// looping forever,
// - toggle visibility on a random art layer
// - if the layer is visible, randomize its opacity
// - refresh the view every STEPS_PER_REFRESH iteration

function forever(layers) {
  var step = 0;

  while (1) {
    step++;
    var layer = layers[getRandomInt(0, layers.length)];

    if (!layer.allLocked && !layer.isBackgroundLayer) {
      layer.visible = !layer.visible;
      if (layer.visible) {
        if (Math.random() < 0.1) {
          layer.opacity = 100;
        } else if (Math.random() < 0.1) {
          layer.opacity = 0;
        } else {
          layer.opacity = getRandomInt(1, 100);
        }
      }
      if (step % STEPS_PER_REFRESH == 0) {
          $.sleep(SLEEP_PER_REFRESH);
          refresh();
      }
    }
  }
}

forever(getAllArtLayers(app.activeDocument));
