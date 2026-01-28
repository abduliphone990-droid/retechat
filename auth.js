document.addEventListener('DOMContentLoaded', function() {
    // Проверяем, на какой странице находимся
    if (window.location.pathname.includes('login.html')) {
        setupAuthPage();
    } else if (window.location.pathname.includes('chat.html')) {
        checkAuth();
    }
});

function setupAuthPage() {
    const authForm = document.getElementById('auth-form');
    const authTitle = document.getElementById('auth-title');
    const submitBtn = document.getElementById('submit-btn');
    const switchLink = document.getElementById('switch-link');
    const switchText = document.getElementById('switch-text');
    const errorMessage = document.getElementById('error-message');
    
    // Проверяем, режим регистрации или входа
    const urlParams = new URLSearchParams(window.location.search);
    const isRegister = urlParams.get('register') === 'true';
    
    if (isRegister) {
        authTitle.textContent = 'Регистрация';
        submitBtn.innerHTML = '<i class="fas fa-user-plus"></i> Зарегистрироваться';
        switchText.innerHTML = 'Уже есть аккаунт? <a href="#" id="switch-link">Войдите</a>';
    }
    
    // Обработчик переключения между входом и регистрацией
    switchLink.addEventListener('click', function(e) {
        e.preventDefault();
        if (isRegister) {
            window.location.href = 'login.html';
        } else {
            window.location.href = 'login.html?register=true';
        }
    });
    
    // Обработчик формы
    authForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const username = document.getElementById('username').value.trim();
        const password = document.getElementById('password').value;
        
        // Простая валидация
        if (username.length < 3) {
            showError('Имя пользователя должно содержать минимум 3 символа');
            return;
        }
        
        if (password.length < 6) {
            showError('Пароль должен содержать минимум 6 символов');
            return;
        }
        
        // Запрещаем специальные символы в имени
        if (!/^[a-zA-Z0-9_]+$/.test(username)) {
            showError('Имя пользователя может содержать только буквы, цифры и нижнее подчеркивание');
            return;
        }
        
        if (isRegister) {
            register(username, password);
        } else {
            login(username, password);
        }
    });
    
    function showError(message) {
        errorMessage.textContent = message;
        errorMessage.style.display = 'block';
        setTimeout(() => {
            errorMessage.style.display = 'none';
        }, 5000);
    }
}

function register(username, password) {
    // Проверяем, существует ли пользователь
    const users = JSON.parse(localStorage.getItem('messenger_users') || '{}');
    
    if (users[username]) {
        showError('Пользователь с таким именем уже существует');
        return;
    }
    
    // Сохраняем пользователя
    users[username] = {
        password: password,
        createdAt: new Date().toISOString(),
        lastLogin: new Date().toISOString()
    };
    
    localStorage.setItem('messenger_users', JSON.stringify(users));
    
    // Автоматически входим после регистрации
    login(username, password);
}

function login(username, password) {
    const users = JSON.parse(localStorage.getItem('messenger_users') || '{}');
    const user = users[username];
    
    if (!user || user.password !== password) {
        const errorMessage = document.getElementById('error-message');
        errorMessage.textContent = 'Неверное имя пользователя или пароль';
        errorMessage.style.display = 'block';
        return;
    }
    
    // Обновляем время последнего входа
    user.lastLogin = new Date().toISOString();
    users[username] = user;
    localStorage.setItem('messenger_users', JSON.stringify(users));
    
    // Сохраняем данные текущего пользователя
    localStorage.setItem('current_user', username);
    localStorage.setItem('last_login', new Date().toISOString());
    
    // Перенаправляем в чат
    window.location.href = 'chat.html';
}

function checkAuth() {
    const currentUser = localStorage.getItem('current_user');
    
    if (!currentUser) {
        window.location.href = 'login.html';
        return;
    }
    
    // Отображаем имя пользователя
    const userElement = document.getElementById('current-user');
    if (userElement) {
        userElement.textContent = currentUser;
    }
    
    return currentUser;
}

function logout() {
    localStorage.removeItem('current_user');
    window.location.href = 'index.html';
}

// Обновленная функция shareChat - просто копирует ссылку
function shareChat() {
    const chatUrl = window.location.href;
    
    navigator.clipboard.writeText(chatUrl).then(() => {
        alert('Ссылка на чат скопирована в буфер обмена! Отправьте её другу.\n\nДруг должен:\n1. Открыть ссылку\n2. Зарегистрироваться под своим именем\n3. Импортировать чат через кнопку 📥');
    }).catch(() => {
        prompt('Скопируйте эту ссылку и отправьте другу:', chatUrl);
    });
}

// Добавляем функции экспорта/импорта в глобальную область видимости
window.exportChat = window.sync?.exportChat || exportChat;
window.importChat = window.sync?.importChat || importChat;