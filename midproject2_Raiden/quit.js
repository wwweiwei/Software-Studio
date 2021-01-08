var levelString = '';
var levelText;
var quitState = { 
    create: function() {

        if(game.global.win == 1){
            game.add.image(0, 0, 'background_3'); 
            if (game.global.level == 3){
                  
                var nameLabel = game.add.text(game.width/2-280, 80, 'Congrats!', 
                { font: '80px Georgia', fill: '#000000' }); 
                nameLabel.anchor.setTo(0.5, 0.5);
                //var scoreLabel = game.add.text(game.width/2, game.height/2, 'score: ' + game.global.score, { font: '25px Arial', fill: '#ffffff' }); 
                //scoreLabel.anchor.setTo(0.5, 0.5);
                scoreString = 'Score : ';
                scoreText = game.add.text(80, game.height/2-150, scoreString + game.global.score, {  font: '36px Georgia', fill: '#000' });

            }
            else{

                game.global.level += 1;
                var nameLabel = game.add.text(game.width/2-280, 80, 'You won', 
                { font: '80px Georgia', fill: '#000000' }); 
                nameLabel.anchor.setTo(0.5, 0.5);
                //var scoreLabel = game.add.text(game.width/2, game.height/2, 'score: ' + game.global.score, { font: '25px Arial', fill: '#ffffff' }); 
                //scoreLabel.anchor.setTo(0.5, 0.5);

                //  The score
                scoreString = 'Score : ';
                scoreText = game.add.text(80, game.height/2-150, scoreString + game.global.score, {  font: '36px Georgia', fill: '#000' });

                //  The level
                levelString = 'Level : ';
                levelText = game.add.text(80, game.height/2-200, levelString + game.global.level, { font: '36px Georgia', fill: '#000' });

                game.global.reset = 1;
                game.global.win = 0;
                this.button_next = game.add.button(game.width/2 + 50, 300, 'button_next', this.clickNext, this, 0, 0, 0);
                
            }

            
        }
        else{
            game.add.image(0, 0, 'background_2'); 
            var nameLabel = game.add.text(game.width/2-280, 80, 'You lose', 
            { font: '80px Georgia', fill: '#000000' }); 
            nameLabel.anchor.setTo(0.5, 0.5);
            //var scoreLabel = game.add.text(game.width/2, game.height/2, 'score: ' + game.global.score, { font: '25px Arial', fill: '#ffffff' }); 
            //scoreLabel.anchor.setTo(0.5, 0.5);

            //  The score
            scoreString = 'Score : ';
            scoreText = game.add.text(80, game.height/2-150, scoreString + game.global.score, {  font: '36px Georgia', fill: '#000' });

            //  The level
            levelString = 'Level : ';
            levelText = game.add.text(80, game.height/2-200, levelString + game.global.level, { font: '36px Georgia', fill: '#000' });

            game.global.reset = 1;
            this.button_restart = game.add.button(game.width/2-100, 300, 'button_restart', this.clickRestart, this, 0, 0, 0);

        }

        
        // Explain how to start the game
        //var startLabel = game.add.text(game.width-50, game.height-80, 'press the up arrow key to start', { font: '25px Arial', fill: '#ffffff' }); startLabel.anchor.setTo(0.5, 0.5);
        // Create a new Phaser keyboard variable: the up arrow key 
        // When pressed, call the 'start'
        //var upKey = game.input.keyboard.addKey(Phaser.Keyboard.UP); 
        //upKey.onDown.add(this.start, this); 

        this.button_voice = game.add.button(680, 30, 'button_voice', this.voiceChange, this, 3, 1, 2);


        //this.button_voice.onInputOver.add(over, this);
        //this.button_voice.onInputOut.add(out, this);
        //this.button_voice.onInputUp.add(up, this);

        console.log('create ok');
    }, 
    start: function() {
        // Start the actual game 
        console.log('menu ok');
        //game.state.start('play'); 
    },
    clickNext: function () {

        game.state.start('play');
    
    },
    clickRestart: function () {

        //var postsRef = firebase.database().ref('score_list');
        //postsRef.push({ score:game.global.score });

        game.global.score = 0;
        game.global.level = 1;

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
    
    }


};