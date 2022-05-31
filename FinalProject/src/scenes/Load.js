class Load extends Phaser.Scene {
    constructor() {
        super('loadScene');
    }

    preload() {
        this.load.path = './assets/';
        // Loads Graphic Assets
        this.load.image('player-head', 'Robot-Head.png');
        this.load.image('enemyhead', 'Robot-Head1.png');
        this.load.image('player-body', 'rhb-o1.png');//Robot-Body.png');
        this.load.image('player-sword', 'Robot-Sword.png')
        this.load.image('upgrade:body', 'Upgrade-Body.png');
        this.load.image('sword-hitbox', 'SwordHitbox.png')
        this.load.image('indicator', 'Indicator.png');
        //this.load.image('map', 'map.png');
        this.load.image("tiles","tiles.png");
        this.load.tilemapTiledJSON('map',"map1.json")
        this.load.image('cross', 'white_cross.png');

        this.load.tilemapTiledJSON('map2', "map2.json")
        this.load.image("tiles1","tiles1.png");
        this.load.image("gun","gun.png");
        //Load characters
        //this.load.atlas('enemy1', 'enemy1.png','enemy1.json');



        this.load.spritesheet('wall', 'canon4.png', {frameWidth: 50, frameHeight: 50, startFrame: 0, endFrame: 7});       
        this.load.spritesheet('enemy1','enemy1.png',{frameWidth:152, frameHeight:170, startFrame:0, endFrame:15});
        this.load.spritesheet('basicenemy','enemy.png',{frameWidth:150, frameHeight:200, startFrame:0, endFrame:15});

    }

    create() {

        

        // check for local storage browser support
        if(window.localStorage) {
            console.log('Local storage supported');
        } else {
            console.log('Local storage not supported');
        }

        // go to Title scene
        this.scene.start('menuScene');
        // this.scene.start('playScene');
    }
}