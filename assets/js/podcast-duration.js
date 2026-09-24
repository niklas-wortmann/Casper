(function () {
    function parseSeconds(value) {
        if (value == null || value === '') {
            return null;
        }

        if (typeof value === 'number' && isFinite(value) && value > 0) {
            return value;
        }

        var text = String(value).trim();
        if (!text || /read/i.test(text)) {
            return null;
        }

        if (/^\d+(\.\d+)?$/.test(text)) {
            var numeric = parseFloat(text);
            return numeric > 0 ? numeric : null;
        }

        var parts = text.split(':');
        if (parts.length === 2 || parts.length === 3) {
            var numbers = parts.map(function (part) {
                return parseFloat(part);
            });
            if (numbers.some(function (part) { return !isFinite(part); })) {
                return null;
            }
            if (parts.length === 3) {
                return numbers[0] * 3600 + numbers[1] * 60 + numbers[2];
            }
            return numbers[0] * 60 + numbers[1];
        }

        return null;
    }

    function formatDuration(seconds) {
        seconds = Math.round(seconds);
        var hours = Math.floor(seconds / 3600);
        var minutes = Math.floor((seconds % 3600) / 60);

        if (hours > 0) {
            return hours + ' hr ' + minutes + ' min';
        }

        if (minutes < 1) {
            return '1 min';
        }

        return minutes + ' min';
    }

    function durationFromPage() {
        var script = document.getElementById('podcast-listen-links');
        if (script) {
            try {
                var links = JSON.parse(script.textContent || '{}');
                var fromJson = parseSeconds(links.duration || links.duration_seconds);
                if (fromJson) {
                    return fromJson;
                }
            } catch (error) {
                // Fall through to the audio card.
            }
        }

        var durationNode = document.querySelector('.kg-audio-duration');
        if (durationNode) {
            var fromLabel = parseSeconds(durationNode.textContent);
            if (fromLabel) {
                return fromLabel;
            }
        }

        var audio = document.querySelector('.kg-audio-card audio');
        if (audio && isFinite(audio.duration) && audio.duration > 0) {
            return audio.duration;
        }

        return null;
    }

    function applyDuration(seconds) {
        if (!seconds) {
            return;
        }

        var label = formatDuration(seconds);
        document.querySelectorAll('[data-podcast-duration="episode"]').forEach(function (el) {
            el.textContent = label;
            var wrap = el.closest('.js-podcast-duration-wrap');
            if (wrap) {
                wrap.hidden = false;
            }
        });
    }

    function init() {
        var seconds = durationFromPage();
        applyDuration(seconds);

        var audio = document.querySelector('.kg-audio-card audio');
        if (audio && !seconds) {
            audio.addEventListener('loadedmetadata', function () {
                applyDuration(parseSeconds(audio.duration));
            });
        }
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
