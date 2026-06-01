# Admin Mode for Teacher Registration

This pull request adds teacher-only registration controls for extracurricular activities.

## Changes

- Added `src/teachers.json` to store teacher credentials.
- Added `/login`, `/logout`, and `/me` endpoints in `src/app.py`.
- Protected signup and unregister endpoints behind teacher authentication.
- Added a teacher login UI in `src/static/index.html`.
- Updated `src/static/app.js` to require login before registration actions.
- Added UI styling in `src/static/styles.css` for admin messaging.
