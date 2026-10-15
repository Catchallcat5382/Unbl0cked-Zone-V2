const assert = require('node:assert/strict');
const fs = require('node:fs');

const source = fs.readFileSync('assets/community/community.js', 'utf8');
const html = fs.readFileSync('assets/index.html', 'utf8');

assert.match(html, /id="partners-members-list"/);
assert.match(source, /\$\('partners-members-list'\)\.innerHTML = html/);
assert.match(source, /loadMembers: function\(\)\{ loadMembers\(false\); \}/);
assert.match(source, /renderMembersStatus\(\(error && error\.message\) \|\| 'Members could not be loaded\.'\)/);

console.log('PASS: the dedicated Members page invokes the loader and receives success or error output.');
