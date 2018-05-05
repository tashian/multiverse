#include "common.jsxinc"
var STEPS_PER_REFRESH = 4;

// looping forever,
// - pick a random layer or layerSet
// - sometimes toggle visibility
// - randomly adjust opacity
// - display results every STEPS_PER_REFRESH iterations

// hack to cancel this script:
// go to File -> Save As... dialog and hit Esc.

function forever(layers) {
  var step = 0;

  while (1) {
    step++;
    var layer = layers[getRandomInt(0, layers.length)];

    if (!layer.allLocked) {
      layer.visible = Boolean(Math.floor(Math.random() * 2));
      if (layer.visible) {
          layer.opacity = getRandomInt(0, 100);
      }
      if (step % STEPS_PER_REFRESH == 0) {
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

forever(allLayers);
