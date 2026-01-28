* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

body {
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    min-height: 100vh;
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 20px;
}

.container {
    width: 100%;
    max-width: 500px;
}

/* Карточки */
.welcome-card, .auth-card, .chat-container {
    background: white;
    border-radius: 20px;
    box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
    overflow: hidden;
    padding: 40px;
}

/* Чат-контейнер без padding сверху */
.chat-container {
    padding: 0;
    display: flex;
    flex-direction: column;
    height: 80vh;
}

/* Логотип */
.logo {
    text-align: center;
    margin-bottom: 30px;
}

.logo i {
    font-size: 48px;
    color: #667eea;
    margin-bottom: 15px;
}

.logo h1 {
    color: #333;
    font-size: 24px;
}

/* Приветственный текст */
.welcome-text {
    text-align: center;
    margin-bottom: 30px;
}

.welcome-text h2 {
    color: #667eea;
    margin-bottom: 15px;
}

.welcome-text p {
    color: #666;
    line-height: 1.6;
}

/* Кнопки */
.buttons {
    display: flex;
    flex-direction: column;
    gap: 15px;
    margin-bottom: 30px;
}

.btn {
    padding: 15px 25px;
    border: none;
    border-radius: 10px;
    font-size: 16px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s ease;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 10px;
}

.btn-primary {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
}

.btn-primary:hover {
    transform: translateY(-2px);
    box-shadow: 0 5px 20px rgba(102, 126, 234, 0.4);
}

.btn-secondary {
    background: #f0f0f0;
    color: #333;
}

.btn-secondary:hover {
    background: #e0e0e0;
    transform: translateY(-2px);
}

.btn-back {
    background: transparent;
    color: #666;
    width: 100%;
}

.btn-icon {
    background: none;
    border: none;
    font-size: 20px;
    color: white;
    cursor: pointer;
    padding: 8px;
    border-radius: 50%;
    transition: all 0.3s ease;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 40px;
    height: 40px;
}

.btn-icon:hover {
    background: rgba(255, 255, 255, 0.1);
}

/* Шапка чата */
.chat-header {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    padding: 15px 20px;
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.header-left, .header-right {
    display: flex;
    align-items: center;
    gap: 10px;
}

.user-info {
    display: flex;
    align-items: center;
    gap: 10px;
    font-size: 16px;
    font-weight: 600;
}

.user-info i {
    font-size: 24px;
}

/* Область сообщений */
.chat-messages {
    flex: 1;
    padding: 20px;
    overflow-y: auto;
    background: #f8f9fa;
}

.welcome-message {
    background: #e3f2fd;
    padding: 15px;
    border-radius: 10px;
    margin-bottom: 20px;
    color: #1976d2;
    font-size: 14px;
    line-height: 1.5;
}

.welcome-message p {
    margin-bottom: 8px;
}

.welcome-message p:last-child {
    margin-bottom: 0;
}

.welcome-message strong {
    color: #0d47a1;
}

/* Сообщения */
.message {
    margin-bottom: 15px;
    max-width: 75%;
    animation: fadeIn 0.3s ease;
}

@keyframes fadeIn {
    from { opacity: 0; transform: translateY(10px); }
    to { opacity: 1; transform: translateY(0); }
}

.message-content {
    padding: 12px 18px;
    border-radius: 18px;
    display: inline-block;
    word-wrap: break-word;
    max-width: 100%;
    line-height: 1.4;
}

.message.sent {
    margin-left: auto;
}

.message.sent .message-content {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    border-bottom-right-radius: 4px;
}

.message.received {
    margin-right: auto;
}

.message.received .message-content {
    background: #e0e0e0;
    color: #333;
    border-bottom-left-radius: 4px;
}

.message-sender {
    font-size: 12px;
    color: #666;
    margin-bottom: 4px;
    padding-left: 10px;
    font-weight: 500;
}

.message-time {
    font-size: 11px;
    color: #999;
    margin-top: 4px;
    text-align: right;
    padding-right: 5px;
}

/* Поле ввода */
.message-input {
    padding: 15px 20px;
    border-top: 1px solid #e0e0e0;
    display: flex;
    gap: 10px;
    background: white;
}

.message-input input {
    flex: 1;
    padding: 12px 20px;
    border: 2px solid #e0e0e0;
    border-radius: 25px;
    font-size: 16px;
    outline: none;
    transition: border-color 0.3s;
}

.message-input input:focus {
    border-color: #667eea;
}

#send-button {
    padding: 12px 25px;
    border-radius: 25px;
    min-width: 50px;
}

/* Инфо о чате */
.chat-info {
    background: #f8f9fa;
    padding: 10px 20px;
    text-align: center;
    color: #666;
    font-size: 12px;
    border-top: 1px solid #e0e0e0;
}

.chat-info i {
    margin-right: 6px;
    color: #667eea;
}

/* Форма авторизации */
.form-group {
    margin-bottom: 20px;
}

.form-group label {
    display: block;
    margin-bottom: 8px;
    color: #333;
    font-weight: 500;
    display: flex;
    align-items: center;
    gap: 8px;
}

.form-group input {
    width: 100%;
    padding: 15px;
    border: 2px solid #e0e0e0;
    border-radius: 10px;
    font-size: 16px;
    transition: border-color 0.3s ease;
}

.form-group input:focus {
    outline: none;
    border-color: #667eea;
}

.error-message {
    background: #ffe6e6;
    color: #ff3333;
    padding: 12px;
    border-radius: 8px;
    margin-bottom: 20px;
    display: none;
    font-size: 14px;
}

.auth-switch {
    text-align: center;
    margin: 20px 0;
    color: #666;
}

.auth-switch a {
    color: #667eea;
    text-decoration: none;
    font-weight: 600;
}

.auth-switch a:hover {
    text-decoration: underline;
}

/* Фичи на главной */
.features {
    display: flex;
    justify-content: space-around;
    flex-wrap: wrap;
    gap: 15px;
    margin-top: 20px;
}

.feature {
    display: flex;
    align-items: center;
    gap: 8px;
    color: #666;
    font-size: 14px;
}

.feature i {
    color: #667eea;
}

/* Адаптивность */
@media (max-width: 600px) {
    .container {
        padding: 10px;
        height: 100vh;
    }
    
    .welcome-card, .auth-card {
        padding: 25px 15px;
    }
    
    .chat-container {
        height: 95vh;
        border-radius: 15px;
    }
    
    .message {
        max-width: 85%;
    }
    
    .chat-header {
        padding: 12px 15px;
    }
    
    .header-right {
        gap: 5px;
    }
    
    .btn-icon {
        width: 36px;
        height: 36px;
        font-size: 18px;
    }
    
    .welcome-message {
        padding: 12px;
        font-size: 13px;
    }
}