#include "common.jsxinc"

// applyMotionBlur(angle [-360..360], radius [1..999])
var BLUR_PROBABILITY = 0.5;
var MIN_RADIUS = 25;
var MAX_RADIUS = 400;

function randomMotionBlur(layers) {
  for (var x = 0; x < layers.length; x++) {
    if (!layers[x].allLocked && layers[x].visible &&
      Math.random() < BLUR_PROBABILITY) {
      layers[x].applyMotionBlur(
        getRandomInt(0, 360),
        getRandomInt(MIN_RADIUS, MAX_RADIUS)
      );
    }
  }
}

randomMotionBlur(app.activeDocument.artLayers);

for (var x = 0; x < app.activeDocument.layerSets.length; x++) {
  randomMotionBlur(app.activeDocument.layerSets[x].artLayers);
}
