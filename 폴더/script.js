let player;
let currentVolume = 50;

function onYouTubeIframeAPIReady() {
  player = new YT.Player('ytplayer');
}

function playVideo() {
  if (player) player.playVideo();
}

function pauseVideo() {
  if (player) player.pauseVideo();
}

function volUp() {
  if (player) {
    currentVolume = Math.min(100, currentVolume + 10);
    player.setVolume(currentVolume);
  }
}

function volDown() {
  if (player) {
    currentVolume = Math.max(0, currentVolume - 10);
    player.setVolume(currentVolume);
  }
}

function togglePlayer() {
  document.getElementById("player").classList.toggle("open");
}

/* ===== 시메지 그대로 유지 ===== */

const sprites = {
  down: ["https://i.imgur.com/5JH2HqN.png","https://i.imgur.com/9IpmQaN.png","https://i.imgur.com/FJh2LPr.png"],
  up: ["https://i.imgur.com/Rp4MyTo.png","https://i.imgur.com/dqR3wTc.png","https://i.imgur.com/sT4sYoE.png"],
  left: ["https://i.imgur.com/AvUePs9.png","https://i.imgur.com/IIzugPg.png","https://i.imgur.com/gfhylI8.png"],
  right: ["https://i.imgur.com/dAudV3g.png","https://i.imgur.com/wHNO6s0.png","https://i.imgur.com/eiulE3a.png"],

  sit: ["https://i.imgur.com/9va1waE.png"],
  sleep: [
    "https://i.imgur.com/X080JsG.png",
    "https://i.imgur.com/xf11w31.png",
    "https://i.imgur.com/DuInk1S.png",
    "https://i.imgur.com/xOfN292.png",
    "https://i.imgur.com/cPNTADo.png"
  ],

  struggle: ["https://i.imgur.com/eSQvjZg.png","https://i.imgur.com/EjO1hB6.png"],
  fall: ["https://i.imgur.com/nSgLstM.png"]
};

const el = document.getElementById("shimeji");

let x = 100, y = 100;
let dir = "right";
let frame = 0;
let state = "walk";

function move(){
  if(state==="walk"){
    x+=1;
    if(x>window.innerWidth-120) x=0;
    el.style.left=x+"px";
    frame++;
    el.src = sprites.right[frame%3];
  }
}

setInterval(move,120);
