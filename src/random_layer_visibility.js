/*global require,
	$,
	app
*/
require([
    "underscore",
    "common"
],
function(
    _,
    common
) {
    function randomlyToggleLayers(layers) {
      for (var x = 0; x < layers.length; x++) {
        if (!layers[x].allLocked) {
          layers[x].visible = Boolean(Math.floor(Math.random() * 2));
        }
      }
    }

    function main() {
        randomlyToggleLayers(app.activeDocument.layers);

        for (var x = 0; x < app.activeDocument.layerSets.length; x++) {
          randomlyToggleLayers(app.activeDocument.layerSets[x].layers);
        }
    }
    
    return main();
});
