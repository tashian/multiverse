/*global require,
	$,
	app,
	File
*/
require([
    "underscore",
    "utils"
],
function(
    _,
    utils
) {
    function main() {
        var list = File.openDialog("Select a text file", function(f) { return true; }, false);
        var labels = [];

        if (list.exists) {
            list.open("r");
            while (!list.eof) {
                labels.push(list.readln());
            }
            labels = _.shuffle(labels);

            var layers = utils.getAllArtLayers(app.activeDocument);
            for (var x = 0; x < layers.length && labels.length > 0; x++) {
                utils.setLayerName(layers[x], labels.pop());
            } 
        }
    }

    return main();
});
