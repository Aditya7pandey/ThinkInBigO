// Inject the interception script
const s = document.createElement('script');
s.src = chrome.runtime.getURL('injected.js');
s.onload = function() {
    this.remove();
};
(document.head || document.documentElement).appendChild(s);

let currentSubmissionData = null;

// Listen for messages from injected.js
window.addEventListener('message', function(event) {
    if (event.data.type === 'LEETCODE_SUBMISSION_ACCEPTED') {
        currentSubmissionData = event.data;
        handleAcceptedSubmission();
    }
});

async function handleAcceptedSubmission() {
    const settings = await chrome.storage.local.get(['enabled', 'llmEnabled', 'apiKey']);
    if (settings.enabled === false) return;

    const code = getCode();
    const language = getLanguage();
    const problemTitle = getProblemTitle();

    showComplexityModal(code, language, problemTitle);
}

function getCode() {
    // Try to get code from the editor
    const monacoEditor = document.querySelector('.monaco-editor');
    if (monacoEditor) {
        const lines = monacoEditor.querySelectorAll('.view-line');
        if (lines.length > 0) {
            return Array.from(lines).map(line => line.textContent).join('\n');
        }
    }
    
    // Fallback: try to find any code container
    const codeContainer = document.querySelector('code') || document.querySelector('pre');
    if (codeContainer) return codeContainer.innerText;

    return currentSubmissionData?.data?.code || "Code not found. Please ensure you are on the submission page.";
}

function getLanguage() {
    const langBtn = document.querySelector('button[id^="headlessui-listbox-button"]');
    return langBtn ? langBtn.textContent.trim() : (currentSubmissionData?.data?.lang || "Unknown");
}

function getProblemTitle() {
    const titleElem = document.querySelector('span.text-lg.font-medium');
    return titleElem ? titleElem.textContent.trim() : "LeetCode Problem";
}

function showComplexityModal(code, language, problemTitle) {
    // Remove existing modal if any
    const existingModal = document.getElementById('lc-complexity-modal-root');
    if (existingModal) existingModal.remove();

    const root = document.createElement('div');
    root.id = 'lc-complexity-modal-root';
    
    root.innerHTML = `
        <div class="lc-modal-overlay">
            <div class="lc-modal-container">
                <div class="lc-modal-header">
                    <div class="lc-header-left">
                        <img src="${chrome.runtime.getURL('logo.png')}" class="lc-modal-logo">
                        <h2>ThinkInBigO</h2>
                    </div>
                    <span class="lc-modal-close">&times;</span>
                </div>
                <div class="lc-modal-body">
                    <p class="lc-problem-info">Problem: <strong>${problemTitle}</strong> (${language})</p>
                    <div class="lc-input-group">
                        <label>Time Complexity:</label>
                        <input type="text" id="user-tc" placeholder="e.g. O(n log n)" autocomplete="off">
                    </div>
                    <div class="lc-input-group">
                        <label>Space Complexity:</label>
                        <input type="text" id="user-sc" placeholder="e.g. O(1)" autocomplete="off">
                    </div>
                    <div id="lc-result-container" class="lc-result-container hidden">
                        <div id="lc-loader" class="lc-loader">Analyzing with LLM...</div>
                        <div id="lc-result-content"></div>
                    </div>
                </div>
                <div class="lc-modal-footer">
                    <button id="lc-skip-btn" class="lc-btn lc-btn-secondary">Skip</button>
                    <button id="lc-submit-complexity" class="lc-btn lc-btn-primary">Submit Analysis</button>
                </div>
                <div class="lc-privacy-note">Note: Your code will be sent to an LLM for evaluation.</div>
            </div>
        </div>
    `;

    document.body.appendChild(root);

    // Event Listeners
    const closeBtn = root.querySelector('.lc-modal-close');
    const skipBtn = root.querySelector('#lc-skip-btn');
    const submitBtn = root.querySelector('#lc-submit-complexity');

    const closeModal = () => root.remove();

    closeBtn.onclick = closeModal;
    skipBtn.onclick = closeModal;

    submitBtn.onclick = async () => {
        const userTC = document.getElementById('user-tc').value.trim();
        const userSC = document.getElementById('user-sc').value.trim();

        if (!userTC || !userSC) {
            alert("Please enter both Time and Space complexity.");
            return;
        }

        submitBtn.disabled = true;
        document.getElementById('lc-result-container').classList.remove('hidden');
        document.getElementById('lc-loader').style.display = 'block';
        document.getElementById('lc-result-content').innerHTML = '';

        try {
            const response = await chrome.runtime.sendMessage({
                action: 'evaluateComplexity',
                payload: {
                    code,
                    language,
                    userTC,
                    userSC,
                    problemTitle
                }
            });

            document.getElementById('lc-loader').style.display = 'none';

            if (response.error) {
                document.getElementById('lc-result-content').innerHTML = `
                    <div class="lc-error">Error: ${response.error}</div>
                `;
            } else {
                displayResult(response.result);
                // Save to history
                chrome.storage.local.get({ history: [] }, (data) => {
                    const newEntry = {
                        title: problemTitle,
                        userTC,
                        userSC,
                        correctTC: response.result.correct_tc,
                        correctSC: response.result.correct_sc,
                        isCorrect: response.result.is_tc_correct && response.result.is_sc_correct,
                        timestamp: Date.now()
                    };
                    data.history.push(newEntry);
                    chrome.storage.local.set({ history: data.history.slice(-50) }); // Keep last 50
                });
            }
        } catch (err) {
            document.getElementById('lc-loader').style.display = 'none';
            document.getElementById('lc-result-content').innerHTML = `
                <div class="lc-error">Failed to connect to analyzer. Please check your API key.</div>
            `;
        }
    };
}

function displayResult(result) {
    const content = document.getElementById('lc-result-content');
    
    const tcClass = result.is_tc_correct ? 'lc-correct' : 'lc-incorrect';
    const scClass = result.is_sc_correct ? 'lc-correct' : 'lc-incorrect';

    content.innerHTML = `
        <div class="lc-result-grid">
            <div class="lc-result-item ${tcClass}">
                <label>Time Complexity:</label>
                <span>${result.is_tc_correct ? '✓ Correct' : '✗ ' + result.correct_tc}</span>
            </div>
            <div class="lc-result-item ${scClass}">
                <label>Space Complexity:</label>
                <span>${result.is_sc_correct ? '✓ Correct' : '✗ ' + result.correct_sc}</span>
            </div>
        </div>
        <div class="lc-explanation">
            <strong>Explanation:</strong>
            <p>${result.explanation}</p>
        </div>
        <div class="lc-confidence">Confidence: ${result.confidence || 'N/A'}</div>
    `;
}
