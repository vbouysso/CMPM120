class Play extends Phaser.Scene {
    constructor() {
        super('playScene');
    }

    preload(){
        this.load.spritesheet('teleport', './assets/teleportanim.png', {frameWidth: 224, frameHeight: 32, startFrame: 0, endFrame: 4}); 
        this.load.spritesheet('vertroll', './assets/vertroll.png', {frameWidth: 32, frameHeight: 32, startFrame: 0, endFrame: 8}); 
        this.load.spritesheet('horizroll', './assets/horizontalroll.png', {frameWidth: 32, frameHeight: 32, startFrame: 0, endFrame: 8}); 
        this.load.audio('bg_music', './assets/bg_music.wav');
        this.load.spritesheet('wall', './assets/canon4.png', {frameWidth: 50, frameHeight: 50, startFrame: 0, endFrame: 7});       
    }
    create() {
        // tilemap and collision
        const map = this.make.tilemap({key:"map", tileWidth:32, tileHeight:32});
        const tileset = map.addTilesetImage("tiles1","tiles");
        this.floorLayer = map.createLayer("floor", tileset,0, 0);
        this.wallsLayer = map.createLayer("walls", tileset, 0, 0);
        this.aboveLayer = map.createLayer("above_player", tileset);
        this.tprightlayer = map.createLayer("tpright", tileset);
        this.tpupLayer = map.createLayer("tpup", tileset);
        this.tpdownLayer = map.createLayer("tpdown", tileset);
        this.tpleftLayer = map.createLayer("tpleft", tileset);
        this.wallsLayer.setCollisionByProperty({collides: true });
        this.aboveLayer.setDepth(10);
    
        //this.bg_music = this.sound.add('bg_music', {mute: false, volume: 0.2, rate: 1.2, loop: true});
        //this.bg_music.play();


        //debug the wall to see if it happen 
        const debugGraphics = this.add.graphics().setAlpha(0.75);
        this.wallsLayer.renderDebug(debugGraphics, {
            tileColor: null, // Color of non-colliding tiles
            collidingTileColor: new Phaser.Display.Color(243, 134, 48, 255), // Color of colliding tiles
            faceColor: new Phaser.Display.Color(40, 39, 37, 255) // Color of colliding face edges
        });
        
        // create player
        const newplayer = map.findObject("Objects", obj => obj.name === "Spawn");
        // this.player = new Player(this, newplayer.x, newplayer.y, "player-head");
        this.player = new Player(this, 1119, 1187, "player-head"); //for starting player head right at body upgrade
        this.dummy = this.physics.add.sprite(this.player.x, this.player.y, 'teleport').setOrigin(0.07,0.45);
        this.dummy.setAlpha(0);
        // dummy.body.setCollideWorldBounds(true);
        //create Enemy
        this.enemies = this.add.group({
            runChildUpdate: true            // make sure update runs on group children
        })
        let newEnemy1 = map.filterObjects("Objects", obj => obj.name === "EnemySpawn");
        newEnemy1.map((tile) => {
            this.enemy = new PatrolEnemy(this, tile.x,tile.y, 'enemy1')
            this.enemies.add(this.enemy);
        });


        //const newEnemy2 = map.findObject("Objects", obj => obj.name === "Enemy1");
        //this.enemy = new BasicEnemy(this, newEnemy2.x,newEnemy2.y,'newenemy');

        this.particleManager = this.add.particles('cross');
        this.emitterconfig = 
        { 
            x: this.player.x,
            y: this.player.y,
            lifespan: 100, 
            speed: 90,
            scale: { start: 1, end: 0.5 },
            alpha: { start: 1, end: 0 },
            // higher steps value = more time to go btwn min/max
            lifespan: { min: 10, max: 7000, steps: 500 }}
        this.fromEmitter = this.particleManager.createEmitter(this.emitterconfig);
        this.fromEmitter.explode();

        
       // const newEnemy2 = map.findObject("Objects", obj => obj.type === "Enemy");
       // this.enemies = this.add.group();
        //for (let i = 0; i < 4; i++){
        //    const e = new PatrolEnemy(this, newEnemy2.x, newEemy2.y, 'enemy1');
         //   this.enemies.add(e)
        //}
        
        //this.player = new PlayerSword(this, 200, 200);
         

        //player anims
        this.anims.create({
            key: 'rollup',
            frames: this.anims.generateFrameNumbers('vertroll', {start: 0, end: 7, first: 0}),
            frameRate: 12,
            repeat: -1
        });
        this.anims.create({
            key: 'sideroll',
            frames: this.anims.generateFrameNumbers('horizroll', {start: 0, end: 7, first: 0}),
            frameRate: 12,
            repeat: -1
        });
        this.anims.create({
            key: 'teleport',
            frames: this.anims.generateFrameNumbers('teleport', {start: 0, end: 4, first: 0}),
            frameRate: 20,
            repeat: 0
        });

        
        // Define Keys
        keyW = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W);
        keyA = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
        keyS = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S);
        keyD = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);

        // Enables Pointer
        gamePointer = this.input.activePointer;


        // Temp Background
        //this.add.rectangle(0, 0, game.config.width, game.config.height, 0xf2f2f2).setOrigin(0);
        //const p1Spawn = map.findObject("Objects", obj => obj.name === "Spawn");
        //this.p1 = this.physics.add.sprite(p1Spawn.x, p1Spawn.y, "robot", 450);
        //this.player = new Player(this, game.config.width * 1/4, game.config.height/2);


        // Adds group to store all upgrades
        this.upgradeGroup = this.add.group({
            runChildUpdate: true
        });
        
        const newbody = map.findObject("Objects", obj => obj.name === "Body");
        this.upgradeBody = new Upgrade(this, newbody.x, newbody.y, 'upgrade:body', "body");
        this.upgradeGroup.add(this.upgradeBody);


        // Adds Pointer Down Event for Player Attacks
        this.input.on('pointerdown', () => {
            this.player.attack(gamePointer.worldX, gamePointer.worldY, this.hitbox);
        }, this);

        this.checkUpgrade();
        
        //collide against wall
        this.physics.add.collider(this.player, this.wallsLayer); 
        this.physics.add.collider(this.enemies, this.wallsLayer);
        this.physics.add.collider(this.player, this.enemies);
        this.physics.add.collider(this.enemies, this.enemies);
        // Jump Implementation
        this.jumpTiles = this.add.group();

        // Reads from object jump tiles based on direction and adds to the group
        let rightJTLocations = map.filterObjects("Objects", obj => obj.name === "right");
        rightJTLocations.map((tile) => {
            let rightTile = new JumpTile(this, tile.x, tile.y, "player-head", "right");
            this.jumpTiles.add(rightTile);
        });

        let leftJTLocations = map.filterObjects("Objects", obj => obj.name === "left");
        leftJTLocations.map((tile) => {
            let leftTile = new JumpTile(this, tile.x, tile.y, "player-head", "left");
            this.jumpTiles.add(leftTile);
        });

        let upJTLocations = map.filterObjects("Objects", obj => obj.name === "up");
        upJTLocations.map((tile) => {
            let upTile = new JumpTile(this, tile.x, tile.y, "player-head", "up");
            this.jumpTiles.add(upTile);
        });

        let downJTLocations = map.filterObjects("Objects", obj => obj.name === "down");
        downJTLocations.map((tile) => {
            let downTile = new JumpTile(this, tile.x, tile.y, "player-head", "down");
            this.jumpTiles.add(downTile);
        });

        // Implements collisions between player and tiles
        this.physics.add.overlap(this.player, this.jumpTiles, playerJump, null, this);
        function playerJump (player, tile) {
            this.player.setAlpha(0);
            this.dummy.setAlpha(0.7);
            player.isteleport = true;
            if (tile.direction == "left") {
                this.dummy.setAngle(180)
            } else if (tile.direction == "right") {
                this.dummy.setAngle(0)
            } else if (tile.direction == "up") {
                this.dummy.setAngle(270)
            } else if (tile.direction == "down") {
                this.dummy.setAngle(90)
            }
            //set position of from emitter and make explode
            this.fromEmitter.setPosition(tile.x + 16, tile.y-16);
            this.fromEmitter.frequency = 1;
            this.fromEmitter.explode();
            this.time.delayedCall(200, ()=>{tile.jump(player);});
            // tile.jump(player);
        }

      
      
        /*
        this.temp = new JumpTile(this, 0, 0, "player-body", "right");
        this.physics.add.collider(this.player, this.tprightlayer, () => {
            this.temp.jump(this.player);
        });
        //up
        this.up = new JumpTile(this, 0, 0, "player-body", "up");
        this.physics.add.collider(this.player, this.tpupLayer, () => {
            this.up.jump(this.player);
        });
        this.down = new JumpTile(this, 0, 0, "player-body", "down");
        this.physics.add.collider(this.player, this.tpdownLayer, () => {
            this.down.jump(this.player);
        });
        this.left = new JumpTile(this, 0, 0, "player-body", "left");
        this.physics.add.collider(this.player, this.tpleftLayer, () => {
            this.left.jump(this.player);
        }); */

        // Mouse Indicators
        this.attackIndicator = this.physics.add.image(100, 100, 'indicator').setOrigin(0, 0.5);
        this.hitbox = this.physics.add.image(100, 100, 'sword-hitbox').setOrigin(0, 0.5);

        // camera
        this.camera = this.cameras.main;
        this.camera.startFollow(this.player);
        this.camera.setBounds(0, 0, 5000, 5000);
         
        this.ind = this.physics.add.image(this, 100, 100, 'indicator', 0);
        //create groups for wall objects

        //enemy
        this.e1 = new Enemies(this, 'enemyhead', 3, true);

        this.obstacleGroup = this.add.group({
            runChildUpdate: true            // make sure update runs on group children
        })

    }
    

    update() {
        this.dummy.setPosition(this.player.x, this.player.y);
        if(this.player.isteleport){ this.dummy.play('teleport', true); }
        else{
            this.dummy.play('teleport', false)};
        this.updateIndicator();
        this.player.update();
        this.enemy.update();
        // enemy kill player
        let distance = Phaser.Math.Distance.Between(this.player.x, this.player.y, this.enemy.x, this.enemy.y);
        if (this.player.body.speed > 0){
        if (distance < 300)
            {
            //this.enemy.body.reset(this.player.x, this.player.y);
              this.physics.moveToObject(this.enemy, this.player, 100);
            //this.player.body.reset(50,50);
            }
        };
       
        //////////////////
    }

    updateIndicator() {
        this.attackIndicator.setPosition(this.player.x, this.player.y);

        // Gets Angle for Cursor
        this.dx = gamePointer.worldX - this.player.x;
        this.dy = gamePointer.worldY - this.player.y;
        this.angle = Math.atan(this.dy/this.dx);

        if (this.dx < 0) {
            this.angle += Math.PI;
        }

        this.attackIndicator.setRotation(this.angle);
    }


    checkUpgrade() {
        for (let type of this.upgradeGroup.getChildren()) {
            this.physics.add.collider(this.player, type, () => {
                this.upgradeEvent(type);
            }, null, this);
        }
    }

    upgradeEvent(elem) {
        if (elem.getType() == 'body') {
            this.spawnX = this.player.x;
            this.spawnY = this.player.y;
            this.player.destroy();
            this.player = new PlayerBody(this, this.spawnX, this.spawnY);
            this.resetPlayer();
            elem.destroy();
        }
    }

    resetPlayer() {
        this.camera.startFollow(this.player);
        this.physics.add.collider(this.player, this.wallsLayer);
        this.physics.add.collider(this.player, this.enmies);
        this.physics.add.collider(this.player, this.enemy);
        this.physics.add.overlap(this.player, this.jumpTiles, playerJump, null, this);
        function playerJump (player, tile) {
            player.setAlpha(0);
            //set position of from emitter and make explode
            this.fromEmitter.setPosition(tile.x + 16, tile.y-16);
            this.fromEmitter.frequency = 1;
            this.fromEmitter.explode();
            this.time.delayedCall(100, ()=>{tile.jump(player);});
            // tile.jump(player);
        }
    }
    
}