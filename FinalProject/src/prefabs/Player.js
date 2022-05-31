class Player extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y, texture = 'player-head') {
        super(scene, x, y, texture, 0);
        scene.add.existing(this);
        scene.physics.add.existing(this);

        // Set Properties
        this.walkAcceleration = 600;
        this.maxSpeed = 300;
        this.setMaxVelocity(this.maxSpeed);
        this.drag = 0.25;
        this.dashSpeed = 700;
        this.isAttack = false;
        this.attackDuration = 0;
        this.attackDuration_MAX = 50;
        this.setBounce(0.5);
        //this.body.setCollideWorldBounds(true);
        this.setDamping(true);
        this.isupright = true;
        this.isteleport = false; //teleport state - animation depends on this property
    }

    preload(){
    }

    create(){
    }

    update() {
        // console.log(this.rotation)
        //update isupright variable (depends on rotation)
        if((-1.5 < this.rotation) && (this.rotation < 1.5)){
            this.isupright = true;
        } else { this.isupright = false;}

        // Controls Attack Logic
        if (this.isAttack == true && this.attackDuration > 0) {
            this.attackDuration -= 1;
        }

        if (this.attackDuration <= 0) {
            this.isAttack = false
            this.setMaxVelocity(this.maxSpeed);
        }
        

        // Controls Player Movement
        if (keyW.isDown) {
            this.setAccelerationY(-this.walkAcceleration);
            //if/else chooses which animation to play based on if player is upside down or not
            if(this.isupright){ 
                if(!this.anims.isPaused){ //if start of game
                    this.play('rollup', true)
                 } else {
                    this.anims.resume();
                    if(this.anims.inReverse){this.anims.reverse()}
                }
            } else{ //PLAYER IS UPSIDEDOWN, W KEY IS DOWN
                if(!this.anims.isPaused){
                    this.playReverse('rollup', true) //if start of game
                } else { 
                this.anims.resume();
                if(!this.anims.inReverse){this.anims.reverse();}
                }
        }
    } else if (keyS.isDown) {
            this.setAccelerationY(this.walkAcceleration);
            if(this.isupright){
                if(!this.anims.isPaused){
                    this.playReverse('rollup', true)
                 } else {
                    this.anims.resume();
                    if(!this.anims.inReverse){this.anims.reverse();}
                 }
            } else { //PLAYER IS UPSIDEDOWN, S KEY IS DOWN
                if(!this.anims.isPaused){
                    this.play('rollup', true) //if start of game
                } else { 
                this.anims.resume();
                if(this.anims.inReverse){this.anims.reverse();}
                }
        }
        } else {
            //both uprolling and downrolling animation are stopped 
            //if key is W or S key is not being pressed down
            this.anims.pause();
            // console.log("currentframe :", this.anims.currentFrame);
            // this.rollup.paused = true;
            // var hasAnim = this.anims.exists('rollup');
            // hasAnim.pause();
            
        }


        if (keyA.isDown) {
            this.setAccelerationX(-this.walkAcceleration);
            this.setRotation(this.rotation - (5.5*(Math.PI/180)));


        } else if (keyD.isDown) {
            this.setAccelerationX(this.walkAcceleration);
            this.setRotation(this.rotation + (5.5*(Math.PI/180)));
        }

        if (keyW.isUp && keyS.isUp) {
            this.setAccelerationY(0);
            this.setDragY(this.drag);
        }

        if (keyA.isUp && keyD.isUp) {
            this.setAccelerationX(0);
            this.setDragX(this.drag);
        }

        if (Phaser.Input.Keyboard.JustUp(keyW)) {
            console.log('w just up')
        }

    }
    attack(px, py, hitbox) {
        if (this.isAttack != false) {
            return;
        }
        // this.sound.play('sound');
        // Grabs the angle by calculating this dist to x, y
        this.dirX = 1;
        this.dx = px - this.x;
        if (this.dx < 0) {
            this.dirX = -1;
        }

        this.dirY = 1;
        this.dy = py - this.y;
        if (this.dy < 0) {
            this.dirY = -1;
        }

        this.angle = Math.atan(this.dy/this.dx);

        this.isAttack = true;
        this.attackDuration = this.attackDuration_MAX;
        this.setMaxVelocity(this.dashSpeed);
        this.setVelocityX(this.dirX * this.dashSpeed * Math.cos(this.angle));
        this.setVelocityY(this.dirX * this.dashSpeed * Math.sin(this.angle));
    }
}