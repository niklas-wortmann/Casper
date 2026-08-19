(function () {
    function applyListenLinks() {
        var links = null;
        var script = document.getElementById('podcast-listen-links');

        if (script) {
            try {
                links = JSON.parse(script.textContent || '{}');
            } catch (error) {
                links = null;
            }
        }

        if (!links) {
            var dataNode = document.querySelector('[data-listen-youtube], [data-listen-spotify], [data-listen-apple]');
            if (dataNode) {
                links = {
                    youtube: dataNode.getAttribute('data-listen-youtube') || '',
                    spotify: dataNode.getAttribute('data-listen-spotify') || '',
                    apple: dataNode.getAttribute('data-listen-apple') || '',
                };
            }
        }

        if (!links) {
            return;
        }

        ['spotify', 'apple', 'youtube'].forEach(function (platform) {
            var url = links[platform];
            if (!url) {
                return;
            }

            document.querySelectorAll('[data-listen-platform="' + platform + '"]').forEach(function (button) {
                button.href = url;
            });
        });
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', applyListenLinks);
    } else {
        applyListenLinks();
    }
})();
