class Obstacle extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, velocity, texture) {
        // call Phaser Physics Sprite constructor
        super(scene, game.config.width, Phaser.Math.Between(40, (game.config.height * (2/3) - 40)), texture); 
        // set up physics sprite
        scene.add.existing(this);               // add to existing scene, displayList, updateList
        scene.physics.add.existing(this);       // add to physics system
        this.setVelocityX(velocity);            // make it go!
        this.setImmovable();                    
        this.newObstacle = true;                 // custom property to control barrier spawning
        this.alpha = 1;
        this.isHit = false;
    }

    update() {
        if (this.isHit && this.alpha > 0) {
            this.alpha -= 0.05;
            this.setAlpha(this.alpha);
        }


        // add new barrier when existing barrier hits center X
        if(this.newObstacle && this.x < centerX) {
            this.newObstacle = false;
            // (recursively) call parent scene method from this context
            this.scene.addEnemy(this.parent, enemySpeed, this.texture);
        }

        // destroy paddle if it reaches the left edge of the screen
        if(this.x < -this.width) {
            this.destroy();
        }
    }
}