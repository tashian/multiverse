#include "common.jsxinc"
var STEPS_PER_REFRESH = 4;

function tick(layers) {
  var steps = 0;
  for (var x = 0; x < layers.length; x++) {
    if (!layers[x].allLocked) {
      layers[x].visible = Boolean(Math.floor(Math.random() * 2));
      if (layers[x].visible) {
          layers[x].opacity = getRandomInt(0, 100);
      }
      steps++;
      if (steps % STEPS_PER_REFRESH == 0) {
          refresh();
      }
    }
  }
}

var allLayers = [];
for (var x = 0; x < app.activeDocument.layers.length; x++) {
    allLayers = allLayers.concat(app.activeDocument.layers[x]);
}
for (var x = 0; x < app.activeDocument.layerSets.length; x++) {
    var layers = app.activeDocument.layerSets[x].layers;
    for (var y = 0; y < layers.length; y++) {
        allLayers = allLayers.concat(layers[y]);
    }
}

while (1) {
  tick(allLayers);
}
