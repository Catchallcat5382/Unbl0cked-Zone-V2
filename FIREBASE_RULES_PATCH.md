# Firebase rules patch

The global shutdown switch uses the Firestore document `siteControl/shutdown`.
Merge this block inside the existing `match /databases/{database}/documents`
section of the project's Firestore rules, then publish the rules:

```text
match /siteControl/{documentId} {
  allow read: if true;
  allow write: if request.auth != null
    && exists(/databases/$(database)/documents/profiles/$(request.auth.uid))
    && get(/databases/$(database)/documents/profiles/$(request.auth.uid)).data.role in ['owner', 'co_owner'];
}
```

Do not replace the rest of the rules with this snippet. The account system still
needs its existing `profiles`, `posts`, `messages`, and related collection rules.
The owner account's profile document must have `role` set to `owner` or
`co_owner`; otherwise Firestore will correctly reject the shutdown write.

The downloadable HTML now bundles the Firebase JavaScript SDK locally, so a
school filter blocking `www.gstatic.com` no longer leaves a blank page. Firebase
API traffic still must be able to reach the configured Firebase project.
