/*global require,
	$,
	app,
	File
*/
require([
    "underscore",
    "common"
],
function(
    _,
    common
) {
    function main() {
        var list = File.openDialog("Select a text file", function(f) { return true; }, false);
        var labels = [];

        if (list.exists) {
            list.open("r");
            while (!list.eof) {
                labels.push(list.readln());
            }
            labels = shuffleArray(labels);

            var layers = getAllArtLayers(app.activeDocument);
            for (var x = 0; x < layers.length && labels.length > 0; x++) {
                setLayerName(layers[x], labels.pop());
            } 
        }
    }

    return main();
});
