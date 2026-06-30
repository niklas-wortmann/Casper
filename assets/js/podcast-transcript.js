(function () {
    var article = document.querySelector('.tag-podcast');
    if (!article) {
        return;
    }

    var content = article.querySelector('.gh-content');
    if (!content) {
        return;
    }

    var heading = content.querySelector('h2#full-transcript, h2#transcript');
    if (!heading) {
        return;
    }

    var triggerParagraph = heading.nextElementSibling;
    if (!triggerParagraph || triggerParagraph.tagName !== 'P') {
        return;
    }

    var triggerLink = triggerParagraph.querySelector('a[href="#podcast-transcript"]');
    if (!triggerLink) {
        return;
    }

    var transcriptParagraphs = [];
    var node = triggerParagraph.nextElementSibling;

    while (node && node.tagName === 'P') {
        transcriptParagraphs.push(node);
        node = node.nextElementSibling;
    }

    if (!transcriptParagraphs.length) {
        return;
    }

    var dialog = document.createElement('dialog');
    dialog.className = 'podcast-transcript-dialog';
    dialog.id = 'podcast-transcript';
    dialog.setAttribute('aria-labelledby', 'podcast-transcript-title');

    var dialogInner = document.createElement('div');
    dialogInner.className = 'podcast-transcript-dialog__inner';

    var dialogHeader = document.createElement('div');
    dialogHeader.className = 'podcast-transcript-dialog__header';

    var dialogTitle = document.createElement('h3');
    dialogTitle.className = 'podcast-transcript-dialog__title';
    dialogTitle.id = 'podcast-transcript-title';
    dialogTitle.textContent = 'Full Transcript';

    var closeButton = document.createElement('button');
    closeButton.className = 'podcast-transcript-dialog__close';
    closeButton.type = 'button';
    closeButton.setAttribute('aria-label', 'Close transcript');
    closeButton.textContent = 'Close';

    var dialogBody = document.createElement('div');
    dialogBody.className = 'podcast-transcript-dialog__body';

    dialogHeader.appendChild(dialogTitle);
    dialogHeader.appendChild(closeButton);
    dialogInner.appendChild(dialogHeader);
    dialogInner.appendChild(dialogBody);
    dialog.appendChild(dialogInner);

    transcriptParagraphs.forEach(function (paragraph) {
        dialogBody.appendChild(paragraph);
    });

    article.appendChild(dialog);
    article.classList.add('is-transcript-modal-ready');
    triggerParagraph.classList.add('podcast-transcript-trigger');

    function openDialog(event) {
        if (event) {
            event.preventDefault();
        }
        if (typeof dialog.showModal === 'function') {
            dialog.showModal();
        }
    }

    function closeDialog() {
        if (dialog.open) {
            dialog.close();
        }
    }

    triggerLink.addEventListener('click', openDialog);
    closeButton.addEventListener('click', closeDialog);

    dialog.addEventListener('click', function (event) {
        var rect = dialogInner.getBoundingClientRect();
        var clickedBackdrop =
            event.clientX < rect.left ||
            event.clientX > rect.right ||
            event.clientY < rect.top ||
            event.clientY > rect.bottom;

        if (clickedBackdrop) {
            closeDialog();
        }
    });

    dialog.addEventListener('cancel', function (event) {
        event.preventDefault();
        closeDialog();
    });
})();
