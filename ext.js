/* <nowiki>
 * 
 * @module                  Demeter
 * @description             Oasis design wrapper and userscripting library for FANDOM Discussions.
 * @author                  Speedit
 * @version                 0.8.5
 * @license                 CC-BY-SA 3.0
 * 
 */
(function(xhr, ext, rel) {
    // Script variables.
    var api = 'https://api.github.com/repos/speeditor/demeter/releases/latest';
    /**
    * @function             ext.import
     */
    ext.init = function() {
        ext.tag = JSON.parse(this.responseText).tag_name;
        ['js', 'css'].forEach(ext.import);
    };
    // Script import logic (grants access to the browser context).
    /**
     * Import application script from Github.
     * @function            ext.import
     * @param               {string} c File extension.
     */
    ext.import = function(c) {
        var p = 'https://cdn.rawgit.com/speeditor/demeter/' + ext.tag +'/app.' + c;
        for (var n in ext.opts[c])
            rel[c].setAttribute(n, ext.opts[c][n]);
        switch (c) {
            case 'css':
                rel.css.disabled = true;
                rel.css.href = p;
                break;
            case 'js':
                rel.js.async = true;
                rel.js.src = p;
                rel.js.onload = function() {
                    rel.css.disabled = false;
                };
                break;
        }
        document.head.appendChild(rel[c]);
    };
    /**
     * Element attributes for imports.
     * @member              {Object} ext.opts
     */
    ext.opts = {
        'css': {
            'rel': 'stylesheet',
            'type': 'text/css',
            'crossorigin': 'anonymous'
        },
        'js': {
            'type': 'text/javascript',
            'crossorigin': 'anonymous'
        }
    };
    // Script bootloader (fetches script version).
    xhr.onload = ext.init;
    xhr.open('GET', api);
    xhr.send();
}(new XMLHttpRequest(), {}, {
    css: document.createElement('link'),
    js:  document.createElement('script')
}));