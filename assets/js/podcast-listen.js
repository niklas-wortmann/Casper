(function () {
    var article = document.querySelector('.tag-podcast');
    if (!article) {
        return;
    }

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
        var dataNode = document.querySelector('.gh-content [data-listen-youtube]');
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

        var button = article.querySelector('[data-listen-platform="' + platform + '"]');
        if (button) {
            button.href = url;
        }
    });
})();
