import { askArchitect } from './gemini.js';

// --- Mobile Menu ---
const menuToggle = document.getElementById('menu-toggle');
const sidebar = document.getElementById('sidebar');

if (menuToggle && sidebar) {
    menuToggle.addEventListener('click', () => {
        const isClosed = sidebar.classList.contains('-translate-x-full');
        if (isClosed) {
            sidebar.classList.remove('-translate-x-full');
        } else {
            sidebar.classList.add('-translate-x-full');
        }
    });
}

// --- AI Widget Logic ---
const aiToggle = document.getElementById('ai-toggle');
const aiWindow = document.getElementById('ai-chat-window');
const closeAi = document.getElementById('close-ai');
const aiForm = document.getElementById('ai-form');
const aiInput = document.getElementById('ai-input');
const aiMessages = document.getElementById('ai-messages');

function toggleChat() {
    aiWindow.classList.toggle('hidden');
}

function appendMessage(text, sender) {
    const div = document.createElement('div');
    div.className = sender === 'user' 
        ? "bg-slate-800 text-white p-2 rounded-lg rounded-br-none self-end ml-8 text-sm"
        : "bg-pink-900/20 border border-pink-900/50 text-pink-200 p-2 rounded-lg rounded-bl-none self-start mr-8 text-sm";
    div.textContent = text;
    
    // Wrapper for alignment
    const wrapper = document.createElement('div');
    wrapper.className = `flex w-full ${sender === 'user' ? 'justify-end' : 'justify-start'}`;
    wrapper.appendChild(div);
    
    aiMessages.appendChild(wrapper);
    aiMessages.scrollTop = aiMessages.scrollHeight;
}

if (aiToggle) aiToggle.addEventListener('click', toggleChat);
if (closeAi) closeAi.addEventListener('click', toggleChat);

if (aiForm) {
    aiForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const prompt = aiInput.value.trim();
        if (!prompt) return;

        // User Message
        appendMessage(prompt, 'user');
        aiInput.value = '';

        // Loading state
        const loadingId = 'loading-' + Date.now();
        const loadingDiv = document.createElement('div');
        loadingDiv.id = loadingId;
        loadingDiv.className = "flex w-full justify-start";
        loadingDiv.innerHTML = `<div class="bg-pink-900/20 text-pink-200 p-2 rounded-lg text-xs animate-pulse">Thinking...</div>`;
        aiMessages.appendChild(loadingDiv);

        try {
            // AI Response
            const response = await askArchitect(prompt);
            document.getElementById(loadingId).remove();
            appendMessage(response, 'ai');
        } catch (err) {
            document.getElementById(loadingId).remove();
            appendMessage("I'm having trouble connecting to the neural core. Try again.", 'ai');
        }
    });
}