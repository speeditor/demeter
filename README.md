# demeter
Chrome extension that implements an Oasis design wrapper and userscript library for FANDOM Discussions.

## Documentation
The script creates a `window.demeter` object.

Userscripting modules:
* `demeter.events` - Discussions DOM events creation
  * `"discussions.init"` - when Discussions has initialized
  * `"discussions.content"` - Discussions completing user navigation
  * `"discussions.mobile"` - Discussions entering the mobile responsive breakpoint
  * `"discussions.desktop"` - Discussions entering the desktop responsive breakpoint
* `demeter.config` - Discussions configuration variables
  * `demeter.config.get` - get configuration by dot-delimited path string
  * `demeter.config.set` - set config value by dot-delimited path string
* `demeter.hook` - Discussions events framework
  * `demeter.hook('event').add(fn)`
  * `demeter.hook('event').remove(fn)`
  * `demeter.hook('event').fire(i)`

## TO-DO
* Oasis page header
* Rail activity module
* API wrapper