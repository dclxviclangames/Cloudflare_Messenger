const messageForm = document.getElementById('message-form');
const messagesContainer = document.getElementById('messages');
const authorInput = document.getElementById('author');
const contentInput = document.getElementById('content');

// URL вашего Cloudflare Worker
const workerUrl = 'https://<ВАШ_SUBDOMAIN>.workers.dev/api/messages';

async function fetchMessages() {
    try {
        const response = await fetch(workerUrl);
        if (!response.ok) {
            throw new Error('Failed to fetch messages');
        }
        const messages = await response.json();
        renderMessages(messages);
    } catch (error) {
        console.error('Ошибка при получении сообщений:', error);
    }
}

function renderMessages(messages) {
    messagesContainer.innerHTML = '';
    messages.reverse().forEach(msg => {
        const messageElement = document.createElement('div');
        messageElement.classList.add('message');
        messageElement.innerHTML = `
            <span class="message-author">${msg.author}:</span>
            <span class="message-content">${msg.content}</span>
        `;
        messagesContainer.appendChild(messageElement);
    });
}

messageForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const author = authorInput.value;
    const content = contentInput.value;

    try {
        const response = await fetch(workerUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ author, content }),
        });

        if (!response.ok) {
            throw new Error('Failed to send message');
        }

        contentInput.value = ''; // Очистка поля ввода
        await fetchMessages(); // Обновление сообщений
    } catch (error) {
        console.error('Ошибка при отправке сообщения:', error);
    }
});

// Периодическое обновление сообщений
setInterval(fetchMessages, 3000); 
fetchMessages();
