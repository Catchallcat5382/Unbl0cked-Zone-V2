const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');

const source = fs.readFileSync('assets/community/community.js', 'utf8');
function extract(start, end) {
  return source.slice(source.indexOf(start), source.indexOf(end));
}

let reads = 0;
let writes = 0;
const docs = [{ data: () => ({ name: 'clip.mp4', type: 'video/mp4', data_url: 'https://example.com/clip.mp4' }) }];
const attachmentRef = { doc: () => ({}), orderBy: () => ({ limit: () => ({ get: async () => { reads++; return { docs }; } }) }) };
const itemRef = { id: 'message-1', collection: () => attachmentRef };
const collection = { doc: () => itemRef, add: async () => { writes++; return itemRef; } };
const batch = { set: () => { writes++; }, commit: async () => {} };
const state = { client: { db: { collection: () => collection, batch: () => batch } } };
const context = vm.createContext({ state, MAX_ATTACHMENTS: 20, console });
vm.runInContext(extract('  function fileToImageAttachment(', '  function showAttachmentChoice(') +
  extract('  async function createFirebaseItemWithAttachments(', '  async function attachFileToPost('), context);

(async () => {
  await assert.rejects(context.fileToImageAttachment({ name: 'large.mp4', type: 'video/mp4', size: 1000000 }), /Firebase Storage/);
  await context.createFirebaseItemWithAttachments('messages', { body: 'test' }, [{ name: 'clip.mp4' }]);
  assert.equal(writes, 2, 'one parent write and one attachment write');

  const first = [{ id: 'message-1', attachment_count: 1 }];
  await context.loadFirebaseAttachments('messages', first);
  assert.equal(reads, 1);
  const second = [{ id: 'message-1', attachment_count: 1 }];
  await context.loadFirebaseAttachments('messages', second);
  assert.equal(reads, 1, 'unchanged attachment should come from memory');
  assert.equal(second[0].attachments[0].name, 'clip.mp4');
  console.log('PASS: attachment write batching, MP4 limit, and cached reads.');
})().catch(error => { console.error(error); process.exitCode = 1; });
