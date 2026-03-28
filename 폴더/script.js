let player;
let volume = 50;

// 유튜브
function onYouTubeIframeAPIReady() {
  player = new YT.Player('ytplayer', {
    playerVars: {
      listType: 'playlist',
      list: 'PLaIrSWYs1VRGNj0M9FTlSk3vVAagIHBPq',
      autoplay: 1
    },
    events: {
      onStateChange: updateTitle
    }
  });
}

function updateTitle() {
  const data = player.getVideoData();
  document.getElementById("title").innerText = data.title;
}

function playVideo() { player.playVideo(); }
function pauseVideo() { player.pauseVideo(); }

function volUp() {
  volume = Math.min(100, volume + 10);
  player.setVolume(volume);
}

function volDown() {
  volume = Math.max(0, volume - 10);
  player.setVolume(volume);
}

function togglePlayer() {
  document.getElementById("player").classList.toggle("open");
}

// 🐾 시메지
const el = document.getElementById("shimeji");

let x = 100;
let y = 100;
let dragging = false;

el.onmousedown = () => dragging = true;
window.onmouseup = () => dragging = false;

window.onmousemove = (e) => {
  if (!dragging) return;
  x = e.clientX;
  y = e.clientY;
  el.style.left = x + "px";
  el.style.top = y + "px";
};
