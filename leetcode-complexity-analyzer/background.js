chrome.runtime.onInstalled.addListener(() => {
    chrome.storage.local.set({
        enabled: true,
        llmEnabled: true,
        apiKey: '',
        history: []
    });
});

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === 'evaluateComplexity') {
        evaluateWithLLM(request.payload)
            .then(result => sendResponse({ result }))
            .catch(error => sendResponse({ error: error.message }));
        return true; // Keep the message channel open for async response
    }
});

async function evaluateWithLLM(payload) {
    const { code, language, userTC, userSC } = payload;
    const settings = await chrome.storage.local.get(['apiKey', 'llmEnabled']);

    if (!settings.llmEnabled) {
        throw new Error("LLM evaluation is disabled in settings.");
    }

    if (!settings.apiKey) {
        throw new Error("Gemini API Key not found. Please set it in the extension popup.");
    }

    const systemPrompt = "You are a Data Structures and Algorithms expert. Your job is to evaluate the time and space complexity of given code and check if the user's answer is correct. Be precise and concise.";
    
    const userPrompt = `
Code:
${code}

Language:
${language}

User Answer:
Time Complexity: ${userTC}
Space Complexity: ${userSC}

Instructions:
1. Determine the correct Time Complexity and Space Complexity.
2. Compare with user's answer.
3. Respond in JSON format ONLY.

Required JSON format:
{
  "correct_tc": "...",
  "correct_sc": "...",
  "is_tc_correct": true/false,
  "is_sc_correct": true/false,
  "explanation": "Short 2-4 line explanation",
  "confidence": "high/medium/low"
}
`;

    try {
        const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${settings.apiKey}`;
        
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                system_instruction: {
                    parts: [{ text: systemPrompt }]
                },
                contents: [{
                    parts: [{ text: userPrompt }]
                }],
                generationConfig: {
                    temperature: 0.2,
                    response_mime_type: "application/json"
                }
            })
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error?.message || "Failed to fetch from Gemini API");
        }

        const data = await response.json();
        const text = data.candidates[0].content.parts[0].text;
        return JSON.parse(text);
    } catch (err) {
        console.error("LLM Evaluation Error:", err);
        throw err;
    }
}
