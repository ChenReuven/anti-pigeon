// App Config
const config = {
  googleSpreadSheet: {
    useGoogleSpreadSheet: true,
    BASE_URL            : `https://docs.google.com/forms/d/e`,
    BASE_URL_POSTFIX    : `formResponse`,
    FORM_ID             : '1FAIpQLSeczUMWDuYamXY99RXdGzvXDfYlevKN6O2M0t_loVV6KUOX7Q',
    FORM_ENTRY_ID_KEY   : 'entry.1587568766',
    FORM_FVV_KEY        : 'fvv',
    FORM_FVV_VALUE      : 1,
    headers             : {
      'Content-Type': 'application/x-www-form-urlencoded',
    }
  },
  recording        : {
    RECORD_TIME: 5000
  }
}
// https://docs.google.com/forms/d/e/1FAIpQLSdSpDrJpFzGUS5416x3unwghA6CGlzrl2sc2iMSPJnFV3TdlA/formResponse
// entry.519495850

config.FULL_FORM_URL = `${config.googleSpreadSheet.BASE_URL}/${config.googleSpreadSheet.FORM_ID}/${config.googleSpreadSheet.BASE_URL_POSTFIX}`;

// App Init
let isDetectionInProgress = false;
const video               = document.getElementById('video');
const score               = document.getElementById('score');
const body                = document.getElementById('body');
const startBtn            = document.getElementById('start-btn');
const stopBtn             = document.getElementById('stop-btn');
const fullscreenBtn       = document.getElementById('fullscreen-btn');
let fullscreen            = false;
const status              = document.getElementById('status-detection');
let sound                 = null;

// URLS
const DOG_SOUND1_URL    = 'assets/audio/dog-sound-1.mp3';
const DOG_SOUND2_URL    = 'assets/audio/dog-sound-2.wav';
const BIRD_SOUND1_URL   = 'assets/audio/bird-sound-1.wav';
const HAWK_SOUND1_URL   = 'assets/audio/hawk-sound-1.mp3';
const HAWK_SOUND2_URL   = 'assets/audio/hawk-sound-2.wav';
const HAWK_SOUND3_URL   = 'assets/audio/hawk-sound-3.wav';
const HAWK_SOUND4_URL   = 'assets/audio/hawk-sound-4.wav';
const HAWK_SOUND5_URL   = 'assets/audio/hawk-sound-5.mp3';
const ALDER_SOUND1_URL  = 'assets/audio/alder-sound-1.wav';
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

// Form - DB
function saveMovementCaptureSceneToDB(movementScore) {
  const bodyFormData = new FormData();
  bodyFormData.set(config.googleSpreadSheet.FORM_ENTRY_ID_KEY, movementScore);
  bodyFormData.set(config.googleSpreadSheet.FORM_FVV_KEY, config.googleSpreadSheet.FORM_FVV_VALUE);
  return axios.post(
    config.FULL_FORM_URL,
    bodyFormData, {
      headers: config.googleSpreadSheet.headers
    }
  );
}

// Record And Download Video

function startRecording() {
  // here we will save all video data
  const chunks = [];
  const rec    = new MediaRecorder(video.srcObject);

  // this event contains our data
  rec.ondataavailable = e => chunks.push(e.data);

  // when done, concatenate our chunks in a single Blob
  rec.onstop = e => download(new Blob(chunks));
  rec.start();

  function stopRecording() {
    rec.stop();
  }

  setTimeout(function () {
    stopRecording();
  }, config.recording.RECORD_TIME);
}

function download(blob) {
  // uses the <a download> to download a Blob
  let a             = document.createElement('a');
  let recordingTime = new Date().toLocaleString();
  a.href            = URL.createObjectURL(blob);
  a.download        = `anti-pigeon---${recordingTime}.webm`;
  document.body.appendChild(a);
  a.click();
}


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
  }, 7000);
}

let getRandomVoice = function () {
  return antiPigeonsVoices[Math.floor(Math.random() * antiPigeonsVoices.length)];
};

function capture(payload) {
  score.textContent = payload.score;
  const scoreResult = payload.score;
  console.log('sliderValue = ', sliderValue);
  if (scoreResult > sliderValue) {
    if (!sound) {
      sound = new Howl({
        src: [DOG_SOUND1_URL]
      });
    }
    if (!isSoundPlaying(sound) && !isDetectionInProgress) {
      isDetectionInProgress = true;
      const item            = getRandomVoice();
      sound                 = new Howl({
        src: [item]
      });
      sound.play();
      flickeringScreen();
      saveMovementCaptureSceneToDB(scoreResult);
      startRecording();

      setTimeout(function () {
        isDetectionInProgress = false;
      }, 6000)
    }
  }
}

DiffCamEngine.init({
  video              : video,
  initSuccessCallback: initSuccess,
  initErrorCallback  : initError,
  captureCallback    : capture
});
