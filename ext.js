/* <nowiki>
 * 
 * @module                  Demeter
 * @description             Oasis design wrapper and userscripting library for FANDOM Discussions.
 * @author                  Speedit
 * @version                 0.8.0
 * @license                 CC-BY-SA 3.0
 * 
 */
(function(xhr, ext, s) {
    // Script variables.
    var api = 'https://api.github.com/repos/speeditor/demeter/releases/latest';
    /**
    * @function             ext.import
     */
    ext.init = function() {
        var t = JSON.parse(this.responseText).tag_name;
        ext.import(t);
    };
    // Script import logic (grants access to the browser context).
    /**
     * Import application script from Github.
     * @function            ext.import
     * @param               {string} t Demeter release tag.
     */
    ext.import = function(t) {
        for (var p in ext.opts)
            s.setAttribute(p, ext.opts[p]);
        s.async = true;
        s.src = ext.path(t);
        document.head.appendChild(s);
    };
    /**
     * Script element attributes for import.
     * @member              {Object} ext.opts
     */
    ext.opts = {
        'type': 'text/javascript',
        'crossorigin': 'anonymous'
    };
    /**
     * Application script path (uses Rawgit).
     * @function            ext.path
     * @param               {string} t Demeter release tag.
     */
    ext.path = function(t) {
        return 'https://cdn.rawgit.com/speeditor/demeter/' + t +'/app.js';
    };
    // Script bootloader (fetches script version).
    xhr.onload = ext.init;
    xhr.open('GET', api);
    xhr.send();
}(new XMLHttpRequest(), {}, document.createElement('script')));