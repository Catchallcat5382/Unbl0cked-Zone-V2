const assert = require('node:assert/strict');
const fs = require('node:fs');

const html = fs.readFileSync('assets/index.html', 'utf8');
const recovery = fs.readFileSync('recover.html', 'utf8');

assert.doesNotMatch(html, /uz-shutdown-|siteControl|Are you sure you want to shutdown/i);
assert.match(html, /rawRemove\.call\(localStorage, 'uzSite' \+ 'Shutdown'\)/);
assert.match(recovery, /localStorage\.removeItem\('uzSiteShutdown'\)/);
assert.match(recovery, /unblocked%20zone%20v2\.html\?recovered=/);

console.log('PASS: shutdown UI, key sequence, and Firebase control code are absent; legacy state is cleared at startup.');
