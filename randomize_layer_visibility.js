for (var x = 0; x < app.activeDocument.layers.length; x++) {
  app.activeDocument.layers[x].visible = Boolean(Math.floor(Math.random() * 2))
}
