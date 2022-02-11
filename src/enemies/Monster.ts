import Phaser from "phaser"

import { MonsterConstantsSize, MonsterConstantsType } from "~/utils/Const"

export default class Monster extends Phaser.Physics.Arcade.Sprite {
    private colliding: boolean = false
    private monsterType: MonsterConstantsType
    private monsterSize: MonsterConstantsSize

    constructor(scene: Phaser.Scene, x: number, y: number, texture: string, frame?: string | number) {
        super(scene, x, y, texture, frame)

        this.monsterType = MonsterConstantsType.DEMON
        this.monsterSize = MonsterConstantsSize.TINY
    }

    setMonsterType(type:MonsterConstantsType){
        this.monsterType = type
    }

    setMonsterSize(size:MonsterConstantsSize){
        this.monsterSize = size

        // Match hitbox and size
        switch(this.monsterSize){
            case MonsterConstantsSize.TINY:
                this.body.setSize(12, 12)
                this.body.setOffset(3, 3)
                break;

            case MonsterConstantsSize.MEDIUM:
                this.body.setSize(12, 16)
                this.body.setOffset(2, 0)
                break;

            case MonsterConstantsSize.BIG:
                this.body.setSize(20, 26)
                this.body.setOffset(5, 8)
                break;
        }
    }

    playAnim(){
        this.anims.play(this.monsterSize+'-'+this.monsterType+'-run')
    }


    runTowards(x: number, y: number) {
        const speed = 10

        const dx = x - this.x
        const dy = y - this.y

        const monsterVelocity = new Phaser.Math.Vector2(dx, dy).normalize().scale(speed)

        // Flip sprite to match the direciton of the monster
        if(monsterVelocity.x < 0){
            this.flipX = true
        } else {
            this.flipX = false
        }

        this.setVelocity(monsterVelocity.x, monsterVelocity.y)
    }
}