/*globals define, $ */
define(["underscore", "utils"], function(_, utils) {
    function Machine(initial_state) {
        this.states = {};
        this.transitions = {};
        this.state = initial_state;
    }

    _.extend(Machine.prototype, {
        tick: function() {
            var nextState = this.transitions[this.state][0],
                guard     = this.transitions[this.state][1];
            this.states[this.state]();
            if (guard()) {
                if (utils.DEBUG) $.writeln("Change state from ", this.state, " to ", nextState);
                this.state = nextState;
            }
        },
        add_transition: function(from, to, guard) {
            if (from in this.states) {
                this.transitions[from] = [to, guard];
            }
        },
        add_state: function(name, handler) {
            this.states[name] = handler;
        },
        always: function() { return true; }
    });

    return Machine;
});
