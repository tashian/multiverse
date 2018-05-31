/*globals define,
          app */
define(['underscore'], function(_) {
  return {
    DEBUG: $.level > 0,
    //
    // Randomness-related stuff
    //
    getRandomInt: function(min, max) {
      min = Math.ceil(min);
      max = Math.floor(max);
      return Math.floor(Math.random() * (max - min) + min);
    },

    getRandomBool: function() {
      return Boolean(Math.floor(Math.random() * 2));
    },

    getNonUniformRandom: function(min, max) {
      if (Math.random() < 0.25) {
        return max;
      } else if (Math.random() < 0.25) {
        return this.getRandomInt(max * 0.8, max);
      }
      return this.getRandomInt(min, max * 0.8);
    },

    //
    // Easing functions
    //
    // Return steps from start to end
    ease: function(start, end) {
      var steps = parseInt(Math.max(start, end) / 10);
      if (start == end || steps <= 1) {
        return [];
      }
      var c = end - start;
      return _.times(
        steps,
        function(step) {
          if (start > end) {
            return this.easeInQuad(step + 1, start, c, steps);
          } else {
            return this.easeOutQuad(step + 1, start, c, steps);
          }
        },
        this,
      );
    },
    // Steps toward a value, along a logistic curve.
    // See https://www.desmos.com/calculator/21xlvhwkhf
    sigmoid: function(start, end, steps) {
      return _
        .times(steps - 1, function(step) {
          return (
            (end - start) / (1 + Math.exp(-(step - steps / 2 + 1))) + start
          );
        })
        .concat(end);
    },
    // See https://github.com/valera-rozuvan/JSTweener/blob/master/jstweener.js
    // t: current time, b: begInnIng value, c: change In value, d: duration
    easeInQuad: function(t, b, c, d) {
      return c * (t /= d) * t + b;
    },
    easeOutQuad: function(t, b, c, d) {
      return -c * (t /= d) * (t - 2) + b;
    },

    // Dig into the layer sets to get all of the art layers.
    getAllArtLayers: function(doc) {
      function collectAllLayers(doc, allLayers) {
        for (var i = 0, max = doc.layers.length; i < max; i++) {
          var layer = doc.layers[i];
          if (layer.typename === 'ArtLayer') {
            allLayers.push(layer);
          } else {
            // Layer set
            collectAllLayers(layer, allLayers);
          }
        }
        return allLayers;
      }

      return collectAllLayers(doc, []);
    },

    getLayerById: function(id, doc_id) {
      try {
        var doc;

        if (doc_id == undefined) doc = activeDocument;
        else
          for (var i = 0; i < documents.length; i++) {
            if (documents[i].id == doc_id) {
              doc = documents[i];
              break;
            }
          }

        if (doc == undefined) {
          alert('Bad document ' + doc_id);
          return null;
        }

        var r = new ActionReference();
        r.putProperty(charIDToTypeID('Prpr'), stringIDToTypeID('json'));

        if (doc_id == undefined)
          r.putEnumerated(
            charIDToTypeID('Dcmn'),
            charIDToTypeID('Ordn'),
            charIDToTypeID('Trgt'),
          );
        else r.putIdentifier(charIDToTypeID('Dcmn'), doc_id);

        eval(
          'var json = ' +
            executeActionGet(r).getString(stringIDToTypeID('json')),
        );

        if (json == undefined) return null;

        var set = new Array();

        function search_id(layers, id) {
          for (var i = 0; i < layers.length; i++) {
            if (layers[i].id == id) {
              set.push(i);
              return true;
            }
          }

          for (var i = 0; i < layers.length; i++) {
            if (layers[i].layers) {
              if (search_id(layers[i].layers, id)) {
                set.push(i);
                return true;
              }
            }
          }
        }

        if (search_id(json.layers, id)) {
          var ret = doc.layers;

          for (var i = set.length - 1; i > 0; i--) {
            ret = ret[set[i]].layers;
          }

          return ret[set[0]];
        }

        return null;
      } catch (e) {
        alert(e);
      }
    },

    // Changing a layer's name makes it visible, so we have to save & restore
    // the visibility
    setLayerName: function(layer, name) {
      var visible = layer.visible;
      layer.name = name;
      layer.visible = visible;
    },

    // LayerSets.getByName displays an error if not found;
    // this returns silently.
    getLayerSetByName: function(doc, name) {
      for (var x = 0, max = doc.layerSets.length; x < max; x++) {
        if (doc.layerSets[x].name == name) {
          return doc.layerSets[x];
        }
      }
    },
  };
});
