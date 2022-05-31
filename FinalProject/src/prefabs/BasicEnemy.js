class Barrel extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y, velocity, texture) {
        // call Phaser Physics Sprite constructor
        super(scene, x, y, texture);
        // set up physics sprite
        scene.add.existing(this);               // add to existing scene, displayList, updateList
        scene.physics.add.existing(this);       // add to physics system
        this.setVelocityX(velocity);   
        this.setImmovable();     
        // this.allowGravity = false;        
        //this.tint = Math.random() * 0xFFFFFF;   // randomize tint
        this.alpha = 1;
        this.setFrame(4);
    }

    update() {
    }
}
