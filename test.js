var requirejs = require('requirejs');
var expect = require('chai').expect;
var common = requirejs('./lib/common.js');

var s = common.sigmoid(10, 20, 8);
console.log(s);
expect(s).to.equal([10, 13, 15, 17, 20]);

