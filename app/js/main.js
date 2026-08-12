import { askAssistant } from './ai-manager.js';

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
    // Auto focus input when opening
    if (!aiWindow.classList.contains('hidden')) {
        setTimeout(() => aiInput.focus(), 100);
    }
}

function appendMessage(text, sender) {
    const div = document.createElement('div');
    
    // Updated 2026 Palette Styles
    if (sender === 'user') {
        // Steel Blue background, Navy text
        div.className = "bg-steel text-navy font-medium p-3 rounded-2xl rounded-br-none self-end ml-8 text-sm max-w-[80%] shadow-lg";
    } else {
        // Cobalt/Glass background, Pale text
        div.className = "bg-cobalt/40 border border-steel/20 text-pale p-3 rounded-2xl rounded-bl-none self-start mr-8 text-sm prose prose-invert prose-sm max-w-[90%] shadow-lg backdrop-blur-sm";
    }
    
    // Basic Markdown parsing for AI response
    if (sender === 'ai') {
        div.innerHTML = text.replace(/\*\*(.*?)\*\*/g, '<b>$1</b>')
                            .replace(/`(.*?)`/g, '<code class="bg-navy px-1 py-0.5 rounded text-steel font-mono text-xs border border-steel/20">$1</code>')
                            .replace(/\n/g, '<br>');
    } else {
        div.textContent = text;
    }
    
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

        appendMessage(prompt, 'user');
        aiInput.value = '';

        const loadingId = 'loading-' + Date.now();
        const loadingDiv = document.createElement('div');
        loadingDiv.id = loadingId;
        loadingDiv.className = "flex w-full justify-start";
        // Loading style
        loadingDiv.innerHTML = `<div class="bg-cobalt/20 text-steel border border-steel/10 p-3 rounded-2xl text-xs flex items-center gap-2"><span class="animate-pulse w-2 h-2 rounded-full bg-steel"></span> Processing</div>`;
        aiMessages.appendChild(loadingDiv);
        aiMessages.scrollTop = aiMessages.scrollHeight;

        try {
            const response = await askAssistant(prompt);
            document.getElementById(loadingId).remove();
            appendMessage(response, 'ai');
        } catch (err) {
            document.getElementById(loadingId).remove();
            appendMessage("System Malfunction: Unable to connect.", 'ai');
        }
    });
}