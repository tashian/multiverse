MIN_OPACITY = 0
MAX_OPACITY = 100

// sort the layers by name
function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min)) + min;
}

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
