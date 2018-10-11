// App Init
const video = document.getElementById('video');
const score = document.getElementById('score');
const body = document.getElementById('body');
const startBtn = document.getElementById('start-btn');
const stopBtn = document.getElementById('stop-btn');
const fullscreenBtn = document.getElementById('fullscreen-btn');
let fullscreen = false;
const status = document.getElementById('status-detection');
const sound = new Howl({
	src: ['assets/sound-dog.mp3']
});

// Slider
const slider = document.getElementById("myRange");
const output = document.getElementById("demo");
let { value: sliderValue } = slider;
output.innerHTML = sliderValue;
slider.oninput = function () {
	output.innerHTML = this.value;
	sliderValue = this.value;
}

// Buttons
startBtn.addEventListener('click', function() {
	DiffCamEngine.start();
  status.innerText = 'Playing';
});

stopBtn.addEventListener('click', function() {
	DiffCamEngine.stop();
  status.innerText = 'Stopping';
});

fullscreenBtn.addEventListener('click', function() {
  fullscreen = !fullscreen;
  if(fullscreen){
    fullscreenBtn.textContent = 'Exit Full Screen';
    document.documentElement.webkitRequestFullScreen();
	} else{
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
	const tt = setInterval(function () { startTime() }, 200);
	setTimeout(function () { clearInterval(tt); body.classList.remove('red') }, 10000);
}

function capture(payload) {
	score.textContent = payload.score;
	const scoreResult = payload.score;
	console.log('sliderValue = ', sliderValue);
	if (scoreResult > sliderValue) {
		if (!isSoundPlaying(sound)) {
			sound.play();
			flickeringScreen();
		}
	}
}

DiffCamEngine.init({
	video: video,
	initSuccessCallback: initSuccess,
	initErrorCallback: initError,
	captureCallback: capture
});
