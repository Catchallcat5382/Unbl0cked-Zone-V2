const assert = require('node:assert/strict');
const fs = require('node:fs');

const html = fs.readFileSync('assets/index.html', 'utf8');

assert.doesNotMatch(html, /uz-shutdown-|uzSiteShutdown|siteControl|Are you sure you want to shutdown/i);

console.log('PASS: shutdown UI, key sequence, storage, and Firebase control code are absent.');
