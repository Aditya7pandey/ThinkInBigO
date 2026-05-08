(function() {
    const originalFetch = window.fetch;
    window.fetch = async (...args) => {
        const response = await originalFetch(...args);
        const url = args[0];

        if (typeof url === 'string' && (url.includes('/submissions/detail/') || url.includes('/check/'))) {
            const clone = response.clone();
            clone.json().then(data => {
                if (data.status_msg === "Accepted") {
                    window.postMessage({
                        type: 'LEETCODE_SUBMISSION_ACCEPTED',
                        submissionId: data.submission_id || data.id,
                        data: data
                    }, '*');
                }
            }).catch(() => {});
        }
        return response;
    };

    const originalXHR = window.XMLHttpRequest.prototype.open;
    window.XMLHttpRequest.prototype.open = function(method, url) {
        this.addEventListener('load', function() {
            if (typeof url === 'string' && (url.includes('/submissions/detail/') || url.includes('/check/'))) {
                try {
                    const data = JSON.parse(this.responseText);
                    if (data.status_msg === "Accepted") {
                        window.postMessage({
                            type: 'LEETCODE_SUBMISSION_ACCEPTED',
                            submissionId: data.submission_id || data.id,
                            data: data
                        }, '*');
                    }
                } catch (e) {}
            }
        });
        return originalXHR.apply(this, arguments);
    };
})();
