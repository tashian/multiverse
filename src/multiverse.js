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
    utils
) {
    var CONCURRENT_ACTIONS = 5,
        OPACITY_STEPS = 15,
        TOP_PCT_OF_LAYERS_TO_VARY_OPACITY = 20,
        MAX_Q_WIDTH = 10,
        MAX_Q_LENGTH = 500,
        DEBUG = false;

    var Q = function() {
        var handlers = {
            hide: function() {
                return function(layer) {
                    if (DEBUG) $.writeln("Layer ", layer.id, " hiding");
                    layer.visible = false;
                };
            },

            visible: function() {
                return function(layer) {
                    if (DEBUG) $.writeln("Layer ", layer.id, " visible but 0%");
                    layer.opacity = 0;
                    layer.visible = true;
                };
            },

            show: function() {
                return function(layer) {
                    if (DEBUG) $.writeln("Layer ", layer.id, " show");
                    layer.opacity = 100;
                    layer.visible = true;
                };
            },

            popOrFadeIn: function() {
                var events = [];
                if (Math.random() < 0.2) {
                    events.push(this.show());
                } else {
                    events.push(this.visible());
                    events = events.concat(this.fadeToNonUniformRandomOpacity(0));
                }
                return events;
            },

            moveBefore: function(layerSet) {
                return function(layer) {
                    if (DEBUG) $.writeln("Layer ", layer.id, " move to top");
                    layer.move(layerSet.layers[0], ElementPlacement.PLACEBEFORE);
                };
            },

            fade: function(fromOpacity, toOpacity) {
                var faders = _.map(utils.sigmoid(fromOpacity, toOpacity, OPACITY_STEPS), function(val) {
                    return function(layer) {
                        if (DEBUG) $.writeln("Layer ", layer.id, " opacity (", fromOpacity, "% -> ", toOpacity, "%) to ", val);
                        layer.opacity = val;
                    };
                });
                return _.toArray(faders);
            },

            fadeOut: function(fromOpacity) {
                return this.fade(fromOpacity, 0);
            },

            fadeToRandomOpacity: function(fromOpacity) {
                return this.fade(fromOpacity, utils.getRandomInt(5, 100));
            },

            fadeToNonUniformRandomOpacity: function(fromOpacity) {
                return this.fade(fromOpacity, utils.getNonUniformRandom(5, 100));
            }
        };

        return {
            handlers: handlers,
            queue: {},
            isBusy: false,
            isQueued: function(layerId) {
                if (layerId in this.queue) {
                    return !_.isEmpty(this.queue[layerId]);
                }
                return false;
            },
            add: function(layerId, ev) {
                var args = _.toArray(arguments).slice(2),
                    funcs;
                if (this.isBusy) { return; }
                if (!(layerId in this.queue)) {
                    this.queue[layerId] = [];
                }

                funcs = this.handlers[ev].apply(this.handlers, args);
                if (_.isArray(funcs)) {
                    //funcs.reverse();
                    _.each(funcs, function(func) {
                        this.queue[layerId].unshift(func);
                    }, this);
                } else {
                    this.queue[layerId].unshift(funcs);
                }
            },
            size: function() {
                return _.chain(this.queue)
                        .values()
                        .flatten()
                        .size()
                        .value();
            },
            width: function() {
                _.chain(this.queue)
                 .values()
                 .reject(_.isEmpty)
                 .size()
                 .value();
            },
            tick: function() {
                var ev;
                _.each(this.queue, function(subq, layerId) {
                    if (!_.isEmpty(subq)) {
                        ev = subq.pop();
                        ev(utils.getLayerById(layerId));
                    }
                }, this);
                this.isBusy = (this.size() > MAX_Q_LENGTH) || (this.width() > MAX_Q_WIDTH);
            }
        };
    };

    function forever(layers) {
      var remix = utils.getLayerSetByName(app.activeDocument, "remix");
      var layerQ = Q();

      while (1) {
          // opacity actions
          var surfacing;
 
          if (!layerQ.isBusy) {
              surfacing = candidate(remix.layers);
              if (surfacing) {
                  if (DEBUG) $.writeln("Surfacing ", surfacing.id);
                  if (surfacing.visible) {
                      layerQ.add(surfacing.id, 'fadeOut', surfacing.opacity);
                      layerQ.add(surfacing.id, 'moveBefore', remix);
                  }
                  layerQ.add(surfacing.id, 'popOrFadeIn');
              }

              //_.each(nVisibleLayers(layers, CONCURRENT_ACTIONS), function(layer) {
              //    layerQ.add(layer.id, 'fadeToRandomOpacity', layer.opacity);
              //});
          }

          if (DEBUG) $.writeln("Tick");
          layerQ.tick();
          if (DEBUG) $.writeln("Refresh");
          refresh();
      }
    }

    function candidate(layers) {
        return _.chain(layers)
            .rest(Math.floor((layers.length-1) * 0.6))
            .where({allLocked: false, isBackgroundLayer: false})
            .sample()
            .value();
    }

    function candidateForShowing(layers) {
        return _.findWhere(layers,
            {visible: false, allLocked: false, isBackgroundLayer: false});
    }

    function nVisibleLayers(layers, n) {
        var max_layer_idx = Math.min(
                layers.length - 1,
                Math.floor(layers.length * (TOP_PCT_OF_LAYERS_TO_VARY_OPACITY/100))
            ),
            layerlist = [],
            i,
            layer;
        // TODO: What if there aren't n visible layers?
        while (layerlist.length < n) {
            i = utils.getRandomInt(0, max_layer_idx);
            layer = layers[i];
            if (!layer.allLocked && !layer.isBackgroundLayer && layer.visible) {
                layerlist.push(layer);
            }
        }
        return layerlist;
    }

    return forever(utils.getAllArtLayers(app.activeDocument));
});
