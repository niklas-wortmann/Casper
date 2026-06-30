(function () {
    var article = document.querySelector('.tag-podcast');
    if (!article) {
        return;
    }

    var script = document.getElementById('podcast-listen-links');
    if (!script) {
        return;
    }

    var links;
    try {
        links = JSON.parse(script.textContent || '{}');
    } catch (error) {
        return;
    }

    var platforms = ['spotify', 'apple', 'youtube'];
    platforms.forEach(function (platform) {
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
