const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');

const html = fs.readFileSync('assets/index.html', 'utf8');
const bootstrap = html.slice(html.indexOf('  <!-- Account-scoped'), html.indexOf('  <!-- Performance Mode')).match(/<script>([\s\S]*?)<\/script>/)[1];
const auth = fs.readFileSync('assets/community/auth-gate.js', 'utf8');
const siteBannedName = auth.slice(auth.indexOf('  function siteBannedName()'), auth.indexOf('  function recentDaysLeft('));

class Storage {
  constructor() { this.values = new Map(); }
  get length() { return this.values.size; }
  getItem(key) { return this.values.has(key) ? this.values.get(key) : null; }
  setItem(key, value) { this.values.set(key, String(value)); }
  removeItem(key) { this.values.delete(key); }
  key(index) { return [...this.values.keys()][index] || null; }
}

const localStorage = new Storage();
const sessionStorage = new Storage();
localStorage.setItem('uzLoginEmail', 'alice');
localStorage.setItem('uzacct:alice:uzSiteBanned', 'alice');
const context = vm.createContext({ Storage, localStorage, sessionStorage, window: {}, cleanUsername: value => String(value || '').toLowerCase().replace(/[^a-z0-9_.-]/g, '') });
vm.runInContext(bootstrap, context);
vm.runInContext(siteBannedName + 'window.siteBannedName = siteBannedName;', context);
assert.equal(context.window.siteBannedName(), 'alice');
assert.equal(localStorage.values.has('uzacct:alice:uzSiteBanned'), false);

localStorage.removeItem('uzLoginEmail');
assert.equal(context.window.siteBannedName(), 'alice', 'ban survives identity clearing and refresh');
localStorage.removeItem('uzSiteBanned');
assert.equal(context.window.siteBannedName(), '', 'clearing a ban does not restore a stale legacy marker');
sessionStorage.setItem('uzSiteBanned', 'alice');
assert.equal(context.window.siteBannedName(), 'alice', 'same-tab ban survives local storage loss');

const css = fs.readFileSync('assets/community/community.css', 'utf8');
assert.match(css, /\.uz-banned-card\{[^}]*max-height:[^}]*overflow-y:auto/);
console.log('PASS: ban state survives refresh and appeal card remains scrollable.');
