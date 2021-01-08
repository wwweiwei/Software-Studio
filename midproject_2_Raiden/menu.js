var button_voice;
var button_rank;
var button_helper;
var music;
var menuState = { 
    create: function() {
        // Add a background image 
        game.add.image(0, 0, 'background_1'); 
        // Display the name of the game
        var nameLabel = game.add.text(game.width/2, 150, 'Hungry Birds', 
        { font: '100px Georgia', fill: '#000000' }); 
        nameLabel.anchor.setTo(0.5, 0.5);
        // Show the score at the center of the screen
        //var scoreLabel = game.add.text(game.width/2, game.height/2, 'score: ' + game.global.score, { font: '25px Arial', fill: '#ffffff' }); 
        //scoreLabel.anchor.setTo(0.5, 0.5);
        // Explain how to start the game
        //var startLabel = game.add.text(game.width-50, game.height-80, 'press the up arrow key to start', { font: '25px Arial', fill: '#ffffff' }); startLabel.anchor.setTo(0.5, 0.5);
        // Create a new Phaser keyboard variable: the up arrow key 
        // When pressed, call the 'start'
        //var upKey = game.input.keyboard.addKey(Phaser.Keyboard.UP); 
        //upKey.onDown.add(this.start, this); 

        this.button_rank = game.add.button(game.width-150, 150, 'button_rank', this.checkRank, this, 1, 0, 0);
        this.button_voice = game.add.button(game.width-150, 50, 'button_voice', this.voiceChange, this, 3, 1, 2);
        this.button_start = game.add.button(game.width/2-250, 350, 'button_start', this.actionOnClick, this, 1, 0, 0);
        this.button_helper = game.add.button(game.width-150, 250, 'button_helper', this.helperChange, this, 0
        , 1, 1);

        
        if (game.global.sound == 1){
            music = game.add.audio('music_1');
            music.play();
        }
        


        //this.button_voice.onInputOver.add(over, this);
        //this.button_voice.onInputOut.add(out, this);
        //this.button_voice.onInputUp.add(up, this);

        console.log('create ok');
    }, 
    start: function() {
        // Start the actual game 
        console.log('menu ok');
        game.state.start('play'); 
    },
    actionOnClick: function () {

        game.state.start('play');
    
    },
    voiceChange: function () {
        if (game.global.sound == 1){
            game.global.sound = 0;
            music.stop();
        }
        else{
            game.global.sound = 1;
            music.play();
        }
        console.log('sound:'+game.global.sound);
    },
    checkRank: function() {
        alert('You are the best!!!');
    },
    helperChange: function() {
        if(game.global.littleHelper == 1)
            game.global.littleHelper = 0;
        else
            game.global.littleHelper = 1;
    },
};