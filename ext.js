/* <nowiki>
 * 
 * @module                  Demeter
 * @description             Oasis design wrapper and userscripting library for FANDOM Discussions.
 * @author                  Speedit
 * @version                 0.8.0
 * @license                 CC-BY-SA 3.0
 * 
 */
(function(xhr, ext, s, l) {
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
    ext.import = function(t, c) {
        var p = 'https://cdn.rawgit.com/speeditor/demeter/' + ext.tag +'/app.' + c;
        switch (c) {
            case 'css':
                for (var a1 in ext.opts.css) l.setAttribute(a1, ext.opts.css[a1]);
                l.disabled = true;
                l.href = p;
                document.head.appendChild(l);
                break;
            case 'js':
                for (var a2 in ext.opts.js) s.setAttribute(a2, ext.opts.js[a2]);
                s.async = true;
                s.src = p;
                s.onload = function() {
                    l.disabled = false;
                };
                document.head.appendChild(s);
                break;
        }
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
    css: document.createElement('script'),
    js:  document.createElement('link')
}));