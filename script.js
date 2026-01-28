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
    
    // Фокус на поле ввода
    messageInput.focus();
    
    // Отправка по Enter
    messageInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    });
    
    // Отправка по клику
    sendButton.addEventListener('click', sendMessage);
    
    // Автоматическое обновление сообщений
    setInterval(loadMessages, 3000);
    
    // Прокрутка вниз при загрузке
    setTimeout(scrollToBottom, 500);
}

async function sendMessage() {
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
    
    // Сохраняем сообщения (ограничиваем до 200 последних)
    if (messages.length > 200) {
        messages.splice(0, messages.length - 200);
    }
    
    // Сохраняем в localStorage
    localStorage.setItem('chat_messages', JSON.stringify(messages));
    
    // Уведомляем о новом сообщении
    if (window.sync && window.sync.notifyMessageUpdate) {
        window.sync.notifyMessageUpdate();
    }
    
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
    
    // Отправитель (только для чужих сообщений)
    if (!isSent) {
        const senderSpan = document.createElement('div');
        senderSpan.className = 'message-sender';
        senderSpan.textContent = message.sender;
        messageDiv.appendChild(senderSpan);
    }
    
    // Текст сообщения
    const contentDiv = document.createElement('div');
    contentDiv.className = 'message-content';
    
    // Обработка переносов строк
    const textWithBreaks = message.text.replace(/\n/g, '<br>');
    contentDiv.innerHTML = textWithBreaks;
    
    messageDiv.appendChild(contentDiv);
    
    // Время отправления
    const timeSpan = document.createElement('div');
    timeSpan.className = 'message-time';
    
    try {
        const time = new Date(message.timestamp);
        const now = new Date();
        const diffDays = Math.floor((now - time) / (1000 * 60 * 60 * 24));
        
        let timeString;
        if (diffDays === 0) {
            // Сегодня
            timeString = time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        } else if (diffDays === 1) {
            // Вчера
            timeString = 'Вчера ' + time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        } else if (diffDays < 7) {
            // На этой неделе
            const days = ['Вс', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб'];
            timeString = days[time.getDay()] + ' ' + time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        } else {
            // Более недели назад
            timeString = time.toLocaleDateString() + ' ' + time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        }
        
        timeSpan.textContent = timeString;
    } catch (e) {
        timeSpan.textContent = 'только что';
    }
    
    messageDiv.appendChild(timeSpan);
    
    return messageDiv;
}

function scrollToBottom() {
    const messagesContainer = document.getElementById('chat-messages');
    if (messagesContainer) {
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }
}

function isAtBottom() {
    const messagesContainer = document.getElementById('chat-messages');
    if (!messagesContainer) return true;
    
    const threshold = 100; // Пикселей от нижнего края
    return messagesContainer.scrollHeight - messagesContainer.scrollTop - messagesContainer.clientHeight < threshold;
}

// Делаем функции глобально доступными
window.sendMessage = sendMessage;
window.loadMessages = loadMessages;