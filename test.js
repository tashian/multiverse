var expect = require('chai').expect;
var common = require('./Scripts/common.jsxinc');

expect(common.getRandomOpacity()).to.be.at.least(1);
expect(common.getRandomOpacity()).to.be.at.most(100);

var s = common.sigmoid(10, 20, 4);
expect(s()).to.equal(10);
expect(s()).to.equal(13);
expect(s()).to.equal(15);
expect(s()).to.equal(17);
expect(s()).to.equal(20);

