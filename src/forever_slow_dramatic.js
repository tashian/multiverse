/*global require,
	$,
	app,
    refresh
*/
require([
    "utils",
    "underscore"
],
function(
    utils,
    _
) {

    // this one is slow to run but when changes occur they are more dramatic

    // go through all layers and layer sets and
    // randomly toggle visibility and adjust opacity.
    // refresh after each pass through all layers.

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
          layers[x].opacity = utils.getRandomInt(0, 100);
        }
      }
    }

    function main() {
        while (1) {
          randomlyToggleLayers(app.activeDocument.layers);
          randomizeOpacity(app.activeDocument.layers);

          for (var x = 0; x < app.activeDocument.layerSets.length; x++) {
            randomlyToggleLayers(app.activeDocument.layerSets[x].layers);
            randomizeOpacity(app.activeDocument.layerSets[x].layers);
          }
          refresh();
        }
    }

    return main();
});