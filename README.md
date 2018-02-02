# oasis-discussions
OasisDiscussions wrapper and events library for FANDOM Discussions.

## Documentation
The script creates a discussions object.
* `discussions.events` - Discussions DOM events
** `"discussions.init"` - when Discussions has initialized
** `"discussions.navi"` - when Discussions completes user navigation
** `"discussions.mobi"` - when Discussions enters the mobile responsive breakpoint
** `"discussions.wide"` - when Discussions enters the desktop responsive breakpoint
* `discussions.$application` - alias for document.body
* `discussions.$wrapper` - alias for '.application-wrapper' element (**ONLY** available after discussions.init event)

## TO-DO
* Full documentation
* Working Github import (currently works in Tampermonkey with `@run-at document-body` setting)
* UI modifications for consistency with Oasis
* Rail activity module
