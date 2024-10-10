let balance = 100;
let countdown = 30;
let selectedBetType = null;
let selectedBetAmount = 0;
let betPlaced = false;

const countdownTimer = document.getElementById('countdown-timer');
const balanceElement = document.getElementById('balance');
const betPopup = document.getElementById('bet-popup');
const notification = document.getElementById('notification');

// Switch between Game History and User History
document.getElementById('game-history-tab').addEventListener('click', function() {
    document.getElementById('game-history').classList.add('history-active');
    document.getElementById('user-history').classList.remove('history-active');
});

document.getElementById('your-history-tab').addEventListener('click', function() {
    document.getElementById('user-history').classList.add('history-active');
    document.getElementById('game-history').classList.remove('history-active');
});

// Bet selection
document.getElementById('big-btn').addEventListener('click', () => openBetPopup('Big'));
document.getElementById('small-btn').addEventListener('click', () => openBetPopup('Small'));

function openBetPopup(betType) {
    selectedBetType = betType;
    betPopup.style.display = 'flex';
}

// Bet amount selection
document.querySelectorAll('.amount-btn').forEach(button => {
    button.addEventListener('click', () => {
        selectedBetAmount = parseInt(button.getAttribute('data-amount'));
        betPlaced = true;
        betPopup.style.display = 'none';
    });
});

function displayNotification(message, isSuccess) {
    notification.style.backgroundColor = isSuccess ? 'green' : 'red';
    notification.textContent = message;
    notification.style.display = 'block';
    setTimeout(() => {
        notification.style.display = 'none';
    }, 3000);
}

// Countdown logic with bet result
setInterval(() => {
    countdown--;
    countdownTimer.textContent = countdown;

    if (countdown <= 0) {
        if (betPlaced) {
            generateResult();
        }
        countdown = 30;
    }
}, 1000);

function generateResult() {
    let randomNumber = Math.floor(Math.random() * 10);
    let result = (randomNumber <= 4) ? 'Small' : 'Big';
    let resultText = `Number: ${randomNumber}, Result: ${result}`;
    
    // Add to game history
    updateHistory(true, resultText);
    
    // Check bet and update user history
    let userResult = `Your Bet: ${selectedBetType}, Number: ${randomNumber}, Result: ${result}`;
    
    if (selectedBetType === result) {
        balance += selectedBetAmount * 2;
        userResult += ` - Win!`;
        displayNotification("You won!", true);
    } else {
        balance -= selectedBetAmount;
        userResult += ` - Loss!`;
        displayNotification("You lost!", false);
    }
    
    updateHistory(false, userResult);
    balanceElement.textContent = balance;
    betPlaced = false;
}

// Add entries to game history or user history
function updateHistory(isGameHistory, entry) {
    let historyBox = isGameHistory ? document.getElementById('game-history') : document.getElementById('user-history');
    historyBox.innerHTML = `<p>${entry}</p>` + historyBox.innerHTML;
}

// Wallet options
document.getElementById('add-money').addEventListener('click', () => {
    balance += 100;
    balanceElement.textContent = balance;
});

document.getElementById('withdraw-money').addEventListener('click', () => {
    if (balance >= 50) {
        balance -= 50;
        balanceElement.textContent = balance;
    } else {
        displayNotification("Insufficient balance!", false);