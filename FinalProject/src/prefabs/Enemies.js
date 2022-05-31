class Enemies extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, texture, hit_times,move) {     //scene, sprite, expected hits to destory, can move or not
                                                      //this,  ' '   , val, boolean   
        super(scene, 100,100, texture);               //add enemy, position is for test
        this.hitTime = hit_times;                    
        scene.add.existing(this);               
        scene.physics.add.existing(this);      
        if(!move){this.setImmovable();}               // set still if it's an object              
        this.alpha = 1;                               // trandparancy control: inital =1
        this.transparency = this.alpha/this.hitTime;  // the amount transparancy lower each time     
        
        this.isHit = false;        
    }

    update() {
        if (this.isHit ){                             // 
            if(this.hitTime> 0) {
                this.hitTime --;
                this.alpha -= this.transparency;
                this.setAlpha(this.alpha);}
            else{
                this.destroy();
            }
            
        }


        
        
    }
}