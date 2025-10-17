// Popup script for Chrome extension

const PLATFORMS = {
  'instagram.com': { name: 'Instagram', icon: '📸' },
  'facebook.com': { name: 'Facebook', icon: '👥' },
  'youtube.com': { name: 'YouTube', icon: '▶️' },
  'tiktok.com': { name: 'TikTok', icon: '🎵' }
};

// Initialize popup
document.addEventListener('DOMContentLoaded', async () => {
  await loadSettings();
  await loadStats();
  await loadActiveSessions();
  
  // Set up event listeners
  setupEventListeners();
  
  // Update every second
  setInterval(loadActiveSessions, 1000);
});

// Load settings from storage
async function loadSettings() {
  const { limits, notifications } = await chrome.storage.local.get(['limits', 'notifications']);
  
  if (limits) {
    document.getElementById('limit-instagram').value = limits['instagram.com'] || 20;
    document.getElementById('limit-facebook').value = limits['facebook.com'] || 20;
    document.getElementById('limit-youtube').value = limits['youtube.com'] || 30;
    document.getElementById('limit-tiktok').value = limits['tiktok.com'] || 15;
  }
  
  const toggle = document.getElementById('notifications-toggle');
  if (notifications === false) {
    toggle.classList.remove('active');
  }
}

// Load statistics
async function loadStats() {
  const { stats } = await chrome.storage.local.get('stats');
  
  if (stats) {
    document.getElementById('total-time').textContent = formatTime(stats.totalTime);
    document.getElementById('sessions-count').textContent = stats.sessionsToday;
    document.getElementById('longest-session').textContent = formatTime(stats.longestSession);
    document.getElementById('streak').textContent = stats.streak;
  }
}

// Load active sessions
async function loadActiveSessions() {
  const response = await chrome.runtime.sendMessage({ action: 'getActiveSessions' });
  const sessions = response.sessions || {};
  const container = document.getElementById('sessions-container');
  
  // Clear container
  container.innerHTML = '';
  
  const activeSessions = Object.entries(sessions).filter(([_, session]) => session.lastUpdate);
  
  if (activeSessions.length === 0) {
    container.innerHTML = `
      <div class="empty-state">
        <div class="empty-emoji">😌</div>
        <p>No active sessions</p>
      </div>
    `;
    return;
  }
  
  // Display each active session
  for (const [platform, session] of activeSessions) {
    const platformInfo = PLATFORMS[platform];
    if (!platformInfo) continue;
    
    const { limits } = await chrome.storage.local.get('limits');
    const limit = (limits && limits[platform]) || 20;
    const limitSeconds = limit * 60;
    
    const now = Date.now();
    const elapsed = session.lastUpdate ? Math.floor((now - session.lastUpdate) / 1000) : 0;
    const totalTime = session.totalTime + elapsed;
    const progress = Math.min((totalTime / limitSeconds) * 100, 100);
    
    const sessionDiv = document.createElement('div');
    sessionDiv.className = 'session-item';
    sessionDiv.innerHTML = `
      <div class="session-info">
        <span class="session-emoji">${platformInfo.icon}</span>
        <span class="session-name">${platformInfo.name}</span>
      </div>
      <div class="session-time">${formatTime(totalTime)}</div>
    `;
    
    const progressBar = document.createElement('div');
    progressBar.className = 'progress-bar';
    progressBar.innerHTML = `<div class="progress-fill" style="width: ${progress}%"></div>`;
    
    sessionDiv.appendChild(progressBar);
    container.appendChild(sessionDiv);
  }
}

// Set up event listeners
function setupEventListeners() {
  // Save button
  document.getElementById('save-btn').addEventListener('click', saveSettings);
  
  // Notifications toggle
  document.getElementById('notifications-toggle').addEventListener('click', () => {
    const toggle = document.getElementById('notifications-toggle');
    toggle.classList.toggle('active');
  });
}

// Save settings
async function saveSettings() {
  const limits = {
    'instagram.com': parseInt(document.getElementById('limit-instagram').value) || 20,
    'facebook.com': parseInt(document.getElementById('limit-facebook').value) || 20,
    'youtube.com': parseInt(document.getElementById('limit-youtube').value) || 30,
    'tiktok.com': parseInt(document.getElementById('limit-tiktok').value) || 15
  };
  
  const notificationsEnabled = document.getElementById('notifications-toggle').classList.contains('active');
  
  await chrome.storage.local.set({ 
    limits, 
    notifications: notificationsEnabled 
  });
  
  // Show success feedback
  const btn = document.getElementById('save-btn');
  const originalText = btn.textContent;
  btn.textContent = '✓ Saved!';
  btn.style.background = 'linear-gradient(135deg, #86efac 0%, #22c55e 100%)';
  
  setTimeout(() => {
    btn.textContent = originalText;
    btn.style.background = '';
  }, 2000);
}

// Format time in minutes:seconds
function formatTime(seconds) {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}