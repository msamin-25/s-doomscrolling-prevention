// Background service worker for tracking and notifications

const PLATFORMS = {
  'instagram.com': { name: 'Instagram', icon: '📸', defaultLimit: 20 },
  'facebook.com': { name: 'Facebook', icon: '👥', defaultLimit: 20 },
  'youtube.com': { name: 'YouTube', icon: '▶️', defaultLimit: 30 },
  'tiktok.com': { name: 'TikTok', icon: '🎵', defaultLimit: 15 }
};

let activeSessions = {};
let checkInterval = null;

// Initialize extension
chrome.runtime.onInstalled.addListener(() => {
  console.log('Mindful Scroll Tracker installed!');
  initializeSettings();
  startTracking();
});

// Initialize default settings
async function initializeSettings() {
  const settings = await chrome.storage.local.get(['limits', 'notifications', 'stats']);
  
  if (!settings.limits) {
    const defaultLimits = {};
    Object.keys(PLATFORMS).forEach(domain => {
      defaultLimits[domain] = PLATFORMS[domain].defaultLimit;
    });
    await chrome.storage.local.set({ limits: defaultLimits });
  }
  
  if (!settings.notifications) {
    await chrome.storage.local.set({ notifications: true });
  }
  
  if (!settings.stats) {
    await chrome.storage.local.set({ 
      stats: {
        totalTime: 0,
        sessionsToday: 0,
        longestSession: 0,
        streak: 0,
        lastReset: new Date().toDateString()
      }
    });
  }
}

// Start tracking active tabs
function startTracking() {
  // Check active tab every second
  checkInterval = setInterval(checkActiveTab, 1000);
  
  // Listen for tab changes
  chrome.tabs.onActivated.addListener(handleTabChange);
  chrome.tabs.onUpdated.addListener(handleTabUpdate);
  chrome.windows.onFocusChanged.addListener(handleWindowFocus);
}

// Check which tab is currently active
async function checkActiveTab() {
  try {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    if (tab && tab.url) {
      const platform = getPlatformFromUrl(tab.url);
      if (platform) {
        await updateSession(platform, tab.id);
      } else {
        await pauseAllSessions();
      }
    } else {
      await pauseAllSessions();
    }
  } catch (error) {
    console.error('Error checking active tab:', error);
  }
}

// Get platform from URL
function getPlatformFromUrl(url) {
  if (!url) return null;
  
  for (const [domain, info] of Object.entries(PLATFORMS)) {
    if (url.includes(domain)) {
      return domain;
    }
  }
  return null;
}

// Update or create session
async function updateSession(platform, tabId) {
  const now = Date.now();
  
  if (!activeSessions[platform]) {
    // Start new session
    activeSessions[platform] = {
      startTime: now,
      totalTime: 0,
      lastUpdate: now,
      tabId: tabId,
      notified: false
    };
    
    // Show start notification
    showNotification(
      'Session Started',
      `Tracking your time on ${PLATFORMS[platform].name} ${PLATFORMS[platform].icon}`,
      'info'
    );
  } else {
    // Update existing session
    const session = activeSessions[platform];
    const elapsed = Math.floor((now - session.lastUpdate) / 1000);
    session.totalTime += elapsed;
    session.lastUpdate = now;
    
    // Check if limit exceeded
    await checkLimit(platform, session);
  }
  
  // Pause other sessions
  for (const [key, session] of Object.entries(activeSessions)) {
    if (key !== platform && session.lastUpdate) {
      session.lastUpdate = null;
    }
  }
}

// Pause all active sessions
async function pauseAllSessions() {
  for (const [platform, session] of Object.entries(activeSessions)) {
    if (session.lastUpdate) {
      const now = Date.now();
      const elapsed = Math.floor((now - session.lastUpdate) / 1000);
      session.totalTime += elapsed;
      session.lastUpdate = null;
    }
  }
}

// Check if time limit exceeded
async function checkLimit(platform, session) {
  const { limits, notifications } = await chrome.storage.local.get(['limits', 'notifications']);
  const limitMinutes = limits[platform] || PLATFORMS[platform].defaultLimit;
  const limitSeconds = limitMinutes * 60;
  
  if (session.totalTime >= limitSeconds && !session.notified && notifications) {
    session.notified = true;
    
    // Show notification
    showNotification(
      'Time Limit Reached! ⏰',
      `You've spent ${limitMinutes} minutes on ${PLATFORMS[platform].name}. Time for a break!`,
      'warning'
    );
    
    // Inject break screen
    chrome.tabs.sendMessage(session.tabId, {
      action: 'showBreakScreen',
      platform: PLATFORMS[platform].name,
      timeSpent: Math.floor(session.totalTime / 60)
    });
    
    // Update stats
    await updateStats(session, limitSeconds);
  } else if (session.totalTime >= limitSeconds * 0.8 && session.totalTime < limitSeconds && notifications) {
    // 80% warning (only once)
    if (!session.warned80) {
      session.warned80 = true;
      showNotification(
        'Almost at your limit',
        `${Math.floor((limitSeconds - session.totalTime) / 60)} minutes left on ${PLATFORMS[platform].name}`,
        'info'
      );
    }
  }
}

// Update statistics
async function updateStats(session, limit) {
  const { stats } = await chrome.storage.local.get('stats');
  const today = new Date().toDateString();
  
  // Reset daily stats if new day
  if (stats.lastReset !== today) {
    stats.sessionsToday = 0;
    stats.lastReset = today;
  }
  
  stats.totalTime += session.totalTime;
  stats.sessionsToday += 1;
  stats.longestSession = Math.max(stats.longestSession, session.totalTime);
  
  // Update streak
  if (session.totalTime < limit) {
    stats.streak += 1;
  } else {
    stats.streak = 0;
  }
  
  await chrome.storage.local.set({ stats });
}

// Show browser notification
function showNotification(title, message, type) {
  const iconMap = {
    'info': 'icons/icon48.png',
    'warning': 'icons/icon48.png',
    'success': 'icons/icon48.png'
  };
  
  chrome.notifications.create({
    type: 'basic',
    iconUrl: iconMap[type] || 'icons/icon48.png',
    title: title,
    message: message,
    priority: 2
  });
}

// Handle tab change
async function handleTabChange(activeInfo) {
  await checkActiveTab();
}

// Handle tab update
async function handleTabUpdate(tabId, changeInfo, tab) {
  if (changeInfo.status === 'complete' && tab.active) {
    await checkActiveTab();
  }
}

// Handle window focus change
async function handleWindowFocus(windowId) {
  if (windowId === chrome.windows.WINDOW_ID_NONE) {
    await pauseAllSessions();
  } else {
    await checkActiveTab();
  }
}

// End session (called from popup)
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'endSession') {
    const platform = request.platform;
    if (activeSessions[platform]) {
      const session = activeSessions[platform];
      updateStats(session, (request.limit || 20) * 60);
      delete activeSessions[platform];
      sendResponse({ success: true });
    }
  } else if (request.action === 'getActiveSessions') {
    sendResponse({ sessions: activeSessions });
  } else if (request.action === 'dismissBreak') {
    // Just acknowledge, don't end session
    sendResponse({ success: true });
  }
  return true;
});

// Clean up on extension unload
chrome.runtime.onSuspend.addListener(() => {
  if (checkInterval) {
    clearInterval(checkInterval);
  }
});