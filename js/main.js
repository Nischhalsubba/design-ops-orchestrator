import { 
    simulateAiTranslation, 
    simulateAiAssetOptimization, 
    simulateAiCodeAudit,
    simulateAiA11y,
    simulateAiTests,
    simulateAiDocs,
    simulateAiSecurity,
    simulateAiSeo,
    simulateAiPerf,
    simulateAiSelfHealing,
    simulateAiDesignOps
} from './gemini.js';

// --- CONFIGURATION & CONTENT ---

const GULPFILE_CONTENT = `import { src, dest, watch, series, parallel } from 'gulp';
import plumber from 'gulp-plumber';
import notify from 'gulp-notify';
import size from 'gulp-size';

// Design System & Styles
import figmaTokens from 'gulp-figma-tokens'; // Virtual Plugin
import dartSass from 'sass';
import gulpSass from 'gulp-sass';
import postcss from 'gulp-postcss';
import autoprefixer from 'autoprefixer';
import cssnano from 'cssnano';
import critical from 'gulp-critical';

// Markup
import pug from 'gulp-pug';
import htmlmin from 'gulp-htmlmin';

// Scripts
import esbuild from 'gulp-esbuild';

// AI Design Agents
import { 
  aiDesignOps, aiA11y, aiSeo, aiPerf, aiHealer 
} from '@flowgen/design-agents';

const sass = gulpSass(dartSass);

// --- DESIGN OPS PIPELINE ---

// Sync Figma Variables -> SCSS
export function syncTokens() {
  return src('design-tokens.json')
    .pipe(aiDesignOps({ source: 'figma-api' }))
    .pipe(figmaTokens({ format: 'scss' }))
    .pipe(dest('src/styles/tokens'));
}

export function styles() {
  return src('src/styles/**/*.scss')
    .pipe(plumber({ errorHandler: aiHealer() })) // Auto-fix syntax
    .pipe(sass())
    .pipe(postcss([autoprefixer(), cssnano()]))
    .pipe(critical({ base: 'dist/', inline: true })) // Critical CSS for UX
    .pipe(size({ title: 'Styles' }))
    .pipe(dest('dist/css'));
}

export function markup() {
  return src('src/markup/**/*.pug')
    .pipe(pug())
    .pipe(aiA11y({ strict: true }))  // WCAG 2.2 Check
    .pipe(aiSeo())
    .pipe(htmlmin({ collapseWhitespace: true }))
    .pipe(dest('dist'));
}

export function scripts() {
  return src('src/scripts/**/*.ts')
    .pipe(esbuild({ target: 'esnext' }))
    .pipe(dest('dist/js'));
}

export default series(
  syncTokens,
  parallel(markup, styles, scripts)
);`;

const PACKAGE_JSON_CONTENT = `{
  "name": "design-ops-orchestrator",
  "version": "1.0.0",
  "description": "An intelligent DesignOps pipeline bridging the gap between Figma tokens and production infrastructure. Automates UX consistency and accessibility via Generative AI.",
  "author": "Nischhal Raj Subba <nischhal@example.com>",
  "scripts": {
    "start": "gulp",
    "design:sync": "gulp syncTokens"
  },
  "dependencies": {
    "gulp": "^5.0.0",
    "gulp-figma-tokens": "^2.1.0",
    "gulp-critical": "^5.0.0",
    "@flowgen/design-agents": "^3.0.0"
  }
}`;

const FILES = {
  'gulpfile.js': GULPFILE_CONTENT,
  'package.json': PACKAGE_JSON_CONTENT,
  'README.md': '# DesignOps Orchestrator\n\nBridging Figma and Code with AI.\nArchitected by Nischhal Raj Subba.',
  'src/styles/tokens/_colors.scss': '$primary-500: #3B82F6;\n$neutral-900: #111827;',
  'design-tokens.json': '{ "version": "1.0", "colors": { ... } }',
};

const state = {
    isRunning: true,
    intervalId: null,
};

const logsContainer = document.getElementById('logs');
const scrollAnchor = document.getElementById('scroll-anchor');
const cliForm = document.getElementById('cli-form');
const cliInput = document.getElementById('cli-input');
const statusIndicator = document.getElementById('status-indicator');
const footerStatus = document.getElementById('footer-status');

function formatTime(date) {
    return date.toLocaleTimeString([], { hour12: false, hour: '2-digit', minute:'2-digit', second:'2-digit'});
}

function addLog(message, type = 'info') {
    const div = document.createElement('div');
    div.className = "break-words leading-relaxed tracking-tight font-mono text-sm";
    
    let icon = '';
    let colorClass = 'text-gray-300';

    switch(type) {
        case 'command': icon = '➜ '; colorClass = 'text-white font-bold'; break;
        case 'info': icon = 'ℹ '; colorClass = 'text-blue-400'; break;
        case 'success': icon = '✔ '; colorClass = 'text-green-500 font-bold'; break;
        case 'warn': icon = '⚡ '; colorClass = 'text-yellow-400 font-bold'; break;
        case 'error': icon = '✖ '; colorClass = 'text-red-500 font-bold'; break;
        
        // AI Agent Colors
        case 'ai-ds': icon = '🎨 '; colorClass = 'text-pink-400 font-bold'; break; // DesignOps
        case 'ai-a11y': icon = '♿ '; colorClass = 'text-cyan-400 font-bold'; break; // Accessibility
        case 'ai-perf': icon = '🚀 '; colorClass = 'text-orange-400 font-bold'; break; // Performance
        case 'ai-heal': icon = '💊 '; colorClass = 'text-green-400 font-bold'; break; // Self Healing
        case 'ai-core': icon = '🧠 '; colorClass = 'text-purple-400 font-bold'; break; // General AI
    }

    const timeSpan = `<span class="text-gray-600 mr-2 select-none text-xs">[${formatTime(new Date())}]</span>`;
    const iconSpan = icon ? `<span class="${colorClass}">${icon}</span>` : '';
    
    div.innerHTML = `${timeSpan}${iconSpan}<span class="${colorClass}">${message}</span>`;
    
    logsContainer.appendChild(div);
    if (logsContainer.children.length > 150) logsContainer.removeChild(logsContainer.firstChild);
    scrollAnchor.scrollIntoView({ behavior: 'smooth' });
}

function handleCommand(cmdRaw) {
    const cmd = cmdRaw.trim();
    if (!cmd) return;
    addLog(cmd, 'command');
    const [command, ...args] = cmd.split(' ');

    if (command === 'start') {
        if (!state.isRunning) {
            updateStatus(true);
            addLog('Initializing DesignOps Core...', 'success');
        }
    } else if (command === 'stop') {
        updateStatus(false);
    } else if (command === 'clear') {
        logsContainer.innerHTML = '';
    } else if (command === 'ls') {
        addLog(Object.keys(FILES).join('\n'), 'output');
    } else if (command === 'cat') {
        addLog(FILES[args[0]] || 'File not found', 'output');
    } else if (command === 'help') {
        addLog('Commands: start, stop, ls, cat, clear', 'output');
    } else {
        addLog(`Command not found: ${command}`, 'error');
    }
}

function updateStatus(running) {
    state.isRunning = running;
    if (running) {
        statusIndicator.innerText = "Status: SYNCED WITH FIGMA";
        statusIndicator.className = "text-pink-400 animate-pulse";
        footerStatus.innerText = "ACTIVE";
        startSimulation();
    } else {
        statusIndicator.innerText = "Status: DISCONNECTED";
        statusIndicator.className = "text-gray-500";
        footerStatus.innerText = "STOPPED";
        clearInterval(state.intervalId);
        state.intervalId = null;
    }
}

function startSimulation() {
    if (state.intervalId) return;

    // Boot
    setTimeout(() => addLog('DesignOps Orchestrator v1.0', 'info'), 500);
    setTimeout(() => addLog('Loaded: 462 Design Tokens', 'ai-ds'), 700);
    setTimeout(() => addLog('Agents: DesignOps, A11y, Healer, Perf', 'ai-core'), 1000);

    state.intervalId = setInterval(async () => {
        if (Math.random() > 0.6) {
            const type = ['token', 'markup', 'style'][Math.floor(Math.random() * 3)];
            
            if (type === 'token') {
                addLog('Figma Webhook: Variables updated', 'ai-ds');
                addLog('Syncing tokens...', 'info');
                
                const dsLog = await simulateAiDesignOps('design-tokens.json');
                addLog(dsLog, 'ai-ds');
                
                addLog('Sass Re-compiled with new Token values', 'success');
            } 
            else if (type === 'markup') {
                addLog('File changed: component.pug', 'warn');
                
                const a11y = await simulateAiA11y('component.html');
                addLog(a11y, 'ai-a11y');

                addLog('HTMLMin: Optimized for render', 'success');
            }
            else if (type === 'style') {
                addLog('File changed: _buttons.scss', 'warn');
                
                if (Math.random() > 0.8) {
                    const heal = await simulateAiSelfHealing('Error: Undefined variable $btn-primary');
                    addLog(heal, 'ai-heal');
                }

                const perf = await simulateAiPerf('main.css');
                addLog(perf, 'ai-perf');
                
                addLog('Critical CSS: Inline styles updated', 'success');
            }
        }
    }, 4500);
}

// Init
cliForm.addEventListener('submit', (e) => {
    e.preventDefault();
    handleCommand(cliInput.value);
    cliInput.value = '';
});
document.addEventListener('click', () => {
    if (document.getSelection().type !== 'Range') cliInput.focus();
});
updateStatus(true);