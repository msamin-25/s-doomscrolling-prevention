# 🚀 Mindful Scroll Tracker - Chrome Extension Installation Guide

## 📋 What You'll Need

This Chrome extension **automatically tracks** your time on social media and **sends notifications** when you reach your limits!

### Features:

- ✅ **Automatic tracking** - No manual start/stop needed
- ✅ **Browser notifications** when time is up
- ✅ **Full-screen break reminders** on the actual websites
- ✅ **Real-time progress tracking**
- ✅ **Customizable time limits** for each platform
- ✅ **Daily statistics** and streak tracking

## Load Extension in Chrome

1. **Open Chrome** and go to:

   ```
   chrome://extensions/
   ```

2. **Enable Developer Mode**

   - Toggle the switch in the top-right corner

3. **Load the Extension**

   - Click "Load unpacked"
   - Select your `mindful-scroll-tracker` folder
   - Click "Select Folder"

4. **Pin the Extension** (optional)
   - Click the puzzle icon in Chrome toolbar
   - Pin "Mindful Scroll Tracker" for easy access

---

## Set Your Limits

1. Click the extension icon in your toolbar
2. Set your time limits according to you for each platform:
   - Instagram: 20 minutes (default)
   - Facebook: 20 minutes (default)
   - YouTube: 30 minutes (default)
   - TikTok: 15 minutes (default)
3. Toggle notifications ON/OFF
4. Click "Save Settings"

---

## 🚀 How It Works

### Automatic Tracking:

1. Open Instagram, Facebook, YouTube, or TikTok
2. Extension **automatically starts tracking**
3. You'll see a timer in the extension popup
4. Progress bar shows how close you are to your limit

### Notifications:

- **80% warning**: "Almost at your limit - X minutes left"
- **100% limit reached**: Full-screen break reminder appears on the website
- Browser notification: "Time for a Break!"

### Break Screen:

When you hit your limit, a beautiful overlay appears with:

- Suggested alternative activities
- Two options: "End Session" or "5 More Minutes"
- Can't be dismissed with ESC key (gentle enforcement)

---

## 🎨 Customization Options

### Change Time Limits:

- Open the extension popup
- Adjust minutes for each platform
- Click "Save Settings"

### Disable Notifications:

- Toggle the notifications switch OFF
- You'll still see the break screen, but no browser notifications

### Reset Statistics:

- Stats reset automatically each day at midnight
- Current session data is preserved

---

## 🐛 Troubleshooting

### Extension not tracking?

- Make sure you're on the actual social media website
- Check if the extension is enabled in `chrome://extensions/`
- Try reloading the extension

### Notifications not showing?

- Check Chrome notification permissions
- Make sure notifications are enabled in the extension popup
- Check your system notification settings

### Break screen not appearing?

- Refresh the social media page
- Check if the content script is injected
- Look for errors in the Console (F12)

### Stats not updating?

- Close and reopen the extension popup
- Check the background service worker in `chrome://extensions/`

---

## 🔐 Privacy & Permissions

### What the extension accesses:

- ✅ Social media websites only (Instagram, Facebook, YouTube, TikTok)
- ✅ Browser storage for your settings and stats
- ✅ Notification API for alerts

### What it does NOT do:

- ❌ No data collection
- ❌ No external servers
- ❌ No tracking of other websites
- ❌ No access to passwords or personal data
- ❌ Everything stays on your computer

---

## 📊 Understanding Your Stats

**Total Today**: Total time spent across all platforms today
**Sessions**: Number of times you visited these sites
**Longest**: Your longest single session duration
**Streak**: Consecutive sessions where you stayed under your limit

---

## 🎯 Tips for Success

1. **Start with realistic limits** - Don't set them too low initially
2. **Gradually decrease** your limits over time
3. **Actually take breaks** when the screen appears
4. **Track your streak** - Make it a game!
5. **Review your stats** daily to build awareness

---

## 🔄 Updating the Extension

To update or modify:

1. Edit the files in your extension folder
2. Go to `chrome://extensions/`
3. Click the refresh icon on your extension
4. Changes will take effect immediately

---

## 🌟 Next Steps

Want to enhance the extension?

- Add website blocking after time limit
- Export statistics to CSV
- Weekly/monthly reports
- Integration with productivity apps
- Custom break activities
- Pomodoro timer integration

---

## ❓ FAQ

**Q: Does this work on mobile?**
A: No, this is a Chrome extension for desktop only. Mobile requires a native app.

**Q: Can I block websites entirely?**
A: Currently no, but you can modify the code to redirect after time limit.

**Q: Does it work in Incognito mode?**
A: Only if you enable it for Incognito in `chrome://extensions/`

**Q: Can I use this in other browsers?**
A: It works in any Chromium browser (Edge, Brave, Opera) with minor adjustments.

---

## 🎉 You're All Set!

Your Chrome extension is now tracking your social media time automatically!

Open Instagram, Facebook, YouTube, or TikTok and watch the magic happen. The extension icon will show your active sessions, and you'll get notified when it's time for a break.

**Remember**: The goal isn't to never use social media - it's to use it mindfully and intentionally!
