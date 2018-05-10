/*globals define, $ */
define(["underscore", "utils"], function(_, utils) {
    var PollingTimer = function(duration) {
        this.duration = duration * 1000;
    };

    _.extend(PollingTimer.prototype, {
        // duration is in seconds
        start: function() {
            this.startTime = Date.now();
        },
        isFinished: function() {
            return (Date.now() > this.startTime + this.duration);
        },
    });

    PollingTimer.prototype.reset = PollingTimer.prototype.start;

    return PollingTimer;
});
