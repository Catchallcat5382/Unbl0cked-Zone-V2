const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');

const source = fs.readFileSync('assets/community/community.js', 'utf8');
function section(start, end) { return source.slice(source.indexOf(start), source.indexOf(end)); }

let subscriptions = 0;
let removals = 0;
let deliveries = 0;
let onSnapshot;
const query = { onSnapshot(callback) { subscriptions++; onSnapshot = callback; return () => { removals++; }; } };
const collection = { limit: () => query, orderBy: () => ({ limit: () => query }) };
const state = {
  tab: 'chat', user: { id: 'alice' }, realtime: null, snapshotCollection: null,
  snapshotUserId: null, latestSnapshot: null,
  client: { db: { collection: () => collection } }
};
const context = vm.createContext({
  state, ready: true, firebaseMode: true, firebaseAvailable: () => true,
  loadItems: () => { deliveries++; }, firebaseCooldown: () => {},
  console
});
vm.runInContext(section('  function stopFirebaseListeners()', '  async function refreshSession(') +
  section('  function subscribe() {', "  document.addEventListener('uz-notification-open'"), context);

context.subscribe();
context.subscribe();
assert.equal(subscriptions, 1, 'same tab must keep its existing listener');
onSnapshot({ docs: [] });
assert.equal(deliveries, 1);

state.tab = 'posts';
context.subscribe();
assert.equal(subscriptions, 2);
assert.equal(removals, 1);
state.user = { id: 'bob' };
context.subscribe();
assert.equal(subscriptions, 3, 'account switch must attach a new listener');
assert.equal(removals, 2);

state.profileRealtime = () => { removals++; };
state.notificationUnsub = () => { removals++; };
context.stopFirebaseListeners();
assert.equal(removals, 5, 'sign-out must release all three listeners');
assert.equal(state.realtime, null);
assert.equal(state.notificationUnsub, null);
assert.equal(state.latestSnapshot, null);
console.log('PASS: community listeners are reused and cleaned up.');
