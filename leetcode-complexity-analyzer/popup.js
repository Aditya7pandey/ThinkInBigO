document.addEventListener('DOMContentLoaded', () => {
    const enabledCheckbox = document.getElementById('extension-enabled');
    const llmEnabledCheckbox = document.getElementById('llm-enabled');
    const apiKeyInput = document.getElementById('api-key');
    const saveBtn = document.getElementById('save-settings');
    const status = document.getElementById('status');

    // Load current settings
    chrome.storage.local.get(['enabled', 'llmEnabled', 'apiKey'], (data) => {
        enabledCheckbox.checked = data.enabled !== false;
        llmEnabledCheckbox.checked = data.llmEnabled !== false;
        apiKeyInput.value = data.apiKey || '';
    });

    // Save settings
    saveBtn.addEventListener('click', () => {
        const enabled = enabledCheckbox.checked;
        const llmEnabled = llmEnabledCheckbox.checked;
        const apiKey = apiKeyInput.value.trim();

        chrome.storage.local.set({
            enabled,
            llmEnabled,
            apiKey
        }, () => {
            status.textContent = 'Settings saved!';
            status.className = 'status-msg success';
            setTimeout(() => {
                status.textContent = '';
                status.className = 'status-msg';
            }, 2000);
        });
    });
});
