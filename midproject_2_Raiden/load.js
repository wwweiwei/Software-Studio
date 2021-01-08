var loadState = { 
    preload: function () {
        // Add a 'loading...' label on the screen
        var loadingLabel = game.add.text(game.width/2, 150, 'loading...', { font: '30px Arial', fill: '#ffffff' });
        loadingLabel.anchor.setTo(0.5, 0.5);
        // Display the progress bar
        var progressBar = game.add.sprite(game.width/2, 200, 'progressBar'); 
        progressBar.anchor.setTo(0.5, 0.5);
        game.load.setPreloadSprite(progressBar);
        // Load all game assets
        
        game.load.image('bullet', './assets/bullet_3.png');
        game.load.image('enemyBullet', './assets/bullet_2.png');
        game.load.spritesheet('invader', './assets/enemy_1.png', 49, 55);
        game.load.spritesheet('invader2', './assets/enemy_2.png', 49, 56);
        game.load.spritesheet('boss', './assets/bat.png', 275, 137);
        game.load.spritesheet('ship', './assets/bird2.png',72,50);
        game.load.spritesheet('helper', './assets/helper.png',76,76);
        game.load.spritesheet('kaboom', './assets/explode.png', 128, 128);
        game.load.spritesheet('explosion_2', './assets/explosion_1.png', 146,157);
        game.load.image('starfield', './assets/background_2.jpg');
        //game.load.image('background', './invaders/background_2.png');
        game.load.spritesheet('heart', './assets/heart.png',90,54);
        game.load.image('background_1', './assets/background.jpg');
        game.load.image('background_2', './assets/background_3.jpg');
        game.load.image('background_3', './assets/background_4.jpg');
        game.load.image('pixel', './assets/pixel.png');

        game.load.spritesheet('button_voice', 'assets/button_voice_all.png', 71, 74);
        game.load.spritesheet('button_rank', 'assets/button_rank.png', 77, 74);
        game.load.spritesheet('button_start', 'assets/button_start_2.png', 544, 185);
        game.load.spritesheet('button_next', 'assets/button_next.png', 236, 236);
        game.load.spritesheet('button_restart', 'assets/button_restart.png', 260, 260);
        game.load.spritesheet('button_helper', 'assets/button_helper.png', 90, 82);

        game.load.audio('music_1', ['assets/music_1.mp3', 'assets/music_1.ogg']);
        game.load.audio('explosion_1', ['assets/enemy-fire.mp3', 'assets/enemy-fire.ogg']);
        game.load.audio('explosion_2', ['assets/explosion.mp3', 'assets/explosion.ogg']);

        game.load.spritesheet('button', './assets/quit.png', 193, 71);
        // Load a new asset that we will use in the menu state game.load.image('background', 'assets/background.png');
    },
    create: function() {
        // Go to the menu state 
        console.log('load ok');
        game.state.start('menu');
    } 
};