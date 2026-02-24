(function () {
    const mediaQuery = window.matchMedia('(max-width: 767px)');

    const head = document.querySelector('.gh-head');
    const menu = head.querySelector('.gh-head-menu');
    const nav = menu.querySelector('.nav');
    if (!nav) return;

    const logo = document.querySelector('.gh-head-logo');
    const navHTML = nav.innerHTML;
    const pinnedLabels = new Set(['podcast', 'newsletter']);
    const pinnedPaths = ['/podcast/', '/newsletter/', '/tag/podcast/', '/tag/newsletter/'];

    const normalizePath = function (value) {
        if (!value) return '/';
        let path = value.toLowerCase();
        if (!path.startsWith('/')) {
            path = '/' + path;
        }
        if (!path.endsWith('/')) {
            path += '/';
        }
        return path;
    };

    const getLinkPath = function (link) {
        const href = link.getAttribute('href') || '';
        try {
            return normalizePath(new URL(href, window.location.origin).pathname);
        } catch (error) {
            return normalizePath(href);
        }
    };

    const updateNavCurrent = function () {
        const items = Array.from(nav.querySelectorAll('li')).map(function (item) {
            const link = item.querySelector('a');
            if (!link) return null;
            return {
                element: item,
                label: (link.textContent || '').trim().toLowerCase(),
                path: getLinkPath(link),
            };
        }).filter(Boolean);

        if (!items.length) return;

        const currentPath = normalizePath(window.location.pathname);
        const bodyClasses = new Set((document.body.className || '').split(/\s+/).filter(Boolean));
        const hasBodyClass = function (value) {
            return bodyClasses.has(value);
        };

        const clearCurrent = function () {
            items.forEach(function (item) {
                item.element.classList.remove('nav-current');
            });
        };

        const setCurrent = function (predicate) {
            const match = items.find(predicate);
            if (!match) return false;
            clearCurrent();
            match.element.classList.add('nav-current');
            return true;
        };

        const matchesPath = function (prefixes) {
            return prefixes.some(function (prefix) {
                return currentPath.startsWith(normalizePath(prefix));
            });
        };

        const setByLabelOrPath = function (label, paths) {
            return setCurrent(function (item) {
                if (label && item.label === label) return true;
                if (paths && paths.includes(item.path)) return true;
                return false;
            });
        };

        if (matchesPath(['/newsletter/', '/tag/newsletter/']) || hasBodyClass('page-newsletter') || hasBodyClass('tag-newsletter')) {
            if (setByLabelOrPath('newsletter', ['/newsletter/', '/tag/newsletter/'])) return;
        }

        if (matchesPath(['/podcast/', '/tag/podcast/']) || hasBodyClass('page-podcast') || hasBodyClass('tag-podcast')) {
            if (setByLabelOrPath('podcast', ['/podcast/', '/tag/podcast/'])) return;
        }

        if (matchesPath(['/talk/', '/talks/']) || hasBodyClass('page-talk') || hasBodyClass('page-talks') || hasBodyClass('tag-talk') || hasBodyClass('tag-talks')) {
            if (setByLabelOrPath('talks', ['/talk/', '/talks/'])) return;
        }

        if (matchesPath(['/calendar/']) || hasBodyClass('page-calendar')) {
            if (setByLabelOrPath('calendar', ['/calendar/'])) return;
        }

        if (matchesPath(['/blog/']) || hasBodyClass('page-blog') || hasBodyClass('tag-blog')) {
            if (setByLabelOrPath('blog', ['/blog/'])) return;
        }

        if (hasBodyClass('post-template')) {
            if (setByLabelOrPath('blog', ['/blog/'])) return;
        }

        if (currentPath === '/' || hasBodyClass('home-template')) {
            if (setByLabelOrPath('home', ['/'])) return;
        }

        setCurrent(function (item) {
            return item.path === currentPath;
        });
    };
    const isPinnedItem = function (item) {
        const link = item.querySelector('a');
        if (!link) return false;
        const label = (link.textContent || '').trim().toLowerCase();
        if (pinnedLabels.has(label)) return true;
        const href = (link.getAttribute('href') || '').toLowerCase();
        return pinnedPaths.some((path) => href.includes(path));
    };

    if (mediaQuery.matches) {
        const items = nav.querySelectorAll('li');
        items.forEach(function (item, index) {
            item.style.transitionDelay = 0.03 * (index + 1) + 's';
        });
    }

    var windowClickListener;
    const makeDropdown = function () {
        updateNavCurrent();
        if (mediaQuery.matches) return;
        const submenuItems = [];

        while ((nav.offsetWidth + 64) > menu.offsetWidth) {
            let candidate = nav.lastElementChild;
            while (candidate && isPinnedItem(candidate)) {
                candidate = candidate.previousElementSibling;
            }
            if (!candidate) {
                break;
            }
            submenuItems.unshift(candidate);
            candidate.remove();
        }

        if (!submenuItems.length) {
            document.body.classList.add('is-dropdown-loaded');
            return;
        }

        const toggle = document.createElement('button');
        toggle.setAttribute('class', 'nav-more-toggle');
        toggle.setAttribute('aria-label', 'More');
        toggle.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" fill="currentColor"><path d="M21.333 16c0-1.473 1.194-2.667 2.667-2.667v0c1.473 0 2.667 1.194 2.667 2.667v0c0 1.473-1.194 2.667-2.667 2.667v0c-1.473 0-2.667-1.194-2.667-2.667v0zM13.333 16c0-1.473 1.194-2.667 2.667-2.667v0c1.473 0 2.667 1.194 2.667 2.667v0c0 1.473-1.194 2.667-2.667 2.667v0c-1.473 0-2.667-1.194-2.667-2.667v0zM5.333 16c0-1.473 1.194-2.667 2.667-2.667v0c1.473 0 2.667 1.194 2.667 2.667v0c0 1.473-1.194 2.667-2.667 2.667v0c-1.473 0-2.667-1.194-2.667-2.667v0z"></path></svg>';

        const wrapper = document.createElement('div');
        wrapper.setAttribute('class', 'gh-dropdown');

        if (submenuItems.length >= 10) {
            document.body.classList.add('is-dropdown-mega');
            wrapper.style.gridTemplateRows = 'repeat(' + Math.ceil(submenuItems.length / 2) + ', 1fr)';
        } else {
            document.body.classList.remove('is-dropdown-mega');
        }

        submenuItems.forEach(function (child) {
            wrapper.appendChild(child);
        });

        toggle.appendChild(wrapper);
        nav.appendChild(toggle);

        document.body.classList.add('is-dropdown-loaded');
        updateNavCurrent();

        toggle.addEventListener('click', function () {
            document.body.classList.toggle('is-dropdown-open');
        });

        windowClickListener = function (e) {
            if (!toggle.contains(e.target) && document.body.classList.contains('is-dropdown-open')) {
                document.body.classList.remove('is-dropdown-open');
            }
        };
        window.addEventListener('click', windowClickListener);
    }

    imagesLoaded(head, function () {
        makeDropdown();
        updateNavCurrent();
    });

    window.addEventListener('resize', function () {
        setTimeout(function () {
            window.removeEventListener('click', windowClickListener);
            nav.innerHTML = navHTML;
            makeDropdown();
            updateNavCurrent();
        }, 1);
    });
})();
