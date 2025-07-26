document.addEventListener('DOMContentLoaded', () => {
    const chatbotToggle = document.getElementById('chatbot-toggle');
    const chatbotWindow = document.getElementById('chatbot-window');
    const closeButton = document.getElementById('chatbot-close');
    const sendButton = document.getElementById('chatbot-send');
    const chatbotInput = document.getElementById('chatbot-input');
    const chatbotBody = document.getElementById('chatbot-body');
    const body = document.body;

    // Replace with your actual OpenRouter API key
    const OPENROUTER_API_KEY = "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";
    const CHATBOT_MODEL = "deepseek/deepseek-r1"; // Using the specified free model

    let conversationHistory = [];

    const isMobile = () => window.innerWidth < 768;

    // Toggle chatbot window visibility
    chatbotToggle.addEventListener('click', () => {
        chatbotWindow.classList.toggle('open');
        if (isMobile()) {
            body.classList.toggle('chatbot-open-mobile');
        }
    });

    closeButton.addEventListener('click', () => {
        chatbotWindow.classList.remove('open');
        if (isMobile()) {
            body.classList.remove('chatbot-open-mobile');
        }
    });

    // Send message on button click
    sendButton.addEventListener('click', sendMessage);

    // Send message on Enter key press
    chatbotInput.addEventListener('keydown', (event) => {
        if (event.key === 'Enter' && !event.shiftKey) {
            event.preventDefault();
            sendMessage();
        }
    });

    function sendMessage() {
        const messageText = chatbotInput.value.trim();
        if (messageText === '') return;

        displayUserMessage(messageText);
        conversationHistory.push({ role: "user", content: messageText });
        chatbotInput.value = '';
        getBotResponse();
    }

    function displayUserMessage(message) {
        const userMessageElem = document.createElement('div');
        userMessageElem.classList.add('message', 'user');
        userMessageElem.textContent = message;
        chatbotBody.appendChild(userMessageElem);
        scrollToBottom();
    }

    function displayBotMessage(message) {
        const botMessageElem = document.createElement('div');
        botMessageElem.classList.add('message', 'bot');
        botMessageElem.textContent = message;
        chatbotBody.appendChild(botMessageElem);
        scrollToBottom();
    }

    function showTypingIndicator() {
        const typingIndicator = document.createElement('div');
        typingIndicator.classList.add('message', 'bot', 'typing-indicator');
        typingIndicator.innerHTML = '<div class="typing-dot"></div><div class="typing-dot"></div><div class="typing-dot"></div>';
        chatbotBody.appendChild(typingIndicator);
        scrollToBottom();
    }

    function hideTypingIndicator() {
        const typingIndicator = chatbotBody.querySelector('.typing-indicator');
        if (typingIndicator) {
            chatbotBody.removeChild(typingIndicator);
        }
    }

    async function getBotResponse() {
        showTypingIndicator();

        try {
            const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${OPENROUTER_API_KEY}`,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    model: CHATBOT_MODEL,
                    messages: conversationHistory
                })
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            const botMessage = data.choices[0].message.content;

            hideTypingIndicator();
            displayBotMessage(botMessage);
            conversationHistory.push({ role: "assistant", content: botMessage });

        } catch (error) {
            console.error("Error fetching from OpenRouter:", error);
            hideTypingIndicator();
            displayBotMessage("Sorry, I'm having trouble connecting. Please try again later.");
        }
    }

    function scrollToBottom() {
        chatbotBody.scrollTop = chatbotBody.scrollHeight;
    }

    // Initial greeting
    conversationHistory.push({ role: "assistant", content: "Hello! How can I help you today?" });
    displayBotMessage("Hello! How can I help you today?");
});
