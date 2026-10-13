# Community backlog

The following requests are not yet implemented or verified. Do not describe them as shipped.

- Private DMs with close/reopen behavior, owner moderation visibility, disclosure to users, and Firestore access rules.
- Message reactions backed by shared storage and corresponding Firestore rules.
- Typing indicators and read receipts designed to avoid excessive Firestore writes and reads.
- Browser push while every site tab is closed (service worker, push subscription, server sender).
- One-account enforcement and ban/kick-linked alternate-account controls. Client-only device or IP checks cannot reliably enforce this.
- Kicked-account countdown and dismissible popup; appeal review and evidence upload improvements.
- Game-by-game launch testing and replacement of broken third-party assets.
- Full quote/reply threads rather than the current quoted-text reply.
- A first-party download endpoint if authenticated download records are required. Files already saved to another device cannot be remotely deleted.
- Firebase security-rule review and deployment for role, nickname, notification, moderation, and future DM/reaction writes. The rules are not in this checkout.
