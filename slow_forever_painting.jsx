#include "common.jsxinc"

function randomlyToggleLayers(layers) {
  for (var x = 0; x < layers.length; x++) {
    if (!layers[x].allLocked) {
      layers[x].visible = Boolean(Math.floor(Math.random() * 2));
    }
  }
}

function randomizeOpacity(layers) {
  for (var x = 0; x < layers.length; x++) {
    if (!layers[x].allLocked && layers[x].visible) {
      layers[x].opacity = getRandomInt(0, 100);
    }
  }
}

while (1) {
  randomlyToggleLayers(app.activeDocument.layers);
  randomizeOpacity(app.activeDocument.layers);

  for (var x = 0; x < app.activeDocument.layerSets.length; x++) {
    randomlyToggleLayers(app.activeDocument.layerSets[x].layers);
    randomizeOpacity(app.activeDocument.layerSets[x].layers);
  }
  refresh();
}
