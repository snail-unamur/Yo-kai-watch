import Phaser from "phaser"
import HealthBar from "~/graphics/Healthbar"

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
    private healthBar!: HealthBar


    private infoString: string = ""

    private issue?: {
        component:string,
        type:string, 
        severity:string
    }

    constructor(scene: Phaser.Scene, x: number, y: number, texture: string, frame?: string | number) {
        super(scene, x, y, texture, frame)

        // Default value ovewritten later
        this.monsterType = MonsterConstantsType.DEMON
        this.monsterSize = MonsterConstantsSize.BIG

        let this_ = this
        this.on('animationrepeat', function(){
            this_.playAnim("run")
            this_.body.enable = true
            this_.body.onCollide = true
            this_.healthBar = new HealthBar(this_.scene, -this_.body.height/2 - 15+ this_.body.offset.y)  
            this_.removeListener('animationrepeat')
        })
        this.updateInfo()
    }

    setIssue(issue:{ component:string, type:string, severity:string }){
        this.issue = issue
        let monsterType = MonsterConstantsType.ZOMBIE
        switch(issue.type){
            case 'CODE_SMELL':
                monsterType = MonsterConstantsType.ZOMBIE
                break
            case 'BUG':
                monsterType = MonsterConstantsType.GOBLIN
                break
            case 'VULNERABILITY':
                monsterType = MonsterConstantsType.DEMON
                break
        }

        let monsterSize = MonsterConstantsSize.MEDIUM
        switch(issue.severity){
            case 'INFO':
                monsterSize = MonsterConstantsSize.TINY
                break
            case 'MINOR':
                monsterSize = MonsterConstantsSize.MEDIUM
                break
            case 'MAJOR':
                monsterSize = MonsterConstantsSize.MEDIUM
                break
            case 'CRITICAL':
                monsterSize = MonsterConstantsSize.BIG
                break
        }
        
        this.setMonsterType(monsterType)
        this.setMonsterSize(monsterSize)
        this.playAnim()
        this.updateInfo()
    }

    initialize(){
        this.setMonsterSize(this.monsterSize)
    }

    destroy(fromScene?: boolean): void {
        super.destroy(fromScene)
        this.healthBar?.destroy()
    }

    updateInfo(){
        this.infoString = `${this.monsterSize} ${this.monsterType}\n ${this.issue?.severity} ${this.issue?.type}`
    }

    getInfoString(){
        return this.infoString
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

    playAnim(animKey:string='appear'){
        this.anims.play(this.monsterSize + '-' + this.monsterType + '-' + animKey)
    }

    protected preUpdate(time: number, delta: number): void {
        super.preUpdate(time, delta)
        this.healthBar?.setPosition(this.x, this.y)

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
        this.health = this.healthBar.decrease(34)
        

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