console.log("Content script has loaded via Manifest V3.");

const interval = setInterval(myFunction, 1000);

function myFunction() {
  // const headerTitleElement = document.querySelector('.header-title-component');

  const headerStatsGame = document.querySelector('.header-title-component')

  if (headerStatsGame) {
    let elementValue = headerStatsGame.textContent;


    console.log(elementValue); // Output the text content
    if (elementValue == 'You Won!') {
      console.log('Element: You win')
    }

    if (elementValue == 'White Won') {
      console.log('Element: White Won')
    }

    if (elementValue == 'Black Won') {
      console.log('Element: Black Won')
    }

    if (elementValue == 'Game Aborted') {
      console.log('Element: Game Aborted')
      clearInterval(interval);
    }

    /**
     * Black
     * White
     * You Won!
     * Game Aborted
     * 
     * board-modal-header-component game-over-header-component game-over-header-whiteWon game-over-header-isPlaying
     * game-over-modal-content
     * 
     * see a game details : https://www.chess.com/analysis/game/live/101369175178?tab=details-tab
     * '101369175178' this is the id of the game
     * 
     * get username : user-username-component
     */
  } else {
    console.log('Element not found');
  }


}