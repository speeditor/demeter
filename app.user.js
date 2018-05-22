// ==UserScript==
// @name         OasisDiscussions
// @version      0.7.1
// @author       http://dev.wikia.com/wiki/User:Speedit
// @run-at       document-end
// @match        *.wikia.com/d/*
// ==/UserScript==
/**
 * 
 * @module              OasisDiscussions
 * @description         Introduces the Oasis skin's design elements and userscripting capabilities to FANDOM Discussions.
 * @author              Speedit
 * @version             0.7.1
 * @license             GNU GPL V2.0
 * 
 */
document.body.addEventListener('animationstart', function(e) {
    // Scope restriction
    if (e.animationName !== 'discussions__init') {
        return;
    }
    /**
     * Main OasisDiscussions script class.
     * @class od
     */
    var od = {};
    /**
     * Discussions animation    events module.
     * @class od.events
     */
    od.events = {
        /**
         * @member {string} t
         */
        t: 'animationstart',
        /**
         * @function handler
         * @param {Object} e jQuery event
         */
        handler: function(e) {
            var a = e.originalEvent.animationName.split('__');
            if (
                a[0] !== 'discussions' ||
                !window.oasisDiscussionsInitialized
            ) {
                return;
            }
            od.hook('discussions.' + a[1]).fire({ 'init': true });
        }
    };
    /**
     * Script hook module.
     * @member {Object} od.hook
     */
    od.hook = (function() {
        var lists = {};
        return function(name) {
            var list = lists[name] || (lists[name] = $.Callbacks('memory'));
            return {
                /** 
                 * @method od.hook.add
                 * @memberOf od.hook
                 */
                add: list.add,
                /** 
                 * @method od.hook.remove
                 * @memberOf od.hook
                 */
                remove: list.remove,
                /** 
                 * @method od.hook.fire
                 * @memberOf od.hook
                 */
                fire: function() {
                    return list.fireWith(null, [].slice.call(arguments));
                }
            };
        }
    }());
    /**
     * Oasis module.
     * @member {Object} od.oasis
     */
    od.oasis = {
        /**
         * Oasis module initialiser
         * @method init
         * @param d script state
         */
        init: function(d) {
            // Function variables
            var w = od.shoebox.applicationData.wikiVariables;
            // Oasis styling
            $('<link>', {
                'rel': 'stylesheet',
                'href': [
                    'https://cors-anywhere.herokuapp.com',
                    'https://slot1-images.wikia.nocookie.net/__am',
                    w.cacheBuster,
                    'sasses',
                    encodeURIComponent($.param(w.theme)),
                    'skins/oasis/css/core/breakpoints-background.scss'
                ].join('/'),
                'crossorigin': 'anonymous'
            }).appendTo(document.body);
            // Styling generator
            $('<style>', {
                'id': 'oasisDiscussionsStyles',
                'text': (function(t) {
                    return ':root { ' + Object.keys(t).map(function(p) {
                        return '--' + p + ': ' + t[p] + ';';
                    }).join(' ') + ' }'
                }(w.theme))
            }).appendTo(document.body);
            // Data fetching
            od.oasis.data(d);
        },
        /**
         * Oasis data handler
         * @method data
         * @param d script state
         */
        data: function(d) {
            // Wiki data
            var t = new Date().getTime();
            var cb = Number(localStorage.oasisDiscussionsAge) || +t-21600000;
            var s = (typeof localStorage.oasisDiscussionsSettings === 'undefined');
            // Theme setup
            if (s || (t >= +cb+21600000)) {
                $.get('/wiki/Special:BlankPage').done(function (w) {
                    od.oasis.call(w, d);
                });
            } else {
                od.oasis.themeSettings = JSON.parse(localStorage.oasisDiscussionsSettings);
                od.oasis.theme(d);
            }
        },
        /**
         * Oasis theme configuration
         * @method theme
         * @param d script state
         */
        call: function(wikiPage, d) {
            // Body class retrieval
            var wikiClasses = wikiPage
                .match(/<body class="([^"]*)"/)[1]
                .split(' ').filter(function(u) {
                    return (u.length > 0);
                });
            // Assign design settings
            $.each(od.oasis.classMap, function(s, p) {
                var c = (wikiClasses.indexOf(p.className) > -1);
                od.oasis.themeSettings[s] = p.reverse ? !c : c;
            });
            // Data caching
            localStorage.oasisDiscussionsSettings = JSON.stringify(od.oasis.themeSettings);
            localStorage.oasisDiscussionsAge = new Date().getTime();
            // Theming utility
            od.oasis.theme(d);
        },
        /**
         * Oasis theme configuration
         * @method theme
         * @param d script state
         */
        theme: function(d) {
            if (d.init) {
                od.oasis.classList = ['skin-oasis'];
            }
            // Class iterator
            $.each(od.oasis.themeSettings, function(s, p) {
                if (od.oasis.classMap[s].reverse === p) { return; }
                var cls = od.oasis.classMap[s].className;
                od.oasis.classList.push(cls);
            });
            // Script rendering
            if (!d.init) {
                od.oasis.render();
            }
            od.oasis.util.addClass(d);
        },
        /**
         * Oasis renderer
         * @method render
         */
        render: function() {
            // Script activation
            od.hook('discussions.init').add(od.oasis.handler.on);
            // Event delegation
            od.hook('discussions.navi').add(od.oasis.handler.on);
            od.hook('discussions.mobi').add(od.oasis.handler.off);
            od.hook('discussions.wide').add(od.oasis.handler.on);
            od.hook('discussions.init').add(od.oasis.handler.on);
        },
        /**
         * Oasis event handlers
         * @member {Object} handler
         */
        handler: {
            /**
             * Oasis styling activator
             * @method on
             */
            on: function() {
                var t = new Date().getTime();
                var cb = Number(localStorage.oasisDiscussionsAge) || +t-21600000;
                var s = (typeof localStorage.oasisDiscussionsSettings === 'undefined');
                // Theme setup
                if (s || (t >= +cb+21600000)) {
                    od.oasis.util.rmvClass();
                    od.oasis.data({ 'init': true });
                } else {
                    od.oasis.util.addClass();
                }
            },
            /**
             * Oasis styling deactivator
             * @method off
             */
            off: function() {
                od.oasis.util.rmvClass();
            }
        },
        /**
         * Oasis utilities
         * @member {Object} util
         */
        util: {
            /**
             * Oasis class addition
             * @method addClass
             */
            addClass: function() {
                od.oasis.classList.forEach(function(cls) {
                    $(document.body).addClass(cls);
                });
            },
            /**
             * Oasis class removal
             * @method rmvClass
             */
            rmvClass: function() {
                od.oasis.classList.forEach(function(cls) {
                    $(document.body).removeClass(cls);
                });
            }
        },
        /**
         * Class list cache
         * @member {Array} classList
         */
        classList: ['skin-oasis'],
        /**
         * Class map
         * @member {Object} classMap
         */
        classMap: {
            'background-fix': {
                reverse: false,
                className: 'background-fixed'
            },
            'background-split': {
                reverse: true,
                className: 'background-not-split'
            },
            'background-tile': {
                reverse: true,
                className: 'background-not-tiled'
            }
        },
        /**
         * Settings cache
         * @member {Object} themeSettings
         */
        themeSettings: {}
    };
    /**
     * Module registry
     * @member {Array} od.modules
     */
    od.modules = Object.keys(od).filter(function(m) {
        return (
            typeof od[m] === 'object' &&        // class check
            typeof od[m].init === 'function'    // init check
        );
    });
    /**
     * Script initializer
     * @method od.init
     */
    od.init = (function() {
        // Fastboot shoebox caching
        od.shoebox = {};
        $('script[type="fastboot/shoebox"]').each(function() {
            var sid = this.id.match(/shoebox-([\s\S]+)$/)[1];
            od.shoebox[sid] = JSON.parse(this.textContent);
        });
        // Global status variable
        window.oasisDiscussionsInitialized = true;
        // Initial hook
        $(document.body).trigger('discussions.init');
        // Event dispatcher
        $(document.body).on(od.events.t, od.events.handler);
        // Module initializers
        od.modules.forEach(function(m) {
            od[m].init({ 'init': false });
        });
    }());
});
/**
 * Application styling
 * @param {Object} app Stylesheet settings
 */
(function(app) {
    // Stylesheet attributes
    Object.keys(app.m).forEach(function(a) {
        app.s.setAttribute(a, app.m[a]);
    });
    // Stylesheet insertion
    document.body.appendChild(app.s);
})({
    /**
     * Stylesheet element
     * @alias app.s
     * @memberof! app
     */
    s: document.createElement('link'),
    /**
     * Stylesheet attributes
     * @alias app.m
     * @memberof! app
     */
    m: {
        'rel': 'stylesheet',
        'href': (function(o) {
            return '/load.php?' + Object.keys(o).map(function(k) {
                return encodeURIComponent(k) + '=' + encodeURIComponent(o[k]);
            }).join('&');
        }({
            mode: 'articles',
            articles: 'u:speedit:MediaWiki:OasisDiscussions.css',
            only: 'styles',
            debug: '1'
        }))
    }
})