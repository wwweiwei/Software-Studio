// Initialize Phaser
var game = new Phaser.Game(1000,750, Phaser.AUTO, 'canvas'); // Define our global variable
game.global = { score: 0 , level: 1 , win: 0, littleHelper: 0, sound: 1, reset:1}; 
// Add all the states
game.state.add('boot', bootState);
game.state.add('load', loadState);
game.state.add('menu', menuState);
game.state.add('play', playState);
game.state.add('quit', quitState);
// Start the 'boot' state
game.state.start('boot');

