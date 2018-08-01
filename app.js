document.body.addEventListener('animationstart', function(e) {
    // Scope restriction
    if (e.animationName !== 'discussions__init') {
        return;
    }
    window.demeter = {};
    // Discussions events module.
    demeter.events = {
        init: function() {
            // Initial hook.
            $(document.body).trigger('demeter.init');
            // Event dispatcher.
            $(document.body).on(demeter.events.t, demeter.events.handler);
            // Initial events.
            $(document.body).trigger({
                type: demeter.events.t,
                originalEvent: {
                    animationName: 'discussions__init'
                }
            }).find('.discussion-content-wrapper').trigger({
                type: demeter.events.t,
                originalEvent: {
                    animationName: 'discussions__content'
                }
            });
        },
        // Discussions animation-driven event logic.
        t: 'animationstart',
        handler: function(e) {
            var a = e.originalEvent.animationName.split('__');
            if (
                a[0] !== 'discussions' ||
                !window.demeter.isInitialized
            ) {
                return;
            }
            var d = demeter.events.data();
            demeter.hook('discussions.' + a[1]).fire(d);
        },
        // Discussions event data extractor.
        data: function() {
            var $t = $([
                '.post-title',
                '.discussion-left-rail__header'
            ].join(', ')).eq(0);
            return {
                view: $('.discussion-error').exists() ?
                    'error' :
                    (function(p) {
                        switch (p) {
                            case ('f'):
                                return 'post-list';
                            case ('p'):
                                return 'post-details';
                            case ('u'):
                                return 'user-list';
                            case ('m'):
                                return 'user-activity';
                            case ('g'):
                                return 'guidelines';
                            case ('reported'):
                                return 'report-dialog';
                        }
                    }(window.location.pathname.split('/')[2])),
                title: $t.exists() ?
                    $t.text() :
                    demeter.i18n.msg('title')
            };
        }
    };
    // Userscripting hook module.
    demeter.hook = (function() {
        var lists = {};
        return function(name) {
            var list = lists[name] || (lists[name] = $.Callbacks('memory'));
            return {
                // Callback addition.
                add: list.add,
                // Callback removal.
                remove: list.remove,
                // Callback invocation.
                fire: function() {
                    return list.fireWith(null, [].slice.call(arguments));
                }
            };
        };
    }());
    // Configuration module.
    demeter.config = {
        init: function() {
            $('script[type="fastboot/shoebox"]').each(function() {
                var sid = this.id.match(/shoebox-([\s\S]+)$/)[1];
                demeter.config._values[sid] = JSON.parse(this.textContent);
            });
        },
        // Configuration getter.
        get: function(s) {
            return s.split('.').reduce(function(o, a) {
                return o[a];
            }, demeter.config._values);
        },
        // Configuration setter.
        set: function(s, v) {
            if (typeof s === 'string') {
                return demeter.config.set(
                    demeter.config._values,
                    s.split('.'),
                    v
                );
            } else if (s.length === 1 && v) {
                return (demeter.config._values[s[0]] = v);
            } else if (s.length === 0) {
                return demeter.config._values;
            } else {
                return demeter.config.set(
                    demeter.config._values[s[0]],
                    s.slice(1),
                    v
                );
            }
        },
        // Configuration cache.
        _values: {}
    };
    // Oasis module.
    demeter.oasis = {
        // Oasis module initialiser.
        init: function(d) {
            // Function variables.
            var w = demeter.config.get('applicationData.wikiVariables');
            // Oasis styling.
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
            // Styling generator.
            $('<style>', {
                'id': 'demeter_css',
                'text': (function(t) {
                    return ':root { ' + Object.keys(t).map(function(p) {
                        return '--' + p + ': ' + t[p] + ';';
                    }).join(' ') + ' }';
                }(w.theme))
            }).appendTo(document.body);
            // Data fetching.
            demeter.oasis.data(d);
        },
        // Oasis data handler.
        data: function(d) {
            // Wiki data.
            var t = new Date().getTime(),
                cb = Number(localStorage.demeterAge) || +t-21600000,
                s = (typeof localStorage.demeterSettings === 'undefined');
            // Theme setup.
            if (s || (t >= +cb+300000)) {
                $.get('/wiki/Special:BlankPage').done(function(w) {
                    demeter.oasis.call(w, d);
                });
            } else {
                demeter.oasis.themeSettings = JSON.parse(localStorage.demeterSettings);
                demeter.oasis.theme(d);
            }
        },
        // Oasis theme settings extraction.
        call: function(w, d) {
            // Body class retrieval.
            var wc = w
                .match(/<body class="([^"]*)"/)[1]
                .split(' ').filter(function(u) {
                    return !!u.length;
                });
            // Assign design settings.
            $.each(demeter.oasis.classMap, function(s, p) {
                var c = (wc.indexOf(p.className) > -1);
                demeter.oasis.themeSettings[s] = p.reverse ? !c : c;
            });
            // Data caching.
            localStorage.demeterSettings = JSON.stringify(demeter.oasis.themeSettings);
            localStorage.demeterAge = new Date().getTime();
            // Theming utility.
            demeter.oasis.theme(d);
        },
        // Oasis theme configuration.
        theme: function(d) {
            if (d.init) {
                demeter.oasis.classList = ['skin-oasis'];
            }
            // Class iterator.
            $.each(demeter.oasis.themeSettings, function(s, p) {
                if (demeter.oasis.classMap[s].reverse === p) { return; }
                var cls = demeter.oasis.classMap[s].className;
                demeter.oasis.classList.push(cls);
            });
            // Script rendering.
            if (!d.init) {
                demeter.oasis.render();
            }
            demeter.oasis.util.addClass(d);
        },
        // Oasis renderer.
        render: function() {
            // Event delegation.
            demeter.hook('discussions.content').add(demeter.oasis.handler.on);
            demeter.hook('discussions.mobile').add(demeter.oasis.handler.off);
            demeter.hook('discussions.desktop').add(demeter.oasis.handler.on);
            demeter.hook('discussions.init').add(demeter.oasis.handler.on);
        },
        // Oasis event handlers.
        handler: {
            // Oasis styling activator.
            on: function() {
                var t = new Date().getTime(),
                    cb = Number(localStorage.demeterAge) || +t-21600000,
                    s = (typeof localStorage.demeterSettings === 'undefined');
                // Remove existing classes.
                demeter.oasis.util.rmvClass();
                // Theme setup.
                if (s || (t >= +cb+21600000)) {
                    demeter.oasis.data({ 'init': true });
                } else {
                    demeter.oasis.util.addClass();
                }
            },
            // Oasis styling deactivator.
            off: function() {
                demeter.oasis.util.rmvClass();
            }
        },
        // Oasis module utilities.
        util: {
            // Oasis class addition.
            addClass: function() {
                demeter.oasis.classList.forEach(function(cls) {
                    $(document.body).addClass(cls);
                });
            },
            // Oasis class removal.
            rmvClass: function() {
                demeter.oasis.classList.forEach(function(cls) {
                    $(document.body).removeClass(cls);
                });
            }
        },
        // Class list cache.
        classList: ['skin-oasis'],
        // Class map.
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
        // Settings cache.
        themeSettings: {}
    };
    /**
     * Module registry
     * @member {Array} od.modules
     */
    demeter.modules = Object.keys(demeter).filter(function(m) {
        return (
            typeof demeter[m] === 'object' &&        // module check
            typeof demeter[m].init === 'function'    // init fn check
        );
    });
    /**
     * Script initializer
     * @method od.init
     */
    demeter.init = (function() {
        // Global status variable
        demeter.isInitialized = true;
        // Module initializers
        demeter.modules.forEach(function(m) {
            demeter[m].init({ 'init': false });
        });
    }());
});