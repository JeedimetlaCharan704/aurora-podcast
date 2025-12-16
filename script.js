const player = document.getElementById("player");
let currentButton = null;

function playAudio(file, btn) {
  // If clicking same button
  if (currentButton === btn) {
    if (!player.paused) {
      player.pause();
      btn.innerHTML = "▶";
      btn.classList.remove("active");
    } else {
      player.play();
      btn.innerHTML = "⏸";
      btn.classList.add("active");
    }
    return;
  }

  // New button clicked
  document.querySelectorAll(".play-btn, .full-btn")
    .forEach(b => {
      b.classList.remove("active");
      if (b.classList.contains("play-btn")) b.innerHTML = "▶";
    });

  currentButton = btn;
  player.src = file;
  player.play();

  btn.classList.add("active");
  btn.innerHTML = "⏸";
}

player.onended = () => {
  if (currentButton) {
    currentButton.innerHTML = "▶";
    currentButton.classList.remove("active");
    currentButton = null;
  }
};

// Dark mode
function toggleDark() {
  document.body.classList.toggle("dark");
}

// Menu
function toggleMenu() {
  document.getElementById("drawer").classList.toggle("open");
}
