var bootState = {
    preload: function() {
        // Load the progress bar image
        game.load.image('progressBar','./assets/progressBar.png');
    },
    create: function() {
        // Set some game settings
        game.stage.backgroundColor = '#ffffff';
        game.physics.startSystem(Phaser.Physics.ARCADE);
        game.renderer.renderSession.roundPixels = true;
        // Start the load state
        console.log('boot ok');
        game.state.start('load');
    }
};