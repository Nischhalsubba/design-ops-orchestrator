import { askAssistant } from './assistant-client.js';

const menuToggle = document.getElementById('menu-toggle');
const sidebar = document.getElementById('sidebar');

if (menuToggle && sidebar) {
    menuToggle.addEventListener('click', () => {
        const isClosed = sidebar.classList.contains('-translate-x-full');
        sidebar.classList.toggle('-translate-x-full', !isClosed);
    });
}

const aiToggle = document.getElementById('ai-toggle');
const aiWindow = document.getElementById('ai-chat-window');
const closeAi = document.getElementById('close-ai');
const aiForm = document.getElementById('ai-form');
const aiInput = document.getElementById('ai-input');
const aiMessages = document.getElementById('ai-messages');

function toggleChat() {
    if (!aiWindow) return;
    aiWindow.classList.toggle('hidden');
    if (!aiWindow.classList.contains('hidden') && aiInput) {
        window.setTimeout(() => aiInput.focus(), 100);
    }
}

function appendMessage(text, sender) {
    if (!aiMessages) return;

    const div = document.createElement('div');
    div.className = sender === 'user'
        ? 'bg-steel text-navy font-medium p-3 rounded-2xl rounded-br-none self-end ml-8 text-sm max-w-[80%] shadow-lg whitespace-pre-wrap'
        : 'bg-cobalt/40 border border-steel/20 text-pale p-3 rounded-2xl rounded-bl-none self-start mr-8 text-sm max-w-[90%] shadow-lg backdrop-blur-sm whitespace-pre-wrap';
    div.textContent = String(text ?? '');

    const wrapper = document.createElement('div');
    wrapper.className = `flex w-full ${sender === 'user' ? 'justify-end' : 'justify-start'}`;
    wrapper.appendChild(div);

    aiMessages.appendChild(wrapper);
    aiMessages.scrollTop = aiMessages.scrollHeight;
}

if (aiToggle) aiToggle.addEventListener('click', toggleChat);
if (closeAi) closeAi.addEventListener('click', toggleChat);

if (aiForm && aiInput && aiMessages) {
    aiForm.addEventListener('submit', async (event) => {
        event.preventDefault();
        const prompt = aiInput.value.trim();
        if (!prompt) return;

        appendMessage(prompt, 'user');
        aiInput.value = '';

        const loadingId = `loading-${Date.now()}`;
        const loadingDiv = document.createElement('div');
        loadingDiv.id = loadingId;
        loadingDiv.className = 'flex w-full justify-start';

        const loadingMessage = document.createElement('div');
        loadingMessage.className = 'bg-cobalt/20 text-steel border border-steel/10 p-3 rounded-2xl text-xs flex items-center gap-2';
        loadingMessage.textContent = 'Processing';
        loadingDiv.appendChild(loadingMessage);
        aiMessages.appendChild(loadingDiv);
        aiMessages.scrollTop = aiMessages.scrollHeight;

        try {
            const response = await askAssistant(prompt);
            document.getElementById(loadingId)?.remove();
            appendMessage(response, 'ai');
        } catch {
            document.getElementById(loadingId)?.remove();
            appendMessage('The assistant endpoint is unavailable in this static deployment.', 'ai');
        }
    });
}
