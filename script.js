// =====================
// BGM 플레이어
// =====================

const STORAGE_KEY = 'bgm_player_state';
const PROGRESS_UPDATE_INTERVAL = 500;

const songs = [
  { id: "c2ryq74p4Lg", title: "きれいな感情 · Akino Arai" },
  { id: "7KaL9nDsuX4", title: "星の木馬 · Akino Arai" },
  { id: "Wkn_uKiVT80", title: "Kakuseitoshi · Akino Arai" },
  { id: "Lz3WdYHfZf0", title: "Sally's marbles · Akino Arai" },
  { id: "P89rxnT7lKw", title: "Lost Girl · Toby Fox" },
  { id: "tH1_Harefws", title: "Sigh · Seiji Takahashi" },
  { id: "9x19_Pjgcvc", title: "Remember" },
  { id: "n8PJcBP4Emo", title: "lastend · zts" },
  { id: "r5JrIeDVN0M", title: "君の行方 · KOCHO" },
  { id: "MEt79iCNbFs", title: "Question You 100" },
  { id: "_t8_ztXQEDU", title: "Allure of the Dark" },
  { id: "swi8YKz0fsE", title: "Kyoumen no Nami · YURiKA" },
  { id: "h66BlMPrrxM", title: "Life review · YOUNHA" },
  { id: "pI5-LvbE4AE", title: "LONELY ROLLING STAR" },
  { id: "JuWTsnkn69k", title: "Gareki no rakuen · Akino Arai" },
  { id: "x62e506-Qkc", title: "人間の子供 · Akino Arai" },
  { id: "pqCd2ZsSzR0", title: "ペシュテ · 日南めいcover" },
  { id: "-c00z06FNMM", title: "Truly · YOUNHA" },
  { id: "194g0izPfdA", title: "별의 조각 · YOUNHA" },
  { id: "QgQg_mN8AVo", title: "WANNA BE AN ANGEL · Akino Arai" },
  { id: "KfIMF0zuQ3s", title: "Dear my friend · W&Whale" },
  { id: "cefbTGE-6vk", title: "Moon Light Anthem ～槐 1991～ · Akino Arai" },
  { id: "Z21CSVKcFFs", title: "三日月の寝台 · Akino Arai" },
  { id: "tdpwPIdLIlE", title: "Stay Gold · Hikaru Utada" },
  { id: "2QUv0_aYVlc", title: "叶えて · Akino Arai" },
  { id: "wpYKhPNRvFg", title: "鏡の国 · Akino Arai" },
  { id: "nrGQAOFs1p8", title: "? · Xack" },
  { id: "g6MIZbbKQ6w", title: "羽よ背中に · Akino Arai" },
  { id: "YYxRvpLPyLQ", title: "ダイアモンド クレバス · May'n" },
  { id: "74pRpgzR-Hw", title: "MarbleBalloon (feat. Hatsune Miku) · Twinfield" },
  { id: "h5XQqKuek5A", title: "星降る海 · (cv.早見沙織) Aqu3ra" },
  { id: "ClWHOUHVvcM", title: "Quiet Winter · Harvest Moon: A Wonderful Life" },
  { id: "j6UurE_5J0s", title: "古の星空 ～エルピス：夜～ · Masayoshi Soken · Keiko" },
  { id: "iZBLGM45TOY", title: "Echoes in the Distance · Masayoshi Soken" },
  { id: "jVvPH3cLVT4", title: "創造の奇跡 ～創造環境 ヒュペルボレア造物院～ · Masayoshi Soken · Takafumi Imamura" },
  { id: "juP1bNEiifI", title: "古の空 ～エルピス：昼～ · Masayoshi Soken" },
  { id: "-a1847hMbnU", title: "月からの祈りと共に · Akino Arai" },
];

let playerState = JSON.parse(localStorage.getItem(STORAGE_KEY) ||
  `{"isPlaying": false, "volume": 50, "currentTime": 0, "currentSongId": "${songs[0].id}", "isMinimized": false}`);

// 플레이어 UI 초기 상태
if (playerState.isMinimized) {
  document.getElementById('mainPlayer').classList.add('hidden');
  document.getElementById('miniPlayer').classList.remove('hidden');
} else {
  document.getElementById('mainPlayer').classList.remove('hidden');
  document.getElementById('miniPlayer').classList.add('hidden');
}

// YouTube API 로드
var tag = document.createElement('script');
tag.src = "https://www.youtube.com/iframe_api";
var firstScriptTag = document.getElementsByTagName('script')[0];
firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

var player;
var progressInterval;

function onYouTubeIframeAPIReady() {
  if (songs.length === 0) return;

  let videoId = playerState.currentSongId;
  if (!songs.some(song => song.id === videoId)) {
    videoId = songs[0].id;
    playerState.currentSongId = videoId;
    savePlayerState();
  }

  player = new YT.Player('player', {
    height: '0',
    width: '0',
    videoId: videoId,
    playerVars: {
      'playsinline': 1,
      'controls': 0,
      'start': Math.floor(playerState.currentTime),
      'autoplay': playerState.isPlaying ? 1 : 0,
      'mute': 0
    },
    events: {
      'onReady': onPlayerReady,
      'onStateChange': onPlayerStateChange
    }
  });
}

function onPlayerReady(event) {
  player.setVolume(playerState.volume);
  document.getElementById('volumeSlider').value = playerState.volume;

  if (playerState.currentSongId) {
    updateSongTitle(playerState.currentSongId);
  }

  if (playerState.isPlaying) {
    player.playVideo();
  }

  document.getElementById('volumeSlider').addEventListener('input', function (e) {
    const volume = parseInt(e.target.value);
    player.setVolume(volume);
    playerState.volume = volume;
    savePlayerState();
  });

  setInterval(savePlayerState, 1000);
  progressInterval = setInterval(updateProgressBar, PROGRESS_UPDATE_INTERVAL);
}

function onPlayerStateChange(event) {
  playerState.isPlaying = event.data === YT.PlayerState.PLAYING;

  if (event.data === YT.PlayerState.ENDED) {
    nextSong();
  }

  if (event.data === YT.PlayerState.PLAYING) {
    if (progressInterval) clearInterval(progressInterval);
    progressInterval = setInterval(updateProgressBar, PROGRESS_UPDATE_INTERVAL);
  } else if (event.data === YT.PlayerState.PAUSED) {
    updateProgressBar();
    if (progressInterval) {
      clearInterval(progressInterval);
      progressInterval = null;
    }
  }

  savePlayerState();
}

function formatTime(seconds) {
  seconds = Math.floor(seconds);
  const minutes = Math.floor(seconds / 60);
  seconds = seconds % 60;
  return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
}

function updateProgressBar() {
  if (!player || !player.getCurrentTime || !player.getDuration) return;

  const currentTime = player.getCurrentTime() || 0;
  const duration = player.getDuration() || 1;
  const progress = (currentTime / duration) * 100;

  document.getElementById('progressFill').style.width = `${progress}%`;
  document.getElementById('progressThumb').style.left = `${progress}%`;
  document.getElementById('currentTime').textContent = formatTime(currentTime);
  document.getElementById('totalTime').textContent = formatTime(duration);
}

function setupProgressBarEvents() {
  const progressBar = document.getElementById('progressBar');

  progressBar.addEventListener('click', function (e) {
    if (!player || !player.getDuration) return;
    const totalDuration = player.getDuration();
    if (!totalDuration) return;

    const rect = this.getBoundingClientRect();
    const pos = (e.clientX - rect.left) / rect.width;
    player.seekTo(pos * totalDuration);
    updateProgressBar();
  });

  let isDragging = false;

  progressBar.addEventListener('mousedown', function () {
    isDragging = true;
  });

  document.addEventListener('mousemove', function (e) {
    if (!isDragging || !player || !player.getDuration) return;
    const totalDuration = player.getDuration();
    if (!totalDuration) return;

    const rect = progressBar.getBoundingClientRect();
    let pos = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));

    document.getElementById('progressFill').style.width = `${pos * 100}%`;
    document.getElementById('progressThumb').style.left = `${pos * 100}%`;
    document.getElementById('currentTime').textContent = formatTime(pos * totalDuration);
  });

  document.addEventListener('mouseup', function (e) {
    if (!isDragging || !player || !player.getDuration) {
      isDragging = false;
      return;
    }
    const totalDuration = player.getDuration();
    if (!totalDuration) { isDragging = false; return; }

    const rect = progressBar.getBoundingClientRect();
    let pos = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    player.seekTo(pos * totalDuration);
    isDragging = false;
    updateProgressBar();
  });

  document.addEventListener('mouseleave', function () {
    isDragging = false;
  });
}

document.addEventListener('DOMContentLoaded', function () {
  setupProgressBarEvents();
});

function savePlayerState() {
  if (player && player.getCurrentTime) {
    playerState.currentTime = player.getCurrentTime();
    playerState.isPlaying = player.getPlayerState() === YT.PlayerState.PLAYING;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(playerState));
  }
}

function playVideo() {
  if (player && player.playVideo) player.playVideo();
}

function pauseVideo() {
  if (player && player.pauseVideo) player.pauseVideo();
}

function updateSongTitle(songId) {
  const song = songs.find(s => s.id === songId);
  document.getElementById('currentSongTitle').textContent = song ? song.title : "알 수 없는 곡";
}

function getCurrentSongIndex() {
  return songs.findIndex(s => s.id === playerState.currentSongId);
}

function playSongById(songId) {
  playerState.currentSongId = songId;
  playerState.currentTime = 0;
  updateSongTitle(songId);

  if (player) {
    player.loadVideoById({ 'videoId': songId, 'startSeconds': 0 });
    player.playVideo();
    playerState.isPlaying = true;

    document.getElementById('progressFill').style.width = '0%';
    document.getElementById('progressThumb').style.left = '0%';
    document.getElementById('currentTime').textContent = '0:00';
  }

  savePlayerState();
}

function prevSong() {
  let idx = getCurrentSongIndex();
  if (idx <= 0) idx = songs.length - 1;
  else idx--;
  playSongById(songs[idx].id);
}

function nextSong() {
  let idx = getCurrentSongIndex();
  if (idx >= songs.length - 1) idx = 0;
  else idx++;
  playSongById(songs[idx].id);
}

function minimizePlayer() {
  document.getElementById('mainPlayer').classList.add('hidden');
  document.getElementById('miniPlayer').classList.remove('hidden');
  playerState.isMinimized = true;
  savePlayerState();
}

function expandPlayer() {
  document.getElementById('mainPlayer').classList.remove('hidden');
  document.getElementById('miniPlayer').classList.add('hidden');
  playerState.isMinimized = false;
  savePlayerState();
}

document.addEventListener('visibilitychange', function () {
  if (document.hidden) {
    if (player && player.getPlayerState) {
      playerState.isPlaying = player.getPlayerState() === YT.PlayerState.PLAYING;
      savePlayerState();
    }
  } else {
    if (playerState.isPlaying && player && player.playVideo) {
      player.playVideo();
    }
  }
});

// =====================
// 시메지
// =====================

const sprites = {
  down: ["https://i.imgur.com/5JH2HqN.png", "https://i.imgur.com/9IpmQaN.png", "https://i.imgur.com/FJh2LPr.png"],
  up: ["https://i.imgur.com/eiulE3a.png", "https://i.imgur.com/dAudV3g.png", "https://i.imgur.com/wHNO6s0.png"],
  left: ["https://i.imgur.com/Rp4MyTo.png", "https://i.imgur.com/dqR3wTc.png", "https://i.imgur.com/sT4sYoE.png"],
  right: ["https://i.imgur.com/gfhylI8.png", "https://i.imgur.com/AvUePs9.png", "https://i.imgur.com/IIzugPg.png"],
  sit: ["https://i.imgur.com/9va1waE.png"],
  sleep: [
    "https://i.imgur.com/X080JsG.png",
    "https://i.imgur.com/xf11w31.png",
    "https://i.imgur.com/DuInk1S.png",
    "https://i.imgur.com/xOfN292.png",
    "https://i.imgur.com/cPNTADo.png"
  ],
  struggle: ["https://i.imgur.com/eSQvjZg.png", "https://i.imgur.com/EjO1hB6.png"],
  fall: ["https://i.imgur.com/nSgLstM.png"]
};

Object.values(sprites).flat().forEach(src => {
  const img = new Image();
  img.src = src;
});

const el = document.getElementById("shimeji");

let x = 100;
let y = 100;

let dir = "right";
let prevDir = "right";
let frame = 0;
let state = "walk";

let dirTimer = 0;
let dragging = false;

let sleepFrame = 0;

let sitFrames = 0;
let dozeTimer = 0;
let dozeDuration = 0;

let turnDelay = 5;

function randomDir() {
  const dirs = ["up", "down", "left", "right"];
  return dirs[Math.floor(Math.random() * 4)];
}

function randomState() {
  if (dragging || state === "fall") return;

  if (state === "walk") {
    dirTimer--;

    if (dirTimer <= 0) {
      dir = randomDir();
      dirTimer = Math.floor(Math.random() * 100) + 50;
    }

    if (Math.random() < 0.01) {
      state = "sit";
      sitFrames = 0;
    }
  } else if (state === "sit") {
    sitFrames++;

    // 8초(67프레임) 이후부터 프레임당 ~3% → 10초까지 약 40% 확률로 졸기 진입
    if (sitFrames >= 67 && Math.random() < 0.03) {
      state = "doze";
      dozeTimer = 0;
      dozeDuration = 83 + Math.floor(Math.random() * 84); // 10~20초
      return;
    }

    // 10초(83프레임) 지나면 다시 걷기
    if (sitFrames >= 83) {
      state = "walk";
    }
  } else if (state === "doze") {
    dozeTimer++;
    if (dozeTimer >= dozeDuration) {
      state = "sleep";
      sleepFrame = 2;
      frame = 0;
    }
  }
  // sleep: 드래그로만 깨어남
}

function move() {
  if (dragging) {
    frame++;
    el.src = sprites.struggle[frame % 2];
    return;
  }

  if (state === "walk") {
    if (dir !== prevDir) {
      frame = 0;
      prevDir = dir;
      turnDelay = 5;
    }

    if (turnDelay > 0) {
      turnDelay--;
      el.src = sprites[dir][0];
      randomState();
      return;
    }

    if (dir === "right") x += 1;
    if (dir === "left") x -= 1;
    if (dir === "down") y += 1;
    if (dir === "up") y -= 1;

    const maxX = window.innerWidth - el.offsetWidth;
    const maxY = window.innerHeight - el.offsetHeight;

    let bounced = false;
    if (x <= 0) { x = 0; dir = "right"; bounced = true; }
    if (x >= maxX) { x = maxX; dir = "left"; bounced = true; }
    if (y <= 0) { y = 0; dir = "down"; bounced = true; }
    if (y >= maxY) { y = maxY; dir = "up"; bounced = true; }

    if (bounced) {
      prevDir = dir;
      turnDelay = 0;
    }

    el.style.left = x + "px";
    el.style.top = y + "px";

    frame++;
    el.src = sprites[dir][frame % 3];
  } else if (state === "sit") {
    el.src = sprites.sit[0];
  } else if (state === "doze") {
    // sleep[0] → [1] 천천히 전환
    const progress = dozeTimer / dozeDuration;
    if (progress < 0.5) {
      el.src = sprites.sleep[0];
    } else {
      el.src = sprites.sleep[1];
    }
  } else if (state === "sleep") {
    frame++;
    if (frame % 5 === 0) {
      sleepFrame++;
      if (sleepFrame >= 5) sleepFrame = 2;
    }
    el.src = sprites.sleep[sleepFrame];
  }

  randomState();
}

let dragOffsetX = 0;
let dragOffsetY = 0;

el.addEventListener('mousedown', (e) => {
  e.preventDefault();
  dragging = true;
  dragOffsetX = e.clientX - x;
  dragOffsetY = e.clientY - y;
  el.style.cursor = "grabbing";
  document.querySelectorAll('iframe').forEach(f => f.style.pointerEvents = 'none');
});

el.addEventListener('dragstart', (e) => e.preventDefault());

window.addEventListener('mouseup', () => {
  if (!dragging) return;

  dragging = false;
  el.style.cursor = "grab";
  document.querySelectorAll('iframe').forEach(f => f.style.pointerEvents = '');

  state = "fall";

  let fallY = y;
  let maxY = window.innerHeight - el.offsetHeight;
  let target = Math.min(y + 200, maxY);

  function falling() {
    fallY += 5;
    if (fallY > maxY) fallY = maxY;
    el.src = sprites.fall[0];
    el.style.top = fallY + "px";

    if (fallY < target) {
      requestAnimationFrame(falling);
    } else {
      y = fallY;
      state = "walk";
    }
  }

  falling();
});

window.addEventListener('mousemove', (e) => {
  if (!dragging) return;

  x = Math.max(0, Math.min(e.clientX - dragOffsetX, window.innerWidth - el.offsetWidth));
  y = Math.max(0, Math.min(e.clientY - dragOffsetY, window.innerHeight - el.offsetHeight));

  el.style.left = x + "px";
  el.style.top = y + "px";
});

setInterval(move, 120);
