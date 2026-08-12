console.log('%c DesignOps Orchestrator ', 'background: #ec4899; color: white; font-weight: bold; padding: 4px; border-radius: 4px;');
console.log('TS System Active.');

const buttons = document.querySelectorAll('.btn');

buttons.forEach(btn => {
    btn.addEventListener('click', (e) => {
        const target = e.target as HTMLElement;
        console.log(`Clicked: ${target.innerText}`);
        target.style.transform = 'scale(0.95)';
        setTimeout(() => target.style.transform = 'scale(1)', 150);
    });
});