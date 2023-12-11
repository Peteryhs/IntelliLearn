document.addEventListener('DOMContentLoaded', function () {
    const typingIndicator = document.getElementById('typing-indicator');
    const messagesContainer = document.querySelector('.messages');
    const body = document.body;
    const modeToggle = document.getElementById('mode-toggle');
    const sendButton = document.querySelector('.send-button');
    const inputField = document.querySelector('.input-field');

    function createUserMessage(message) {
        const messageElement = createMessageElement(message, 'user-message');
        return messageElement;
    }

    function createChatbotMessage(message) {
        const messageElement = createMessageElement(message, 'message');
        return messageElement;
    }

    function createMessageElement(message, className, isUserMessage) {
        const messageElement = document.createElement('div');
        messageElement.classList.add(className, isUserMessage ? 'user-message' : 'chatbot-message');

        const bubbleElement = document.createElement('div');
        bubbleElement.classList.add('message-bubble');

        const innerMessageElement = document.createElement('div');
        innerMessageElement.classList.add('message-content');
        innerMessageElement.textContent = message;

        bubbleElement.appendChild(innerMessageElement);
        messageElement.appendChild(bubbleElement);

        return messageElement;
    }

    function showTypingIndicator() {
        const typingTexts = [
            'IntelliLearn is typing.',
            'IntelliLearn is typing..',
            'IntelliLearn is typing...',
        ];

        let currentIndex = 0;
        typingIndicator.textContent = typingTexts[currentIndex];

        const typingInterval = setInterval(() => {
            currentIndex = (currentIndex + 1) % typingTexts.length;
            typingIndicator.textContent = typingTexts[currentIndex];
        }, 500); // Adjust the interval as needed

        typingIndicator.dataset.typingInterval = typingInterval;
    }

    function hideTypingIndicator() {
        typingIndicator.textContent = '';
        clearInterval(typingIndicator.dataset.typingInterval);
    }

    function scrollToBottom() {
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }

    document.addEventListener('keypress', function (event) {
        const keyCode = event.keyCode ? event.keyCode : event.which;
        if (keyCode === 13) {
            sendButton.click();
        }
    });

    sendButton.addEventListener('click', function () {
        const userMessage = inputField.value.trim();
        if (userMessage) {
            const userMessageElement = createMessageElement(userMessage, 'message', true);
            messagesContainer.appendChild(userMessageElement);
            inputField.value = '';

            showTypingIndicator();

            fetch('/chat', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ 'message': userMessage }),
            })
                .then(response => response.json())
                .then(data => {
                    hideTypingIndicator();

                    const chatbotResponse = marked.parse(data.response);
                    const chatbotMessageElement = createMessageElement(chatbotResponse, 'message', false);
                    messagesContainer.appendChild(chatbotMessageElement);

                    scrollToBottom();
                });
        }
    });

    modeToggle.addEventListener('change', function () {
        body.classList.toggle('dark-mode', modeToggle.checked);
    });
});
