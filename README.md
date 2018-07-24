# demeter
Chrome extension that implements an Oasis design wrapper and userscript library for FANDOM Discussions.

## Documentation
The script creates a `window.demeter` object.

Modules:
* `demeter.events` - Discussions DOM events creation
  * `"discussions.boot"` - when Discussions is booting
  * `"discussions.init"` - when Discussions has initialized
  * `"discussions.navi"` - Discussions completing user navigation
  * `"discussions.mobi"` - Discussions entering the mobile responsive breakpoint
  * `"discussions.wide"` - Discussions entering the desktop responsive breakpoint
* `demeter.config` - Discussions configuration variables
  * `demeter.config.get` - get configuration by dot-delimited path string
  * `demeter.config.set` - set config value by dot-delimited path string
* `demeter.hook` - Discussions events framework
** `demeter.hook('event').add(fn)`
** `demeter.hook('event').remove(fn)`
** `demeter.hook('event').fire(i)`

## TO-DO
* API wrapper