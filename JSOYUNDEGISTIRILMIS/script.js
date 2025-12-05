const gameContainer = document.getElementById('game-container');
const frog = document.getElementById('frog'); // kale
const scoreBoard = document.getElementById('score-board');
const eatSound = document.getElementById('eat-sound');

let score = 0;

// Kaleyi başlangıçta ortala
function centerFrog() {
  const containerWidth = gameContainer.offsetWidth;
  const frogWidth = frog.offsetWidth;
  const pos = containerWidth / 2 - frogWidth / 2;
  frog.style.left = pos + 'px';
}
centerFrog();

// Fare ile kaleyi sola–sağa hareket ettir
document.addEventListener('mousemove', (event) => {
  const rect = gameContainer.getBoundingClientRect();
  let newPos = event.clientX - rect.left - frog.offsetWidth / 2;

  if (newPos < 0) newPos = 0;
  if (newPos + frog.offsetWidth > rect.width) {
    newPos = rect.width - frog.offsetWidth;
  }

  frog.style.left = newPos + 'px';
});

// Skoru güncelle
function updateScore() {
  score += 2; // her top 2 puan
  scoreBoard.innerText = 'Skor: ' + score;

  if (score < 10) scoreBoard.style.color = '#ffeb3b';
  else if (score < 20) scoreBoard.style.color = '#ff9800';
  else scoreBoard.style.color = '#ff5722';
}

// Top üret
function createFly() {
  const fly = document.createElement('div');
  fly.classList.add('falling-object');
  fly.style.left = Math.random() * (gameContainer.offsetWidth - 28) + 'px';
  fly.style.top = '0px';
  gameContainer.appendChild(fly);

  const fallSpeed = 5;
  const interval = 50;

  let fallingInterval = setInterval(() => {
    let topPosition = parseInt(getComputedStyle(fly).top || '0', 10);
    const containerHeight = gameContainer.offsetHeight;

    if (topPosition >= containerHeight - frog.offsetHeight - 25) {
      const frogRect = frog.getBoundingClientRect();
      const flyRect = fly.getBoundingClientRect();

      const hit =
        flyRect.left < frogRect.right &&
        flyRect.right > frogRect.left &&
        flyRect.bottom >= frogRect.top &&
        flyRect.top <= frogRect.bottom;

      if (hit) {
        updateScore();
        if (eatSound) {
          eatSound.currentTime = 0;
          eatSound.play().catch(() => {});
        }
      }

      clearInterval(fallingInterval);
      gameContainer.removeChild(fly);
    } else {
      fly.style.top = topPosition + fallSpeed + 'px';
    }
  }, interval);
}

// Düzenli aralıklarla top düşür
setInterval(createFly, 900);
