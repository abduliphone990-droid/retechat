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
        password: password, // В реальном приложении нужно хешировать пароль!
        createdAt: new Date().toISOString()
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
    
    // Сохраняем данные текущего пользователя
    localStorage.setItem('current_user', username);
    
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

function shareChat() {
    const chatUrl = window.location.href;
    
    // Копируем ссылку в буфер обмена
    navigator.clipboard.writeText(chatUrl).then(() => {
        alert('Ссылка на чат скопирована! Отправьте её другу.');
    }).catch(() => {
        // Если не поддерживается Clipboard API
        prompt('Скопируйте эту ссылку и отправьте другу:', chatUrl);
    });
}