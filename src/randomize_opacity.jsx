#include "common.jsxinc"
MIN_OPACITY = 0
MAX_OPACITY = 100

function randomizeOpacity(layers) {
  for (var x = 0; x < layers.length; x++) {
    if (!layers[x].allLocked && layers[x].visible) {
      layers[x].opacity = getRandomInt(MIN_OPACITY, MAX_OPACITY);
    }
  }
}

randomizeOpacity(app.activeDocument.layers);

for (var x = 0; x < app.activeDocument.layerSets.length; x++) {
  randomizeOpacity(app.activeDocument.layerSets[x].layers);
}
