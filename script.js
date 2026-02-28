const player = document.getElementById("player");
const drawer = document.getElementById("drawer");
const overlay = document.getElementById("overlay");
const nowPlaying = document.getElementById("nowPlaying");
const npTitle = document.getElementById("npTitle");

let currentButton = null;

// Firebase Configuration - uses firebase-init.js
// Reference globals defined in firebase-init.js
let auth, db;
try {
  auth = firebase.auth();
  db = firebase.firestore();
} catch(e) {
  console.log('Firebase not available');
}



// ============================================
// DARK MODE
// ============================================
function toggleDark() {
  document.body.classList.toggle("dark");
}

// Menu toggle
function toggleMenu() {
  drawer.classList.toggle("open");
  overlay.classList.toggle("active");
}

// Close menu when clicking overlay
overlay.addEventListener("click", toggleMenu);

// Play audio
function playAudio(file, btn) {
  // If same button clicked
  if (currentButton === btn) {
    if (!player.paused) {
      player.pause();
      btn.innerHTML = "▶";
      btn.classList.remove("playing");
    } else {
      player.play();
      btn.innerHTML = "⏸";
      btn.classList.add("playing");
    }
    return;
  }

  // Reset all buttons
  document.querySelectorAll(".play-btn").forEach(b => {
    b.classList.remove("playing");
    b.innerHTML = "▶";
  });

  // Play new audio
  currentButton = btn;
  player.src = file;
  player.play();
  
  btn.classList.add("playing");
  btn.innerHTML = "⏸";
  
  // Get title
  const title = btn.closest(".episode-item")?.querySelector("h4")?.textContent || 
                btn.closest(".card")?.querySelector("h2")?.textContent || "Audio";
  
  npTitle.textContent = title;
  nowPlaying.classList.add("show");
}

// Stop audio
function stopAudio() {
  player.pause();
  player.currentTime = 0;
  
  document.querySelectorAll(".play-btn").forEach(b => {
    b.classList.remove("playing");
    b.innerHTML = "▶";
  });
  
  nowPlaying.classList.remove("show");
  currentButton = null;
}

// Audio ended
player.onended = () => {
  if (currentButton) {
    currentButton.classList.remove("playing");
    currentButton.innerHTML = "▶";
    currentButton = null;
    nowPlaying.classList.remove("show");
  }
};

// Subscribe button
function subscribe(btn) {
  btn.classList.toggle("subscribed");
  btn.textContent = btn.classList.contains("subscribed") ? "✓ Subscribed" : "➕ Subscribe";
}

// Play playlist with name
function playPlaylist(name) {
  showNotification(`Playing: ${name} playlist`);
  npTitle.textContent = `Playlist: ${name}`;
  nowPlaying.classList.add("show");
}

// Show notification toast
function showNotification(message) {
  alert(message);
}

// Add reminder for events
function addReminder(btn) {
  btn.classList.toggle("reminded");
  if (btn.classList.contains("reminded")) {
    btn.textContent = "✓ Reminder Set";
    showNotification("Reminder set for this event!");
  } else {
    btn.textContent = "🔔 Add Reminder";
    showNotification("Reminder removed");
  }
}

// Filter alerts by type
function filterAlerts(type, element) {
  document.querySelectorAll(".alert-tab").forEach(t => t.classList.remove("active"));
  element.classList.add("active");
  
  document.querySelectorAll(".alert-card").forEach(card => {
    if (type === "all" || card.dataset.type === type) {
      card.style.display = "flex";
    } else {
      card.style.display = "none";
    }
  });
}

// Mark all alerts as read
function markAllRead() {
  document.querySelectorAll(".alert-card.unread").forEach(card => {
    card.classList.remove("unread");
    card.classList.add("read");
    card.querySelector(".unread-dot")?.remove();
  });
  showNotification("All notifications marked as read");
}

// Delete/dismiss alert
function deleteAlert(btn) {
  const card = btn.closest(".alert-card");
  card.style.opacity = "0";
  setTimeout(() => card.remove(), 300);
}

// Delete download
function deleteDownload(btn) {
  const card = btn.closest(".download-card");
  card.style.opacity = "0";
  card.style.transform = "translateX(100px)";
  setTimeout(() => card.remove(), 300);
  showNotification("Download deleted");
}

// Delete all downloads
function deleteAllDownloads() {
  if (confirm("Delete all downloads?")) {
    document.querySelectorAll(".download-card").forEach(card => {
      card.style.opacity = "0";
      setTimeout(() => card.remove(), 300);
    });
    showNotification("All downloads deleted");
  }
}

// Toggle offline mode
function toggleOfflineMode(checkbox) {
  if (checkbox.checked) {
    showNotification("Offline mode enabled");
  } else {
    showNotification("Offline mode disabled");
  }
}

// Toggle setting
function toggleSetting(element) {
  const toggle = element.querySelector(".setting-toggle");
  toggle.classList.toggle("on");
  toggle.textContent = toggle.classList.contains("on") ? "✓" : "✕";
  showNotification("Setting updated");
}

// Category selection
document.querySelectorAll(".cat").forEach(cat => {
  cat.addEventListener("click", function() {
    document.querySelectorAll(".cat").forEach(c => c.classList.remove("active"));
    this.classList.add("active");
  });
});

// Bottom nav tab switching
function switchTab(tabName, element) {
  // Update active state
  document.querySelectorAll(".nav-item").forEach(item => item.classList.remove("active"));
  element.classList.add("active");
  
  // Scroll to relevant section
  switch(tabName) {
    case "home":
      window.scrollTo({ top: 0, behavior: "smooth" });
      break;
    case "notifications":
      const notifSection = Array.from(document.querySelectorAll(".section-header h3")).find(el => el.textContent.includes("Notifications"));
      if (notifSection) notifSection.scrollIntoView({ behavior: "smooth", block: "center" });
      break;
    case "events":
      const eventSection = Array.from(document.querySelectorAll(".section-header h3")).find(el => el.textContent.includes("Events"));
      if (eventSection) eventSection.scrollIntoView({ behavior: "smooth", block: "center" });
      break;
    case "downloads":
      const downloadsSection = Array.from(document.querySelectorAll(".section-header h3")).find(el => el.textContent.includes("Downloads"));
      if (downloadsSection) downloadsSection.scrollIntoView({ behavior: "smooth", block: "center" });
      break;
    case "profile":
      window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" });
      break;
  }
  
  // Haptic feedback
  if (navigator.vibrate) {
    navigator.vibrate(10);
  }
}

// Haptic feedback on mobile
if (navigator.vibrate) {
  document.querySelectorAll(".play-btn, .subscribe-btn, .listen-live-btn").forEach(btn => {
    btn.addEventListener("click", () => navigator.vibrate(10));
  });
}

console.log("Aurora Podcast App v2.0 Loaded");
