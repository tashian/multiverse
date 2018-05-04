function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min)) + min;
}

function getRandomLayerIndex() {
    return getRandomInt(0, app.activeDocument.layers.length)
}

for (var x = 0; x < app.activeDocument.layers.length; x++) {
    if (!app.activeDocuemnt.layers[x].allLocked) {
        app.activeDocument.layers[x].move(app.activeDocument.layers[getRandomLayerIndex()],
          ElementPlacement.PLACEAFTER)
	}
}
