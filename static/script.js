document.addEventListener('DOMContentLoaded', function () {
    let typingIndicator = document.getElementById('typing-indicator');
    let messagesContainer = document.querySelector('.messages');

    // Function to create a user message element
    function createUserMessage(message) {
        let messageElement = document.createElement('div');
        messageElement.classList.add('message', 'user-message');
        messageElement.textContent = message;
        return messageElement;
    }

    // Function to create a chatbot message element
    function createChatbotMessage(message) {
        let messageElement = document.createElement('div');
        messageElement.classList.add('message');
        messageElement.innerHTML = message;
        return messageElement;
    }

    // Function to show typing indicator
    function showTypingIndicator() {
        typingIndicator.textContent = 'IntelliLearn is typing...';
    }

    // Function to hide typing indicator
    function hideTypingIndicator() {
        typingIndicator.textContent = '';
    }

    // Function to scroll to the bottom of the messages
    function scrollToBottom() {
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }

    // Click send button with Enter key
    let send = document.getElementById('send');
    document.addEventListener('keypress', function (event) {
        let keyCode = event.keyCode ? event.keyCode : event.which;
        if (keyCode === 13) {
            send.click();
        }
    });

    // Add functionality to send messages and display responses
    document.querySelector('.send-button').addEventListener('click', function () {
        let inputField = document.querySelector('.input-field');
        let userMessage = inputField.value.trim();
        if (userMessage) {
            // Display user message
            let userMessageElement = createUserMessage(userMessage);
            messagesContainer.appendChild(userMessageElement);
            inputField.value = '';

            // Show typing indicator
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
                    // Hide typing indicator
                    hideTypingIndicator();

                    // Display chatbot response
                    let chatbotResponse = marked.parse(data.response);
                    let chatbotMessageElement = createChatbotMessage(chatbotResponse);
                    messagesContainer.appendChild(chatbotMessageElement);

                    // Scroll to the bottom after adding a new message
                    scrollToBottom();
                });
        }
    });
});
