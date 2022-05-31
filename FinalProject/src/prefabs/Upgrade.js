class Upgrade extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y, texture, type) {
        super(scene, x, y, texture, 0);
        scene.add.existing(this);
        scene.physics.add.existing(this);

        this.setImmovable(true);
        this.type = type;
    }

    getType() {
        return this.type;
    }
}