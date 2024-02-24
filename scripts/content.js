console.log("Content script has loaded via Manifest V3.");

function myFunction() {
    console.log("Hello World!");
        // Use querySelector to find the element
        const headerTitleElement = document.querySelector('.header-title-component');
      
        // Make sure the element exists
        if (headerTitleElement) {
          let elementValue = headerTitleElement.textContent;
          console.log(elementValue); // Output the text content
          if(elementValue == 'You Won!'){
            console.log('Element: You win')
          }

          if(elementValue == 'White Won'){
            console.log('Element: White Won')
          }

          if(elementValue == 'Black Won'){
            console.log('Element: White Won')
          }

          if(elementValue == 'Game Aborted'){
            console.log('Element: Game Aborted')
          }
          /**
           * Black
           * White
           * You Won!
           * Game Aborted
           */
        } else {
          console.log('Element not found');
        }

}

setInterval(myFunction, 1000);