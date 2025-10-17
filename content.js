// Content script that injects break screen overlay

let breakScreenActive = false;

// Listen for messages from background script
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'showBreakScreen' && !breakScreenActive) {
    showBreakScreen(request.platform, request.timeSpent);
    sendResponse({ success: true });
  }
  return true;
});

// Create and show break screen overlay
function showBreakScreen(platform, timeSpent) {
  breakScreenActive = true;
  
  // Create overlay
  const overlay = document.createElement('div');
  overlay.id = 'mindful-scroll-break-overlay';
  overlay.innerHTML = `
    <div class="mindful-break-container">
      <div class="mindful-break-content">
        <div class="mindful-icon-pulse">⏰</div>
        <h1 class="mindful-title">Time for a Break! 🌟</h1>
        <p class="mindful-subtitle">
          You've been on <strong>${platform}</strong> for <strong>${timeSpent} minutes</strong>
        </p>
        
        <div class="mindful-activities">
          <h2>Try Something Refreshing!</h2>
          <div class="mindful-activities-grid">
            <div class="mindful-activity">
              <div class="mindful-emoji">🚶‍♀️</div>
              <p>Take a 5-min walk</p>
            </div>
            <div class="mindful-activity">
              <div class="mindful-emoji">💧</div>
              <p>Drink water</p>
            </div>
            <div class="mindful-activity">
              <div class="mindful-emoji">👀</div>
              <p>Look far away</p>
            </div>
            <div class="mindful-activity">
              <div class="mindful-emoji">🧘</div>
              <p>Stretch</p>
            </div>
          </div>
        </div>
        
        <div class="mindful-buttons">
          <button id="mindful-end-session" class="mindful-btn mindful-btn-primary">
            ✓ End Session
          </button>
          <button id="mindful-continue" class="mindful-btn mindful-btn-secondary">
            ⏰ 5 More Minutes
          </button>
        </div>
      </div>
    </div>
  `;
  
  document.body.appendChild(overlay);
  
  // Add event listeners
  document.getElementById('mindful-end-session').addEventListener('click', () => {
    removeBreakScreen();
    // Navigate away
    window.location.href = 'about:blank';
  });
  
  document.getElementById('mindful-continue').addEventListener('click', () => {
    removeBreakScreen();
    chrome.runtime.sendMessage({ action: 'dismissBreak' });
  });
  
  // Prevent scrolling
  document.body.style.overflow = 'hidden';
}

// Remove break screen
function removeBreakScreen() {
  const overlay = document.getElementById('mindful-scroll-break-overlay');
  if (overlay) {
    overlay.remove();
    breakScreenActive = false;
    document.body.style.overflow = '';
  }
}

// Detect if user tries to close the overlay
document.addEventListener('keydown', (e) => {
  if (breakScreenActive && e.key === 'Escape') {
    e.preventDefault();
    // Don't allow escape to close
  }
});