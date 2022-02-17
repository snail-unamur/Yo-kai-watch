import Phaser from "phaser"

import { MonsterConstantsSize, MonsterConstantsType } from "~/utils/Const"

enum HealthState {
    IDLE,
    DAMAGE,
    DEAD,
}

export default class Monster extends Phaser.Physics.Arcade.Sprite {
    private monsterType: MonsterConstantsType
    private monsterSize: MonsterConstantsSize
    private health: number = 3
    private healthState: HealthState = HealthState.IDLE

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

    setMonsterHealth(hp: number) {
        this.health = hp
    }

    getMonsterType(){
        return this.monsterType
    }
    
    getMonsterSize(){
        return this.monsterSize
    }

    getMonsterHealth() {
        return this.health
    }

    playAnim(){
        this.anims.play(this.monsterSize+'-'+this.monsterType+'-run')
    }


    runTowards(x: number, y: number) {
        if (this.healthState === HealthState.DAMAGE) {
            return
        }
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

    handleDamage(dir: Phaser.Math.Vector2) {
        this.health--

        if (this.health <= 0) {
            // Play animation ?
            this.healthState = HealthState.DEAD
            this.destroy()
        } else {
            this.setVelocity(dir.x, dir.y)
            this.setTint(0xff0000)
            this.healthState = HealthState.DAMAGE
            this.scene.time.delayedCall(120, () => {
                this.clearTint()
                this.healthState = HealthState.IDLE
            }, [], this)
        }
    }
}