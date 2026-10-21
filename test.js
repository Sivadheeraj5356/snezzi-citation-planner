const assert = require('node:assert/strict');
const { parseLines, plan } = require('./app.js');

const items = parseLines('best crm for dentists | Client | BigCRM | comparison | medium\nwhat is crm | Client | | guide | high');
assert.equal(items.length, 2);
const ranked = plan('best crm for dentists | Client | BigCRM | comparison | medium\nwhat is crm | Client | | guide | high');
assert.equal(ranked[0].type, 'comparison');
assert.ok(ranked[0].score > ranked[1].score);
console.log('3 tests passed');
