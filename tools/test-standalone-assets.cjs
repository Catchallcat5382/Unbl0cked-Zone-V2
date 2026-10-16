const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const root = path.resolve(__dirname, '..');
const source = fs.readFileSync(path.join(root, 'assets', 'index.html'), 'utf8');
const standalone = fs.readFileSync(path.join(root, 'unblocked zone v2.html'), 'utf8');
const launcher = fs.readFileSync(path.join(root, 'assets', 'class.html'), 'utf8');

assert.match(standalone, /window\.UZ_EMBEDDED_CATALOG=/, 'standalone HTML must embed the game catalog');
assert.match(standalone, /window\.UZ_LOCAL_ASSETS = true/, 'standalone HTML must enable local asset paths');
assert.match(source, /File and asset check/, 'settings must expose the asset diagnostic');
assert.match(source, /Local copy is incomplete/, 'missing local assets must produce a useful error');
assert.match(source, /UZ_INLINE_IMAGE_FALLBACK/, 'broken thumbnails must have an inline fallback');
assert.doesNotMatch(source, /else if \(!getStartupBlockScreen\(\)\)/, 'startup must not bypass the selected screen');
assert.match(source, /setStartupLoadingScreen\(true\)/, 'the preset must enable its selected startup screen');
assert.match(launcher, /Unbl0cked-Zone-V2@" \+ _revision/, 'launcher must request an immutable source revision');
assert.doesNotMatch(launcher, /Unbl0cked-Zone-V2@cdn\/assets\/index\.html/, 'launcher must not depend on a stale moving CDN branch');

console.log('PASS: standalone catalog, local asset diagnostics, image fallback, and startup screen flow are present.');
