import Phaser from "phaser"

export default class Monster extends Phaser.Physics.Arcade.Sprite {
    private colliding: boolean = false
    constructor(scene: Phaser.Scene, x: number, y: number, texture: string, frame?: string | number) {
        super(scene, x, y, texture, frame)

        this.anims.play('monster-run')
    }

    runTowards(x: number, y: number) {
        
        if (this.x < x) {
            this.setVelocityX(10)
        } 
        if (this.x > x) {
            this.setVelocityX(-10)
        }
        if (this.y < y) {
            this.setVelocityY(10)
        }
        if (this.y > y) {
            this.setVelocityY(-10)
        }
    }
}