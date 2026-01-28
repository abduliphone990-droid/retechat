// sync.js - Синхронизация сообщений через файлы

// Функция для экспорта чата в файл
function exportChat() {
    const messages = JSON.parse(localStorage.getItem('chat_messages') || '[]');
    const users = JSON.parse(localStorage.getItem('messenger_users') || '{}');
    
    // Создаем объект для экспорта
    const chatExport = {
        version: '1.0',
        exportDate: new Date().toISOString(),
        messages: messages,
        users: users,
        info: 'Импортируйте этот файл в мессенджер'
    };
    
    // Преобразуем в JSON
    const exportText = JSON.stringify(chatExport, null, 2);
    
    // Создаем файл для скачивания
    const blob = new Blob([exportText], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `chat_export_${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    
    // Очищаем URL
    setTimeout(() => URL.revokeObjectURL(url), 100);
    
    alert('Чат экспортирован в файл! Отправьте этот файл другу.');
}

// Функция для импорта чата из файла
function importChat() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    
    input.onchange = function(e) {
        const file = e.target.files[0];
        if (!file) return;
        
        const reader = new FileReader();
        
        reader.onload = function(event) {
            try {
                const chatData = JSON.parse(event.target.result);
                
                // Проверяем формат файла
                if (!chatData.messages || !Array.isArray(chatData.messages)) {
                    throw new Error('Неверный формат файла');
                }
                
                // Импортируем сообщения
                localStorage.setItem('chat_messages', JSON.stringify(chatData.messages));
                
                // Импортируем пользователей (если есть)
                if (chatData.users && typeof chatData.users === 'object') {
                    const existingUsers = JSON.parse(localStorage.getItem('messenger_users') || '{}');
                    const mergedUsers = { ...existingUsers, ...chatData.users };
                    localStorage.setItem('messenger_users', JSON.stringify(mergedUsers));
                }
                
                alert(`Успешно импортировано ${chatData.messages.length} сообщений! Страница будет перезагружена.`);
                
                // Перезагружаем страницу
                setTimeout(() => {
                    window.location.reload();
                }, 1000);
                
            } catch (error) {
                console.error('Ошибка импорта:', error);
                alert('Ошибка при импорте файла. Проверьте формат файла.');
            }
        };
        
        reader.onerror = function() {
            alert('Ошибка чтения файла');
        };
        
        reader.readAsText(file);
    };
    
    input.click();
}

// Функция для синхронизации между вкладками одного браузера
function setupTabSync() {
    // Слушаем изменения в localStorage
    window.addEventListener('storage', function(event) {
        if (event.key === 'chat_messages_updated') {
            console.log('Обнаружены новые сообщения в другой вкладке');
            
            // Загружаем свежие сообщения
            if (typeof window.loadMessages === 'function') {
                window.loadMessages();
            }
        }
    });
    
    // Периодически проверяем обновления
    setInterval(() => {
        const lastCheck = localStorage.getItem('last_sync_check') || '0';
        const lastUpdate = localStorage.getItem('last_message_update') || '0';
        
        if (lastUpdate > lastCheck) {
            localStorage.setItem('last_sync_check', Date.now().toString());
            
            if (typeof window.loadMessages === 'function') {
                window.loadMessages();
            }
        }
    }, 2000); // Проверяем каждые 2 секунды
}

// Функция для отправки уведомления об обновлении
function notifyMessageUpdate() {
    localStorage.setItem('last_message_update', Date.now().toString());
    localStorage.setItem('chat_messages_updated', Date.now().toString());
    
    // Удаляем через короткое время
    setTimeout(() => {
        localStorage.removeItem('chat_messages_updated');
    }, 100);
}

// Инициализация синхронизации
function initSync() {
    setupTabSync();
    console.log('Синхронизация между вкладками активирована');
}

// Экспортируем функции
window.sync = {
    exportChat,
    importChat,
    notifyMessageUpdate,
    initSync
};

// Автоматическая инициализация
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initSync);
} else {
    initSync();
}