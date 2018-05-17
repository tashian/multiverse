/*globals define, $ */
define(["underscore", "utils"], function(_, utils) {
    var MAX_Q_WIDTH = 5,
        MAX_Q_LENGTH = 500;

    function FxQueue() {
        this.queue = {};
        this.isBusy = false;
    }

    var handlers = {
        hide: function() {
            return function(layer) {
                if (utils.DEBUG) $.writeln("Layer ", layer.id, " hiding");
                layer.visible = false;
            };
        },

        visible: function() {
            return function(layer) {
                if (utils.DEBUG) $.writeln("Layer ", layer.id, " visible but 0%");
                layer.opacity = 0;
                layer.visible = true;
            };
        },

        show: function() {
            return function(layer) {
                if (utils.DEBUG) $.writeln("Layer ", layer.id, " show");
                layer.opacity = 100;
                layer.visible = true;
            };
        },

        popIn: function() {
            return function(layer) {
                if (utils.DEBUG) $.writeln("Layer ", layer.id, " pop in");
                if (Math.random() < 0.25) {
                    layer.opacity = 100;
                } else {
                    layer.opacity = utils.getRandomInt(10, 100);
                }
            }
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

        fadeIn: function() {
            var events = [];
            events.push(this.visible());
            events = events.concat(this.fadeToRandomOpacity(0));
            return events;
        },

        fadeInCompletely: function() {
            var events = [];
            events.push(this.visible());
            events = events.concat(this.fade(0, 100));
            return events;
        },

        moveBefore: function(layerSet) {
            return function(layer) {
                if (utils.DEBUG) $.writeln("Layer ", layer.id, " move to top");
                layer.move(layerSet.layers[0], ElementPlacement.PLACEBEFORE);
            };
        },

        fade: function(fromOpacity, toOpacity) {
            var faders = _.map(utils.ease(fromOpacity, toOpacity), function(val) {
                return function(layer) {
                    if (utils.DEBUG) $.writeln("Layer ", layer.id, " opacity (", fromOpacity, "% -> ", toOpacity, "%) to ", val);
                    layer.opacity = val;
                };
            });
            return _.toArray(faders);
        },

        fadeOut: function(fromOpacity) {
            return this.fade(fromOpacity, 0);
        },

        fadeToRandomOpacity: function(fromOpacity) {
            return this.fade(fromOpacity, utils.getRandomInt(10, 100));
        },

        fadeToNonUniformRandomOpacity: function(fromOpacity) {
            return this.fade(fromOpacity, utils.getNonUniformRandom(10, 100));
        }
    };

    _.extend(FxQueue.prototype, {
        handlers: handlers,
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
        clear: function() {
            this.queue = {};
            this.isBusy = false;
        },
        isEmpty: function() {
            return (this.size() == 0);
        },
        size: function() {
            return _.chain(this.queue)
                    .values()
                    .flatten()
                    .size()
                    .value();
        },
        width: function() {
            return _.chain(this.queue)
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
            this.isBusy = (this.size() > MAX_Q_LENGTH);
        }
    });

    return FxQueue;
});
