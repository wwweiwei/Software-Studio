var player;
var helper;
var aliens;
var aliens_2;
var boss;
var bullets;
var helper_bullets;
var bulletTime = 0;
var bulletTime1 = 0;
var cursors;
var fireButton;
var explosions;
var explosions_2;

var starfield;
//var score = 0;
var scoreString = '';
var scoreText;
var lives;
var enemyBullet;
var firingTimer = 0;
var stateText;
var quitButton;
var livingEnemies = [];
var levelString = '';
var levelText;
var sound_1;
var sound_2;
var boss_live = 20;
var emitter;

var playState = {
    preload: function () {

    },


    create: function () {

        //  The scrolling starfield background
        starfield = game.add.tileSprite(0, 0, 1000, 750, 'starfield');

        sound_1 = game.add.audio('explosion_1');
        sound_2 = game.add.audio('explosion_2');

        //  Our bullet group
        bullets = game.add.group();
        bullets.enableBody = true;
        bullets.physicsBodyType = Phaser.Physics.ARCADE;
        bullets.createMultiple(30, 'bullet');
        bullets.setAll('hasOverlapped',false);
        bullets.setAll('anchor.x', 0.5);
        bullets.setAll('anchor.y', 1);
        bullets.setAll('outOfBoundsKill', true);
        bullets.setAll('checkWorldBounds', true);
        bullets.setAll('name', 1);


        if(game.global.littleHelper == 1){
            //  Our helper bullet group
            helper_bullets = game.add.group();
            helper_bullets.enableBody = true;
            helper_bullets.physicsBodyType = Phaser.Physics.ARCADE;
            helper_bullets.createMultiple(30, 'bullet');
            helper_bullets.setAll('hasOverlapped',false);
            helper_bullets.setAll('anchor.x', 0.5);
            helper_bullets.setAll('anchor.y', 1);
            helper_bullets.setAll('outOfBoundsKill', true);
            helper_bullets.setAll('checkWorldBounds', true);
            helper_bullets.setAll('name', 1);
        }
        


        // The enemy's bullets
        enemyBullets = game.add.group();
        enemyBullets.enableBody = true;
        enemyBullets.physicsBodyType = Phaser.Physics.ARCADE;
        enemyBullets.createMultiple(30, 'enemyBullet');
        enemyBullets.setAll('anchor.x', 0.5);
        enemyBullets.setAll('anchor.y', 1);
        enemyBullets.setAll('outOfBoundsKill', true);
        enemyBullets.setAll('checkWorldBounds', true);

        // Create player object
        player = game.add.sprite(200, 500, 'ship');
        // Create the 'right' animation by looping the frames 1 and 2 
        player.animations.add('fly', [1, 2, 3, 4], 8, true);
        player.anchor.setTo(0.5, 0.5);
        game.physics.enable(player, Phaser.Physics.ARCADE);
        player.body.collideWorldBounds = true;

        if (game.global.littleHelper == 1){
            // Create player object
            helper = game.add.sprite(200, 600, 'helper');
            // Create the 'right' animation by looping the frames 1 and 2 
            helper.animations.add('helper_fly', [1, 2, 3, 4, 5, 6, 7], 10, true);
            helper.anchor.setTo(0.5, 0.5);
            game.physics.enable(helper, Phaser.Physics.ARCADE);
        }
        

        if (game.global.level == 1){
            //  The baddies!
            aliens = game.add.group();
            aliens.enableBody = true;
            aliens.physicsBodyType = Phaser.Physics.ARCADE;
            this.createAliens();

        }else if (game.global.level >= 3){
            boss = game.add.sprite(800, 500 ,'boss');
            boss.animations.add('bat_fly', [1, 2, 3, 4, 5,6], 6, true);
            boss.anchor.setTo(0.5, 0.5);
            game.physics.enable(boss, Phaser.Physics.ARCADE);
            boss.animations.play('bat_fly');
            boss.body.velocity.y = 300;
        }else {
            aliens_2 = game.add.group();
            aliens_2.enableBody = true;
            aliens_2.physicsBodyType = Phaser.Physics.ARCADE;
            this.createAliens_2();

        }
        

        //  The score
        scoreString = 'Score : ';
        scoreText = game.add.text(10, 40, scoreString + game.global.score, {  font: '28px Georgia', fill: '#fff' });

        //  The level
        levelString = 'Level : ';
        levelText = game.add.text(10, 10, levelString + game.global.level, { font: '28px Georgia', fill: '#fff' });

        //  Lives
        lives = game.add.group();
        game.add.text(game.world.width - 350, 30, 'Lives : ', { font: '32px Georgia', fill: '#fff' });

        for (var i = 0; i < 3; i++) 
        {
            var heart = lives.create(game.world.width - 200 + (70 * i), 60, 'heart');
            heart.anchor.setTo(0.5, 0.5);
            //heart.angle = 90;
            heart.alpha = 0.8;

        }

        if(game.global.level == 1){
             //  An explosion pool
            explosions = game.add.group();
            explosions.createMultiple(30, 'kaboom');
            explosions.forEach(this.setupInvader, this);
        }else if(game.global.level == 2){
            //  An explosion pool
            explosions_2 = game.add.group();
            explosions_2.createMultiple(30, 'explosion_2');
            explosions_2.forEach(this.setupInvader_2, this);
        }

       //  And some controls to play the game with
        cursors = game.input.keyboard.createCursorKeys();
        fireButton = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);


        //  Being mp3 files these take time to decode, so we can't play them instantly
        //  Using setDecodedCallback we can be notified when they're ALL ready for use.
        //  The audio files could decode in ANY order, we can never be sure which it'll be.

        game.sound.setDecodedCallback([ sound_1, sound_2 ], this.enemyFires, this);

        this.emitter = game.add.emitter(0, 0, 15);
        this.emitter.makeParticles('pixel');
        this.emitter.setYSpeed(-150, 150);
        this.emitter.setXSpeed(-150, 150);
        // Scale the particles from 2 time their size to 0 in 800ms // Parameters are: startX, endX, startY, endY, duration 
        this.emitter.setScale(2, 0, 2, 0, 800);
        // Use no gravity
        this.emitter.gravity = 0;
        
        
    },
    update: function () {

        //  Scroll the background
        starfield.tilePosition.x -= 5;

        if (player.alive && game.global.reset == 1)
        {
            //  Reset the player, then check for movement keys
            player.body.velocity.setTo(0, 0);

            if (cursors.left.isDown)
            {
                player.body.velocity.x = -200;
                player.animations.play('fly');
                if (game.global.littleHelper == 1)
                    helper.animations.play('helper_fly');
            }
            else if (cursors.right.isDown)
            {
                player.body.velocity.x = 200;
                player.animations.play('fly');
                if (game.global.littleHelper == 1)
                    helper.animations.play('helper_fly');
            }
            else if (cursors.up.isDown)
            {
                player.body.velocity.y = -200;
                player.animations.play('fly');
                if (game.global.littleHelper == 1)
                    helper.animations.play('helper_fly');
            }
            else if (cursors.down.isDown)
            {
                player.body.velocity.y = 200;
                player.animations.play('fly');
                if (game.global.littleHelper == 1)
                    helper.animations.play('helper_fly');
            }

            //  Firing?
            if (fireButton.isDown)
            {
                this.fireBullet();
                this.fireBullet_h();
                
            }

            if (game.time.now > firingTimer)
            {
                this.enemyFires();
            }
            if(game.global.littleHelper == 1){
                helper.x = player.x;
                helper.y = player.y + 50;
            }
            
            if (game.global.littleHelper == 1){
                if(game.global.level == 1)
                    game.physics.arcade.overlap(helper_bullets, aliens, this.collisionHandler_h, null, this);
                if(game.global.level == 2)
                    game.physics.arcade.overlap(helper_bullets, aliens_2, this.collisionHandler_2_h, null, this);
                if(game.global.level == 3)
                    game.physics.arcade.overlap(helper_bullets, boss, this.collisionHandler_3_h, null, this);                

     
            }
                //  Run collision
            if (game.global.level == 1){
                game.physics.arcade.overlap(bullets, aliens, this.collisionHandler, null, this);
                game.physics.arcade.overlap(enemyBullets, player, this.enemyHitsPlayer, null, this);
                game.physics.arcade.overlap(player, aliens, this.enemyHitsPlayer_1, null, this);
            }
            else if (game.global.level == 2){
                game.physics.arcade.overlap(player, aliens_2, this.enemyHitsPlayer_2, null, this);
                game.physics.arcade.overlap(bullets, aliens_2, this.collisionHandler_2, null, this); 
            }
            else if (game.global.level == 3){
                //boss.body.velocity.y = 300;
                if (boss.body.y > 600){
                    boss.body.velocity.y = -300;
                } else if (boss.body.y < 20){
                    boss.body.velocity.y = 300;
                }
                game.physics.arcade.overlap(bullets, boss, this.collisionHandler_3, null, this);            
            }
               
        }
        

    },

    createAliens: function () {

        for (var y = 0; y < 10; y++)
        {
            for (var x = 0; x < 4; x++)
            {
                var alien = aliens.create(x * 48, y * 50, 'invader');
                alien.anchor.setTo(0.5, 0.5);
                alien.animations.add('fly', [ 0, 1, 2, 3,4,5,6,7 ], 20, true);
                alien.play('fly');
                alien.body.moves = false;
                alien.hasOverlapped = 0;
            }
        }

        aliens.x = game.width-250;
        aliens.y = 150;

        //  All this does is basically start the invaders moving. Notice we're moving the Group they belong to, rather than the invaders directly.
        var tween = game.add.tween(aliens).to( { y: 200 }, 2000, Phaser.Easing.Linear.None, true, 0, 1000, true);

        //  When the tween loops it calls descend
        tween.onLoop.add(this.descend, this);
    },

    createAliens_2: function (){
        for (var y = 0; y < 20; y++)
            {
                for (var x = 0; x < 10; x++)
                {
                    var alien_2 = aliens_2.create(game.width-100 + x * 48, 100+y * 50, 'invader2');
                    alien_2.anchor.setTo(0.5, 0.5);
                    alien_2.animations.add('fly', [ 0, 1, 2, 3,4,5,6,7 ], 20, true);
                    alien_2.play('fly');
                    alien_2.name = 'alien_2' + x.toString() + y.toString();
                    alien_2.checkWorldBounds = true;
                    alien_2.events.onOutOfBounds.add(this.alienOut, this);
                    alien_2.body.velocity.x = -50 - Math.random() * 100;

                    alien_2.hasOverlapped = 0;
                }
            }

    },

    alienOut:function (alien_2) {

        //  Move the alien to the top of the screen again
        alien_2.reset(game.width, alien_2.y);
    
        //  And give it a new random velocity
        alien_2.body.velocity.x = -50 - Math.random() * 100;
    
    },

    setupInvader: function (invader) {

        invader.anchor.x = 0.5;
        invader.anchor.y = 0.5;
        invader.animations.add('kaboom');

    },
    setupInvader_2: function (invader2) {

        invader2.anchor.x = 0.5;
        invader2.anchor.y = 0.5;
        invader2.animations.add('explosion_2');

    },


    descend: function () {

        aliens.y += 10;

    },

    render: function () {

        // for (var i = 0; i < aliens.length; i++)
        // {
        //     game.debug.body(aliens.children[i]);
        // }

    },

    collisionHandler: function  (bullet, alien) {

        //  When a bullet hits an alien we kill them both
        

        this.emitter.x = bullet.x;
        this.emitter.y = bullet.y;
        this.emitter.start(true, 800, null, 15);
        bullet.kill();
        alien.kill();


        //  Increase the score
        game.global.score += 20;
        scoreText.text = scoreString + game.global.score;

        //  And create an explosion 
        if (game.global.level == 1){
            var explosion = explosions.getFirstExists(false);
            explosion.reset(alien.body.x, alien.body.y);
            explosion.play('kaboom', 30, false, true);
        }
        

        if (aliens.countLiving() == 0)
        {

            console.log('win');
            //this.player.kill();

            //game.global.level += 1;
            //levelText.text = levelString + game.global.level;

            game.global.score += 1000;
            scoreText.text = scoreString + game.global.score;

            enemyBullets.callAll('kill',this);
            game.global.win = 1;

            game.global.reset = 0;
    
            game.state.start('quit');
            //stateText.text = " You Won, \n Click to restart";
            //stateText.visible = true;


            //the "click to restart" handler
            //game.input.onTap.addOnce(this.restart,this);


        }

    },
    collisionHandler_h: function  (helper_bullet, alien) {

        //  When a bullet hits an alien we kill them both

        this.emitter.x = helper_bullet.x;
        this.emitter.y = helper_bullet.y;
        this.emitter.start(true, 800, null, 15);
        helper_bullet.kill();
        alien.kill();

        //  Increase the score
        game.global.score += 20;
        scoreText.text = scoreString + game.global.score;

        //  And create an explosion 
        if (game.global.level == 1){
            var explosion = explosions.getFirstExists(false);
            explosion.reset(alien.body.x, alien.body.y);
            explosion.play('kaboom', 30, false, true);
        }
        

        if (aliens.countLiving() == 0)
        {

            console.log('win');

            //this.player.kill();

            //game.global.level += 1;
            //levelText.text = levelString + game.global.level;

            game.global.score += 1000;
            scoreText.text = scoreString + game.global.score;

            enemyBullets.callAll('kill',this);
            game.global.win = 1;
            game.global.reset = 0;
            game.state.start('quit');
            //stateText.text = " You Won, \n Click to restart";
            //stateText.visible = true;

        }

    },

    collisionHandler_2: function (bullet,alien_2){
        
        bullet.kill();
        alien_2.kill();

        //  Increase the score
        game.global.score+=50;
        scoreText.text = scoreString + game.global.score;

        if (game.global.level == 2){
            var explosion_2 = explosions_2.getFirstExists(false);
            explosion_2.reset(alien_2.body.x, alien_2.body.y);
            explosion_2.play('explosion_2', 30, false, true);
            console.log("fire");
        }

        if (game.global.score >=3000){
            console.log('win');

            //this.player.kill();

            game.global.score += 1000;
            scoreText.text = scoreString + game.global.score;

            enemyBullets.callAll('kill',this);
            game.global.win = 1;
            game.global.reset = 0;
            //game.global.level += 1;
            //levelText.text = levelString + game.global.level;
            game.state.start('quit');

        }

    },

    collisionHandler_2_h: function (helper_bullet,alien_2){
        
        helper_bullet.kill();
        alien_2.kill();

        //  Increase the score
        game.global.score+=50;
        scoreText.text = scoreString + game.global.score;

        if(game.global.level == 2){
            var explosion_2 = explosions_2.getFirstExists(false);
            explosion_2.reset(alien_2.body.x, alien_2.body.y);
            explosion_2.play('explosion_2', 30, false, true);
            console.log("fire");
        }

        if (game.global.score >=3000){
            console.log('win');

            game.global.score += 1000;
            scoreText.text = scoreString + game.global.score;

            enemyBullets.callAll('kill',this);
            game.global.win = 1;
            game.global.reset = 0;
            
            //game.global.level += 1;
            //levelText.text = levelString + game.global.level;
            
            game.state.start('quit');

        }

    },

    collisionHandler_3: function  (bullet, boss) {

        console.log('bullet:');
        console.log(bullet.hasOverlapped);
        console.log('boss:');
        console.log(boss.hasOverlapped);
        if (!bullet.hasOverlapped && !boss.hasOverlapped) {

                bullet.hasOverlapped = true;
                boss.hasOverlapped = true;

                boss_live = boss_live - 1;
                console.log('by player');
        
                console.log(boss_live);
                //bullet.kill();

                //  Increase the score
                var point = game.rnd.integerInRange(100, 200);
                game.global.score += point;
                scoreText.text = scoreString + game.global.score;

                if (boss_live <= 0) {
                    console.log('boss kill');
                    boss.kill();
                    console.log('win');

                    //game.global.level += 1;
                    //levelText.text = levelString + game.global.level;

                    game.global.score += 1000;
                    scoreText.text = scoreString + game.global.score;

                    game.global.win = 1;
                    game.global.reset = 0;
                    game.state.start('quit');
                    
                }
        }

        boss.hasOverlapped = false;
        //bullet.hasOverlapped = false;
        console.log('collide');
        
    },

    collisionHandler_3_h: function  (helper_bullet, boss) {

        if (!helper_bullet.hasOverlapped && !boss.hasOverlapped){
            helper_bullet.hasOverlapped = true;
            boss.hasOverlapped = true;
           
            boss_live -= 1;
        
            console.log(boss_live);
            //helper_bullet.kill();

            //  Increase the score
            var point = game.rnd.integerInRange(100, 200);
            game.global.score += point;
            scoreText.text = scoreString + game.global.score;

            if (boss_live <= 0)
            {
                console.log('boss kill');
                boss.kill();
                console.log('win');

                //game.global.level += 1;
                //levelText.text = levelString + game.global.level;

                game.global.score += 1000;
                scoreText.text = scoreString + game.global.score;

                game.global.win = 1;
                game.global.reset = 0;
                game.state.start('quit');
                //stateText.text = " You Won, \n Click to restart";
                //stateText.visible = true;


                //the "click to restart" handler
                //game.input.onTap.addOnce(this.restart,this);


            }
        }
        boss.hasOverlapped = false;
        //helper_bullet.hasOverlapped = false;

    },

    enemyHitsPlayer: function (player,bullet) {
        
        bullet.kill();

        live = lives.getFirstAlive();

        if (live)
        {
            live.kill();
        }

        //  And create an explosion :)
        var explosion = explosions.getFirstExists(false);
        explosion.reset(player.body.x, player.body.y);
        explosion.play('kaboom', 30, false, true);

        // When the player dies
        if (lives.countLiving() < 1)
        {
            player.kill();
            enemyBullets.callAll('kill');

            game.global.win= 0;
            game.state.start('quit');

            //stateText.text=" GAME OVER \n Click to restart";
            //stateText.visible = true;


            //the "click to restart" handler
            //game.input.onTap.addOnce(this.restart,this);
        }

    },

    enemyHitsPlayer_1: function (player,alien) {
        
        if (!player.hasOverlapped && !alien.hasOverlapped){
            console.log('Yesss');
            player.hasOverlapped = true;
            alien.hasOverlapped = true;

            live = lives.getFirstAlive();
                    if (live)
                    {
                        live.kill();
                    }

                    // When the player dies
                    if (lives.countLiving() < 1)
                    {
                        player.kill();
                        enemyBullets.callAll('kill');

                        game.global.win= 0;
                        game.state.start('quit');

                        //stateText.text=" GAME OVER \n Click to restart";
                        //stateText.visible = true;


                        //the "click to restart" handler
                        //game.input.onTap.addOnce(this.restart,this);
                    }
        }
        player.hasOverlapped = false;

    },

    enemyHitsPlayer_2: function (player,alien_2) {

        if (!player.hasOverlapped && !alien_2.hasOverlapped){
            player.hasOverlapped = true;
            alien_2.hasOverlapped = true;

            live = lives.getFirstAlive();
                if (live)
                {
                    live.kill();
                }

                // When the player dies
                if (lives.countLiving() < 1)
                {
                    player.kill();
                    enemyBullets.callAll('kill');

                    game.global.win= 0;
                    game.state.start('quit');

                    //stateText.text=" GAME OVER \n Click to restart";
                    //stateText.visible = true;


                    //the "click to restart" handler
                    //game.input.onTap.addOnce(this.restart,this);
                }
        }
        player.hasOverlapped = false;
    },

    enemyFires: function () {

        if (game.global.level == 1){
            //  Grab the first bullet we can from the pool
            enemyBullet = enemyBullets.getFirstExists(false);

            livingEnemies.length=0;

            aliens.forEachAlive(function(alien){

                // put every living enemy in an array
                livingEnemies.push(alien);
            });


            if (enemyBullet && livingEnemies.length > 0)
            {
                
                var random=game.rnd.integerInRange(0,livingEnemies.length-1);

                // randomly select one of them
                var shooter=livingEnemies[random];
                // And fire the bullet from this enemy
                enemyBullet.reset(shooter.body.x, shooter.body.y);

                game.physics.arcade.moveToObject(enemyBullet,player,120);
                firingTimer = game.time.now + 2000;
            }
        }

    },

    fireBullet: function () {

        //  To avoid them being allowed to fire too fast we set a time limit
        if (game.time.now > bulletTime)
        {
            game.world.forEach(function(bullet){
                bullet.hasOverlapped = false;
            });
            //  Grab the first bullet we can from the pool
            bullet = bullets.getFirstExists(false);
            bullet.hasOverlapped = 0;
            console.log('fire:');
            console.log(bullet.hasOverlapped);

            if (bullet)
            {
                //  And fire it
                if(game.global.level == 2 && game.global.sound == 1){
                    sound_2.play();
                } 
                else if (game.global.sound == 1){
                    sound_1.play();
                }
                bullet.reset(player.x, player.y + 8);
                bullet.body.velocity.x = 400;
                bulletTime = game.time.now + 200;

            }
        }

    },

    fireBullet_h: function () {

        if(game.global.littleHelper == 1){
            console.log('helper bullet');
            if (game.time.now > bulletTime1)
            {
                //  Grab the first bullet we can from the pool
                helper_bullet = helper_bullets.getFirstExists(false);
                helper_bullet.hasOverlapped = 0;

                if (helper_bullet)
                {
                    //  And fire it
                    helper_bullet.reset(helper.x, helper.y + 8);
                    helper_bullet.body.velocity.x = 500;
                    bulletTime1 = game.time.now + 100;

                }
            }
        }
        
        
    },

    resetBullet: function  (bullet,helper_bullet) {

        //  Called if the bullet goes out of the screen
        bullet.kill();
        helper_bullet.kill();


    },

    restart: function () {

        //  A new level starts
        
        //resets the life count
        lives.callAll('revive');
        //  And brings the aliens back from the dead :)
        aliens.removeAll();
        createAliens();

        //revives the player
        player.revive();
        //hides the text
        stateText.visible = false;

    },

    gameOver: function (){

        game.global.level += 1;
        levelText.text = levelString + game.global.level;

        game.global.score += 1000;
        scoreText.text = scoreString + game.global.score;
    
    },

    actionOnClick: function  () {
        console.log('quit');
        //location.href='menu.html';
    },
};
