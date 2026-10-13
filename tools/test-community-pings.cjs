const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');

const source = fs.readFileSync('assets/community/community.js', 'utf8');
const start = source.indexOf('  async function sendMessageV2() {');
const end = source.indexOf('  async function sendPostMessage()', start);
assert.ok(start >= 0 && end > start);

const input = { value: 'Hi @bob' };
const delivered = [];
const context = vm.createContext({
  firebaseMode: true,
  state: { pendingChatAttachments: [], replyTo: null },
  $: () => input,
  replyBody: text => text,
  updateReplyPreview: () => {},
  rejectRestrictedMention: () => false,
  sendMessage: async () => { input.value = ''; },
  notifyMentionedUsers: async (text, target) => delivered.push({ text, target })
});
vm.runInContext(source.slice(start, end), context);
context.sendMessageV2().then(() => {
  assert.equal(delivered.length, 1);
  assert.equal(delivered[0].text, 'Hi @bob');
  assert.equal(delivered[0].target.tab, 'chat');
  console.log('PASS: plain text chat pings notify recipients.');
}).catch(error => { console.error(error); process.exitCode = 1; });
