//
// Basic JS utils
//



//
// Randomness-related stuff
//
function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min)) + min;
}

function getNonUniformRandomOpacity(min, max) {
    if (Math.random() < 0.25) {
        return 100;
    } else if (Math.random() < 0.25) {
        return getRandomInt(1, 20);
    } else {
        return getRandomInt(60, 100);
    }
}

function getRandomOpacity() {
  return getRandomInt(1, 100);
}

function getRandomBool() {
  return Boolean(Math.floor(Math.random() * 2));
}

/**
 * Shuffles array in place.
 * @param {Array} a items An array containing the items.
 */
function shuffleArray(a) {
    var j, x, i;
    for (i = a.length - 1; i > 0; i--) {
        j = Math.floor(Math.random() * (i + 1));
        x = a[i];
        a[i] = a[j];
        a[j] = x;
    }
    return a;
}


//
// Photoshop-related utilities
//

function forEachLayer(collection, cb) {
    for (var i = 0, max = collection.length; i < max; i++) {
       cb(collection[i]);
    }
}

// Dig into the layer sets to get all of the art layers.
function getAllArtLayers(doc) {
    var allLayers = [];

    function collectAllLayers (doc, allLayers) {
        forEachLayer(doc.layers, function(layer) {
            if (layer.typename === "ArtLayer") {
                allLayers.push(layer);
            } else {
                // Layer set
                collectAllLayers(layer, allLayers);
            }
        });
        return allLayers;
    }

    return collectAllLayers(doc, allLayers);
}


// Changing a layer's name makes it visible, so we have to save & restore
// the visibility
function setLayerName(layer, name) {
    var visible = layer.visible;
    layer.name = name;
    layer.visible = visible;
}

// LayerSets.getByName displays an error if not found;
// this returns silently.
function getLayerSetByName(doc, name) {
  for (var x = 0, max = doc.layerSets.length; x < max; x++) {
    if (doc.layerSets[x].name == name) {
        return doc.layerSets[x];
    }
  }
}

// Take a step toward a value, along
// a logistic curve. See https://www.desmos.com/calculator/21xlvhwkhf
function sigmoid(start, end, steps) {
    var currentStep = 0, x;
    return function() {
        x = currentStep++;
        if (x == 0) { return start; }
        if (x >= steps) { return end; }
        return Math.round(((end-start)/(1 + Math.exp(-(x-(steps/2))))) + start);
    }
}

// For test harness
if (typeof exports !== 'undefined') {
    exports.getNonUniformRandomOpacity = getNonUniformRandomOpacity;
    exports.getRandomOpacity = getRandomOpacity;
    exports.sigmoid = sigmoid;
}
