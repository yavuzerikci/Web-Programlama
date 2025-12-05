const gameContainer = document.getElementById('game-container');
const basket = document.getElementById('basket');
const scoreBoard = document.getElementById('score-board');

let score = 0;
let basketPosition = gameContainer.offsetWidth / 2 - basket.offsetWidth / 2;
basket.style.left = basketPosition + 'px';

document.addEventListener('mousemove', (event) => {
    const gameContainerRect = gameContainer.getBoundingClientRect();
    let newBasketPosition = event.clientX - gameContainerRect.left - basket.offsetWidth / 2;
    if (newBasketPosition < 0) newBasketPosition = 0;
    if (newBasketPosition + basket.offsetWidth > gameContainerRect.width) newBasketPosition = gameContainerRect.width - basket.offsetWidth;
    basket.style.left = newBasketPosition + 'px';
});

function createFallingObject() {
    const fallingObject = document.createElement('div');
    fallingObject.classList.add('falling-object');
    fallingObject.style.left = Math.random() * (gameContainer.offsetWidth - 20) + 'px';
    gameContainer.appendChild(fallingObject);

    let fallingInterval = setInterval(() => {
        let topPosition = parseInt(window.getComputedStyle(fallingObject).getPropertyValue('top'));
        if (topPosition >= gameContainer.offsetHeight - basket.offsetHeight - 20) {
            let basketRect = basket.getBoundingClientRect();
            let fallingObjectRect = fallingObject.getBoundingClientRect();
            if (
                fallingObjectRect.left < basketRect.right &&
                fallingObjectRect.right > basketRect.left &&
                fallingObjectRect.bottom >= basketRect.top &&
                fallingObjectRect.top <= basketRect.bottom
            ) {
                score++;
                scoreBoard.innerText = 'Score: ' + score;
            }
            clearInterval(fallingInterval);
            gameContainer.removeChild(fallingObject);
        } else {
            fallingObject.style.top = topPosition + 5 + 'px';
        }
    }, 50);
}

setInterval(createFallingObject, 1000);
