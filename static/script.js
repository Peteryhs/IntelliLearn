// Event listener for when the DOM is loaded
document.addEventListener('DOMContentLoaded', function () {
    const typingIndicator = document.getElementById('typing-indicator');
    const messagesContainer = document.querySelector('.messages');
    const body = document.body;
    const modeToggle = document.getElementById('mode-toggle');
    const sendButton = document.querySelector('.send-button');
    const inputField = document.querySelector('.input-field');

    // Function to create a user message element
    function createUserMessage(message) {
        const messageElement = createMessageElement(message, 'user-message');
        return messageElement;
    }

    // Function to create a chatbot message element
    function createChatbotMessage(message) {
        const messageElement = createMessageElement(message, 'message');
        return messageElement;
    }

    // Function to create a message element
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

    // Function to show the typing indicator
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

    // Function to hide the typing indicator
    function hideTypingIndicator() {
        typingIndicator.textContent = '';
        clearInterval(typingIndicator.dataset.typingInterval);
    }

    // Function to scroll to the bottom of the messages container
    function scrollToBottom() {
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }

    // Event listener for keypress event
    document.addEventListener('keypress', function (event) {
        const keyCode = event.keyCode ? event.keyCode : event.which;
        if (keyCode === 13) {
            sendButton.click();
        }
    });

    // Event listener for send button click event
    sendButton.addEventListener('click', function () {
        const userMessage = inputField.value.trim();
        if (userMessage) {
            const userMessageElement = createMessageElement(userMessage, 'message', true);
            messagesContainer.appendChild(userMessageElement);
            inputField.value = '';

            showTypingIndicator();

            // Send user message to the server
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

    // Event listener for mode toggle change event
    modeToggle.addEventListener('change', function () {
        const isDarkMode = modeToggle.checked;
        body.classList.toggle('dark-mode', isDarkMode);

        const lightModeEmoji = document.getElementById('light-mode-emoji');
        const darkModeEmoji = document.getElementById('dark-mode-emoji');

        if (isDarkMode) {
            lightModeEmoji.style.opacity = 0;
            darkModeEmoji.style.opacity = 1;
        } else {
            lightModeEmoji.style.opacity = 1;
            darkModeEmoji.style.opacity = 0;
        }

        // Add a class to the body for a smooth transition effect
        if (isDarkMode) {
            body.classList.add('dark-mode-transition');
        } else {
            body.classList.remove('dark-mode-transition');
        }
    });
});
