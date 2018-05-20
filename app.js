// ==UserScript==
// @name         OasisDiscussions
// @namespace    http://wikia.com/Help:Discussions
// @version      0.6a
// @description  Introduces the Oasis skin's design elements and userscripting capabilities to FANDOM Discussions.
// @author       http://dev.wikia.com/wiki/User:Speedit
// @run-at       document-idle
// @license      CC BY-SA 3.0;  http://creativecommons.org/licenses/by-sa/3.0/
// @require      http://code.jquery.com/jquery-3.2.1.min.js
// @match        *.wikia.com/d/*
// @grant        none
// ==/UserScript==
(function($) {

    var oasis = {
            // Script styling
            $discussionsStyles: $('<link>', {
                'rel': 'stylesheet',
                'href': '/load.php?' + $.param({
                    mode: 'articles',
                    articles: 'u:speedit:MediaWiki:OasisDiscussions.css',
                    only: 'styles',
                    debug: 'true'
                }),
                'crossorigin': 'anonymous'
            }),
            // Class list
            classList: ['skin-oasis'],
            // Class map
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
            themeSettings: {}
        },
        // Discussions variables
        discussions = {
            // Discussions events
            events: {
                t: 'animationstart',
                handlers: {
                    navi: {
                        fn: function(e) {
                            // Event handling
                            if (e.originalEvent.animationName !== 'discussions__navi' || !window.oasisDiscussionsInitialized) { return; }
                            // Event dispatcher
                            $(document.body).trigger('discussions.navi');
                        }
                    },
                    mobi: {
                        fn: function(e) {
                            // Event handling
                            if (e.originalEvent.animationName !== 'discussions__mobi' || !window.oasisDiscussionsInitialized) { return; }
                            // Event dispatcher
                            $(document.body).trigger('discussions.mobi');
                        }
                    },
                    wide: {
                        fn: function(e) {
                            // Event handling
                            if (e.originalEvent.animationName !== 'discussions__wide' || !window.oasisDiscussionsInitialized) { return; }
                            // Event dispatcher
                            $(document.body).trigger('discussions.wide');
                        }
                    }
                }
            }
        },
        CORSDomain = 'https://cors-anywhere.herokuapp.com';

    // Script functions
    var oasisDiscussions = {
            // Script initialiser
            init: function() {
                // Fastboot shoebox caching
                discussions.shoebox = {};
                $('script[type="fastboot/shoebox"]').each(function() {
                    var sid = this.id.match(/shoebox-([\s\S]+)$/)[1];
                    discussions.shoebox[sid] = JSON.parse(this.textContent);
                });
                // Function variables
                var s = ':root {',
                    // SASS URL generation
                    oasisSassUrl = [
                        CORSDomain,
                        'https://slot1-images.wikia.nocookie.net/__am',
                        discussions.shoebox.applicationData.wikiVariables.cacheBuster,
                        'sasses',
                        encodeURIComponent($.param(discussions.shoebox.applicationData.wikiVariables.theme)),
                        'skins/oasis/css/core/breakpoints-background.scss'
                    ].join('/');
                // Oasis styling
                $('<link>', {
                    'rel': 'stylesheet',
                    'href': oasisSassUrl,
                    'crossorigin': 'anonymous'
                }).appendTo(document.body);
                // Styling generator
                $.each(discussions.shoebox.applicationData.wikiVariables.theme, function(p, c) {
                    s += ' --' + p + ': ' + c + ';';
                });
                s += ' }';
                $('<style>', {
                    'id': 'oasisDiscussionsStyles',
                    'text': s
                }).appendTo(document.body);
                // Initial hook
                $(document.body).trigger('discussions.init');
                // Global status variable
                window.oasisDiscussionsInitialized = true;
                // Event dispatcher
                $.each(discussions.events.handlers, function(e, o) {
                    $(document.body).on(discussions.events.t, o.fn);
                });
                // Data fetching
                oasisDiscussions.data({'isInitialized': false});
            },
            // Data handler
            data: function(d) {
                // Wiki data
                var t = new Date().getTime(),
                    cb = Number(localStorage.oasisDiscussionsAge) || +t-21600000,
                    s = (typeof localStorage.oasisDiscussionsSettings === 'undefined');
                // Theme setup
                if (s || (t >= +cb+21600000)) {
                    $.get('/wiki/Special:BlankPage').done(function (w) {
                        oasisDiscussions.call(w, d);
                    });
                } else {
                    oasis.themeSettings = JSON.parse(localStorage.oasisDiscussionsSettings);
                    oasisDiscussions.theme(d);
                }
            },
            // Data call
            call: function(wikiPage, d) {
                // Body class retrieval
                var wikiClasses = wikiPage
                    .match(/<body class="([^"]*)"/)[1]
                    .split(' ').filter(function(u) {
                        return (u.length > 0);
                    });
                // Assign design settings
                $.each(oasis.classMap, function(s, p) {
                    var c = (wikiClasses.indexOf(p.className) > -1);
                    oasis.themeSettings[s] = p.reverse ? !c : c;
                });
                // Data caching
                localStorage.oasisDiscussionsSettings = JSON.stringify(oasis.themeSettings);
                localStorage.oasisDiscussionsAge = new Date().getTime();
                // Theming utility
                oasisDiscussions.theme(d);
            },
            // Theme configuration
            theme: function(d) {
                if (d.isInitialized) {
                    oasis.classList = ['skin-oasis'];
                }
                // Class iterator
                $.each(oasis.themeSettings, function(s, p) {
                    if (oasis.classMap[s].reverse === p) { return; }
                    var cls = oasis.classMap[s].className;
                    oasis.classList.push(cls);
                });
                // Script rendering
                if (!d.isInitialized) {
                    oasisDiscussions.render();
                } else {
                    oasisDiscussions.util.addClass(d);
                }
            },
            // Script rendering
            render: function() {
                // Script activation
                $(document.body).on('discussions.init', oasisDiscussions.handler.on);
                // Event delegation
                $(document.body).on('discussions.navi', oasisDiscussions.handler.on);
                $(document.body).on('discussions.mobi', oasisDiscussions.handler.off);
                $(document.body).on('discussions.wide', oasisDiscussions.handler.on);
                $(document.body).on('discussions.init', oasisDiscussions.handler.on);
            },
            // Event handlers
            handler: {
                on: function() {
                    var t = new Date().getTime(),
                        cb = Number(localStorage.oasisDiscussionsAge) || +t-21600000,
                        s = (typeof localStorage.oasisDiscussionsSettings === 'undefined');
                    // Theme setup
                    if (s || (t >= +cb+21600000)) {
                        oasisDiscussions.data({'isInitialized': true});
                    } else {
                        oasisDiscussions.util.addClass({'isInitialized': true});
                    }
                },
                off: function() {
                    oasisDiscussions.util.rmvClass({'isInitialized': true});
                }
            },
            // Script utilities
            util: {
                // Class addition
                addClass: function() {
                    oasis.classList.forEach(function(cls) {
                        $(document.body).addClass(cls);
                    });
                },
                // Class removal
                rmvClass: function() {
                    oasis.classList.forEach(function(cls) {
                        $(document.body).removeClass(cls);
                    });
                }
            }
        };

    // Script bootloader
    oasis.$discussionsStyles
        .on('load', oasisDiscussions.init)
        .appendTo(document.body);
 
}(window.jQuery))