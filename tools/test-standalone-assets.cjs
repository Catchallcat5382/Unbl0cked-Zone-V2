const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const root = path.resolve(__dirname, '..');
const source = fs.readFileSync(path.join(root, 'assets', 'index.html'), 'utf8');
const standalone = fs.readFileSync(path.join(root, 'unblocked zone v2.html'), 'utf8');
const launcher = fs.readFileSync(path.join(root, 'assets', 'class.html'), 'utf8');

assert.match(standalone, /@cdn\/assets\//, 'downloaded HTML must load the current CDN branch');
assert.match(standalone, /@' \+ revision \+ '\/assets\//, 'downloaded HTML must have an immutable CDN fallback');
assert.match(standalone, /injectBase\(html, root\)/, 'downloaded HTML must resolve relative resources against the selected CDN');
assert.doesNotMatch(standalone, /UZ_LOCAL_ASSETS|new URL\('assets\/', location\.href\)/, 'downloaded HTML must never switch to local game assets');
assert.match(source, /File and asset check/, 'settings must expose the asset diagnostic');
assert.match(source, /UZ_INLINE_IMAGE_FALLBACK/, 'broken thumbnails must have an inline fallback');
assert.doesNotMatch(source, /localPackUrl|localAssetUrl|uzPreferLocalGameAssets/, 'game URLs must never be rewritten to local file paths');
assert.match(source, /function setGameImageSource/, 'game images must have an inline fallback');
assert.match(source, /new URL\('data\.json', document\.baseURI\)\.href/, 'the game catalog must load from the selected CDN base');
assert.doesNotMatch(source, /else if \(!getStartupBlockScreen\(\)\)/, 'startup must not bypass the selected screen');
assert.match(source, /setStartupLoadingScreen\(true\)/, 'the preset must enable its selected startup screen');
assert.match(launcher, /Unbl0cked-Zone-V2@" \+ _revision/, 'launcher must request an immutable source revision');
assert.doesNotMatch(launcher, /Unbl0cked-Zone-V2@cdn\/assets\/index\.html/, 'launcher must not depend on a stale moving CDN branch');

console.log('PASS: live CDN loader, remote catalog, image fallback, and startup screen flow are present.');
