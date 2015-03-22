Installing and running Frogger

Frogger is a simple arcade style game to be run in a browser.
It features a single screen consisting of three parts, a strip of water, a 3 lane street and a piece of grass.  
It is now the objective of the hero (here called the player) to cross the road to the water. 
The tricky part is the road where there may bugs. 
If the player is able to cross the road and reach the water he is a winner. If the bugs get him he is not.
  
The game will restart automatically but may also be restarted by using the browser refresh button,

Frogger is contain in a directory structure with the following structure:
Frogger/
Frogger/ index.html
Frogger/ css
Frogger/images
Frogger/js

Run Frogger by double clicking on index.html or open index.html in a browser. The game starts automatically. 
The player – which is positioned in the bottom of the screen may be moved around by using the arrow keys. 
The aim of the game is to reach the water so the player should be moved in that direction. Once the player enters the road the mayhem begin. 
The bugs are coming. Once the player has reached safety or been slaughtered by the bugs the game restarts.

Frogger is installed by copying the Frogger directory to the place of your choice from either  a zip file or from a Github repository.

Frogger has been tested with the Chrome, Firefox, Internet Explorer and Safari browsers.
It failed initially with Firefox and Internet explorer due to js variables wre found undefined. 
Frogger now runs under these browsers after changing the order in which various js files was included.

Copenhagen, March 22, 2015.