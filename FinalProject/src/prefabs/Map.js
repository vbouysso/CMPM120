class Map extends Phaser.Scene {
    constructor(scene, mapkey, texture) {
        map = scene.make.tilemap({key: mapkey});
        var tileset = map.addTilesetImage(texture);
    }

    

    update() {
        
    }
}