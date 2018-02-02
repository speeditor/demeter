// OasisDiscussions script
// Introduces the Oasis skin's design elements and userscripting capabilities to FANDOM Discussions.
// NOTE: DON'T import this from Github. The script is under testing.
(function($) {
    // Script variables
    var oasis = {
            // Script styling
            $discussionsStyles: $('<link>', {
                'rel': 'stylesheet',
                'href': '/load.php?' + $.param({
                    'mode': 'articles',
                    'articles': 'u:speedit:MediaWiki:OasisDiscussions.css',
                    'only': 'styles',
                    'debug': true,
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
            themeSettings: {},
        },
        // Discussions variables
        discussions = {
            // Discussions elements
            $application: $(document.body),
            application: document.body !== null ? document.body : null,
            head: document.head !== null ? document.head : null,
            // Discussions events
            events: {
                t: 'animationstart',
                boot: {
                    fn: function(e) {
                        // Event handling
                        if (e.originalEvent.animationName !== 'discussions__boot') { return; }
                        discussions.$application.trigger('discussions.boot');
                    }
                },
                handlers: {
                    init: {
                        fn: function(e) {
                            // Event handling
                            if (e.originalEvent.animationName !== 'discussions__init') { return; }
                            // DOM variables
                            discussions.$wrapper = $('.application-wrapper');
                            // Script status
                            setTimeout(function() {
                                window.oasisDiscussionsInitialized =
                                    oasisDiscussions.isInitialized =
                                    true;
                            }, 50);
                            // Event dispatcher
                            discussions.$application.trigger('discussions.init');
                        }
                    },
                    navi: {
                        fn: function(e) {
                            // Event handling
                            if (e.originalEvent.animationName !== 'discussions__navi' || !window.oasisDiscussionsInitialized) { return; }
                            // Event dispatcher
                            discussions.$application.trigger('discussions.navi');
                        }
                    },
                    mobi: {
                        fn: function(e) {
                            // Event handling
                            if (e.originalEvent.animationName !== 'discussions__mobi' || !window.oasisDiscussionsInitialized) { return; }
                            // Event dispatcher
                            discussions.$application.trigger('discussions.mobi');
                        }
                    },
                    wide: {
                        fn: function(e) {
                            // Event handling
                            if (e.originalEvent.animationName !== 'discussions__wide' || !window.oasisDiscussionsInitialized) { return; }
                            // Event dispatcher
                            discussions.$application.trigger('discussions.wide');
                        }
                    }
                }
            }
        },
        CORSDomain = 'https://cors-anywhere.herokuapp.com';

    // Script functions
    var oasisDiscussions = {
        // Script status variable
        isInitialized: false,
        // Preboot function
        boot: function() {
            // Script libraries
            e = M;
            m = Mercury;
            discussions.$application.on('discussions.boot', oasisDiscussions.init);
            if ($('.wds-spinner__screen-initializing').length > 0) {
                discussions.$application.trigger('discussions.boot');
            }
        },
        // Script initialiser
        init: function() {
            // Global status variable
            window.oasisDiscussionsInitialized = oasisDiscussions.isInitialized;
            // Event dispatcher
            $.each(discussions.events.handlers, function(e, o) {
                discussions.$application.on(discussions.events.t, discussions.events.handlers[e].fn);
            });
            // SASS URL generation
            var oasisSassUrl = [
                CORSDomain,
                'https://slot1-images.wikia.nocookie.net/__am',
                m.wiki.cacheBuster,
                'sasses',
                encodeURIComponent($.param(m.wiki.theme)),
                'skins/oasis/css/core/breakpoints-background.scss'
            ].join('/');
            // Oasis styling
            var oasisSass = $('<link>', {
                    'rel': 'stylesheet',
                    'href': oasisSassUrl,
                    'crossorigin': 'anonymous'
                }).appendTo(discussions.head);
            // Data fetching
            oasisDiscussions.data({'isInitialized': false});
        },
        // Data handler
        data: function (d) {
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
                .match(/<body class=\"([^"]*)\"/)[1]
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
                oasisDiscussions.render(d);
            } else {
                oasisDiscussions.util.addClass(d);
            }
        },
        // Script rendering
        render: function(d) {
            // Script activation
            discussions.$application.on('discussions.init', oasisDiscussions.handler.on);
            // Event delegation
            discussions.$application.on('discussions.navi', oasisDiscussions.handler.on);
            discussions.$application.on('discussions.mobi', oasisDiscussions.handler.off);
            discussions.$application.on('discussions.wide', oasisDiscussions.handler.on);
            discussions.$application.on('discussions.init', oasisDiscussions.handler.on);
        },
        // Event handlers
        handler: {
            on: function(e, d) {
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
            off: function(e, d) {
                oasisDiscussions.util.rmvClass({'isInitialized': true});
            }
        },
        // Script utilities
        util: {
            // Class addition
            addClass: function() {
                oasis.classList.forEach(function(cls) {
                    discussions.$application.addClass(cls);
                });
            },
            // Class removal
            rmvClass: function() {
                oasis.classList.forEach(function(cls) {
                    discussions.$application.removeClass(cls);
                });
            }
        }
    };

    // Script bootloader
    oasis.$discussionsStyles
        .on('load', oasisDiscussions.boot)
        .appendTo(discussions.head);

}(jQuery));
