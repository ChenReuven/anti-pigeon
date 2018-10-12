// App Init
const video         = document.getElementById('video');
const score         = document.getElementById('score');
const body          = document.getElementById('body');
const startBtn      = document.getElementById('start-btn');
const stopBtn       = document.getElementById('stop-btn');
const fullscreenBtn = document.getElementById('fullscreen-btn');
let fullscreen      = false;
const status        = document.getElementById('status-detection');
let sound = null;

// URLS
const DOG_SOUND1_URL    = 'assets/audio/dog-sound-1.mp3';
const DOG_SOUND2_URL    = 'assets/audio/dog-sound-2.wav';
const BIRD_SOUND1_URL   = 'assets/audio/bird-sound-1.wav';
const HAWK_SOUND1_URL   = 'assets/audio/hawk-sound-1.mp3';
const HAWK_SOUND2_URL   = 'assets/audio/hawk-sound-2.wav';
const HAWK_SOUND3_URL   = 'assets/audio/hawk-sound-3.wav';
const HAWK_SOUND4_URL   = 'assets/audio/hawk-sound-4.wav';
const HAWK_SOUND5_URL   = 'assets/audio/hawk-sound-5.mp3';
const ALDER_SOUND1_URL   = 'assets/audio/alder-sound-1.wav';
const antiPigeonsVoices = [
  DOG_SOUND1_URL,
  DOG_SOUND2_URL,
  BIRD_SOUND1_URL,
  HAWK_SOUND1_URL,
  HAWK_SOUND2_URL,
  HAWK_SOUND3_URL,
  HAWK_SOUND4_URL,
  HAWK_SOUND5_URL,
  ALDER_SOUND1_URL
];

// Slider
const slider             = document.getElementById("myRange");
const output             = document.getElementById("demo");
let {value: sliderValue} = slider;
output.innerHTML         = sliderValue;
slider.oninput           = function () {
  output.innerHTML = this.value;
  sliderValue      = this.value;
}

// Buttons
startBtn.addEventListener('click', function () {
  DiffCamEngine.start();
  status.innerText = 'Playing';
});

stopBtn.addEventListener('click', function () {
  DiffCamEngine.stop();
  status.innerText = 'Stopping';
});

fullscreenBtn.addEventListener('click', function () {
  fullscreen = !fullscreen;
  if (fullscreen) {
    fullscreenBtn.textContent = 'Exit Full Screen';
    document.documentElement.webkitRequestFullScreen();
  } else {
    fullscreenBtn.textContent = 'Full Screen';
    document.webkitExitFullscreen();
  }
});

// Diff Cam
function initSuccess() {
}

function initError(e) {
  alert('Something went wrong.');
  console.log("Init error:" + e);
}

function isSoundPlaying(sound) {
  return sound.playing();
}

function startTime() {
  body.classList.toggle('red');
}

function flickeringScreen() {
  const tt = setInterval(function () {
    startTime()
  }, 200);
  setTimeout(function () {
    clearInterval(tt);
    body.classList.remove('red')
  }, 10000);
}

let getRandomVoice = function () {
  return antiPigeonsVoices[Math.floor(Math.random() * antiPigeonsVoices.length)];
};

function capture(payload) {
  score.textContent = payload.score;
  const scoreResult = payload.score;
  console.log('sliderValue = ', sliderValue);
  if (scoreResult > sliderValue) {
    if(!sound){
      sound = new Howl({
        src: [DOG_SOUND1_URL]
      });
    }
    if (!isSoundPlaying(sound)) {
      const item = getRandomVoice();
      sound      = new Howl({
        src: [item]
      });
      sound.play();
      flickeringScreen();
    }
  }
}

DiffCamEngine.init({
  video              : video,
  initSuccessCallback: initSuccess,
  initErrorCallback  : initError,
  captureCallback    : capture
});
