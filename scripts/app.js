
/* ========== Global Variables ========== */
// overlay
const overlay = document.getElementById('overlay');
const startButton = document.querySelector('a.btn__reset');
const header = document.querySelector('header');

//Updated Elements
const phraseUl = document.querySelector('#phrase').firstElementChild;
const tries = document.getElementsByClassName('tries');

//Player keyboard
const qwerty = document.querySelector('#qwerty');
const keys = document.querySelectorAll('.keyrow button');

//Game components
let lettersLi = [];
let playerScore = 0;
let missed = 0;
const phrases = ['Hello World', 'Good morning', 'How are you', 'I am fine', 'Dzien dobry'];



/* ========== Element Creation ========== */
/**
* Gemerate an Li element containing the value passed in as textContent
* If a space is passed in create equivalent white space to stop the element collapsing
* @param {string} text value to be used
* @return {element} the completed Li element
*/
function createLi(value) {
	const li = document.createElement('li');
	if (value == ' ') {
		li.style.minWidth = '8px'; // li width collapses with only a space
	} else {
		li.className = 'letter';
		li.textContent = value;
		li.style.transition = ".8s";
		lettersLi.push(li);
	}
	return li;
}

// Generate a new element to be appended to the overlay lettings players know if they won
const victory = document.createElement('p');
victory.style.padding = '0';
victory.style.margin = '0';
victory.style.display = 'none';
overlay.insertBefore(victory, startButton);



/* ========== Core Functions ========== */

/**
* Reset the page ready for a new game. Should be usable when the page loads, and when the game is reset
*/
function resetGame() {

	/**
	* Chose a random phrase from an array of phrases
	* @param {array} list of strings to select from
	* @return {string} selected phrase
	*/
	function getRandomPhraseAsArray(arr) {
		return arr[Math.floor(Math.random() * arr.length-1) + 1];
	}
	
	/**
	* Take the chose phrase, generate the game display as Li's using creatLi() function. Append to #phrase ul
	* Reset the phrase between rounds
	* @param {string} The phrase to be used
	*/	
	function addPhraseToDisplay(arrChars) {
		phraseUl.innerHTML = ''; //reset between rounds
		for (let i = 0; i < arrChars.length ; i++) {
			phraseUl.appendChild(createLi(arrChars[i]));
		}
	}

	// Resets for repeat games
	lettersLi = [];
	victory.style.display = '';
	overlay.style.display = '';
	missed = 0
	for (key in keys) {
		// Reset the keyboard
		keys[key].disabled = false;
		keys[key].style = '';
	}	

	let phraseArray = getRandomPhraseAsArray(phrases);
	addPhraseToDisplay(phraseArray);	
	console.log(phraseArray); // For stuck players!
}


/**
* Check whether the player has won or lost the game when called. Change the class of the overlay, and text of the victorymessage
* accordingly, but no display them.
*/	
function checkWin() {
	if (missed < 5) {
		const showCount = lettersLi.filter(li => li.className === 'letter show').length;		
		if (showCount === lettersLi.length) {
			playerScore += 1;			
			victory.textContent = 'You won! Click below for a new game. Current Score: ' + String(playerScore);	
			overlay.className = 'win';
			resetGame();
		}
	} else {
		overlay.className = 'lose';
		victory.textContent = 'You lost, click below to try again! Current Score: ' + String(playerScore);
		resetGame();
	}	
}



/* ========== Event Listeners ========== */

/**
* Remove the overlay so a new game can begin
*/	
startButton.addEventListener('click', (e) => {	
	overlay.style.display = 'none';
	overlay.className = 'start';
});

/**
* 1. Catch players use of the game keyboard. 
* 2. Check whether the letter is contained in the phrase. 
* 3. Visually reflect whether a key has been used, and disable used keys
*/
qwerty.addEventListener('click', (event) => {
	if (event.target.tagName === 'BUTTON') { 
		const button = event.target;

		/**
		* check if the chose letter is in the target phrase. Update the class of the found letters corresponding Li to 'show'
		* @param {event.target} the key pressed by the player
		* return {boolean} true if the key is in the target phrase, false if not.
		*/
		function checkLetter(buttonPress) {
			buttonPress.disabled = true;
			const letterFound = buttonPress.textContent;
			let found = false;
			for (let i = 0; i<lettersLi.length; i++) {			
				if (lettersLi[i].textContent.toLowerCase() == letterFound) {
					lettersLi[i].className += ' show';
					found = true;
				}
			}
			if (found) {
				return true;
			}
			return false;		
		}		

		if (!checkLetter(button)) {
			tries[missed].style.display = 'none';
			button.style.background = 'darkGrey';
			missed += 1;
		} else {
			button.style.background = 'green';
		}
		button.style.color = 'white';	

		checkWin()
	}
});


resetGame();