# oasis-discussions
OasisDiscussions wrapper and events library for FANDOM Discussions.

## Documentation
The script creates a discussions object.
* `discussions.events` - Discussions DOM events creation
  * `"discussions.boot"` - when Discussions is booting
  * `"discussions.init"` - when Discussions has initialized
  * `"discussions.navi"` - Discussions completing user navigation
  * `"discussions.mobi"` - Discussions entering the mobile responsive breakpoint
  * `"discussions.wide"` - Discussions entering the desktop responsive breakpoint
* `discussions.$application` - alias for document.body
* `discussions.$wrapper` - alias for element `.application-wrapper` (**ONLY** available after discussions.init event)

## TO-DO
* Full documentation
* Working Github import (currently works in Tampermonkey with `@run-at document-body` setting)
* UI modifications for consistency with Oasis
* Rail activity module
