document.addEventListener('DOMContentLoaded', function() {
    if (window.location.pathname.includes('chat.html')) {
        initializeChat();
    }
});

function initializeChat() {
    const currentUser = localStorage.getItem('current_user');
    if (!currentUser) return;
    
    // Загружаем сообщения
    loadMessages();
    
    // Настройка обработчиков
    const messageInput = document.getElementById('message-input');
    const sendButton = document.getElementById('send-button');
    
    // Отправка по Enter
    messageInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            sendMessage();
        }
    });
    
    // Отправка по клику
    sendButton.addEventListener('click', sendMessage);
    
    // Автоматическое обновление сообщений каждые 2 секунды
    setInterval(loadMessages, 2000);
}

function sendMessage() {
    const messageInput = document.getElementById('message-input');
    const messageText = messageInput.value.trim();
    
    if (!messageText) return;
    
    const currentUser = localStorage.getItem('current_user');
    
    // Получаем существующие сообщения
    const messages = JSON.parse(localStorage.getItem('chat_messages') || '[]');
    
    // Добавляем новое сообщение
    const newMessage = {
        id: Date.now(),
        sender: currentUser,
        text: messageText,
        timestamp: new Date().toISOString(),
        read: false
    };
    
    messages.push(newMessage);
    
    // Сохраняем сообщения (ограничиваем до 100 последних)
    if (messages.length > 100) {
        messages.splice(0, messages.length - 100);
    }
    
    localStorage.setItem('chat_messages', JSON.stringify(messages));
    
    // Очищаем поле ввода
    messageInput.value = '';
    
    // Обновляем отображение сообщений
    loadMessages();
    
    // Прокручиваем вниз
    scrollToBottom();
}

function loadMessages() {
    const messagesContainer = document.getElementById('chat-messages');
    const messages = JSON.parse(localStorage.getItem('chat_messages') || '[]');
    const currentUser = localStorage.getItem('current_user');
    
    // Сохраняем позицию прокрутки
    const wasAtBottom = isAtBottom();
    
    // Очищаем контейнер (кроме приветственного сообщения)
    const welcomeMessage = messagesContainer.querySelector('.welcome-message');
    messagesContainer.innerHTML = '';
    if (welcomeMessage) {
        messagesContainer.appendChild(welcomeMessage);
    }
    
    // Отображаем все сообщения
    messages.forEach(message => {
        const messageElement = createMessageElement(message, currentUser);
        messagesContainer.appendChild(messageElement);
    });
    
    // Восстанавливаем позицию прокрутки
    if (wasAtBottom) {
        scrollToBottom();
    }
}

function createMessageElement(message, currentUser) {
    const isSent = message.sender === currentUser;
    
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${isSent ? 'sent' : 'received'}`;
    
    const senderSpan = document.createElement('div');
    senderSpan.className = 'message-sender';
    senderSpan.textContent = message.sender;
    
    const contentDiv = document.createElement('div');
    contentDiv.className = 'message-content';
    contentDiv.textContent = message.text;
    
    const timeSpan = document.createElement('div');
    timeSpan.className = 'message-time';
    const time = new Date(message.timestamp);
    timeSpan.textContent = time.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
    
    if (!isSent) {
        messageDiv.appendChild(senderSpan);
    }
    messageDiv.appendChild(contentDiv);
    messageDiv.appendChild(timeSpan);
    
    return messageDiv;
}

function scrollToBottom() {
    const messagesContainer = document.getElementById('chat-messages');
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
}

function isAtBottom() {
    const messagesContainer = document.getElementById('chat-messages');
    const threshold = 50; // Пикселей от нижнего края
    return messagesContainer.scrollHeight - messagesContainer.scrollTop - messagesContainer.clientHeight < threshold;
}