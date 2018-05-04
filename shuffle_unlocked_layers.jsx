#include "common.jsxinc"

function shuffleUnlockedLayers(layers) {
  for (var x = 0; x < layers.length; x++) {
      if (!layers[x].allLocked) {
          layers[x].move(layers[getRandomInt(0, layers.length)],
            ElementPlacement.PLACEAFTER)
  	}
  }
}

shuffleUnlockedLayers(app.activeDocument.artLayers);

for (var x = 0; x < app.activeDocument.layerSets.length; x++) {
  shuffleUnlockedLayers(app.activeDocument.layerSets[x].layers);
}
