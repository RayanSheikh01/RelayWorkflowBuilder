export function initLogPanel() {
    const logPanel = document.getElementById('log-panel');
    const toggleBtn = document.getElementById('btn-toggle-log');
    const header = document.getElementById('log-header');
    const content = document.getElementById('log-content');

    if (!logPanel || !header || !content) return;

    const toggle = () => logPanel.classList.toggle('collapsed');
    
    header.addEventListener('click', toggle);
    
    // Clear logs on init
    content.innerHTML = '';
}

export function appendLog(message, type = 'info') {
    const content = document.getElementById('log-content');
    if (!content) return;
    
    const entry = document.createElement('div');
    entry.className = `log-entry ${type}`;
    
    const time = new Date().toLocaleTimeString([], { hour12: false });
    
    entry.innerHTML = `
        <span class="timestamp">[${time}]</span>
        <span class="message">${message}</span>
    `;
    
    content.appendChild(entry);
    content.scrollTop = content.scrollHeight;
}
