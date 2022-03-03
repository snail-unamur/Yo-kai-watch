import Phaser from 'phaser'
import SwordContainer from '~/weapons/Sword'
import { sceneEvents } from '~/events/EventCenter'
import Log from '~/utils/Log'
import { LogConstant } from '~/utils/Const'

declare global {
    namespace Phaser.GameObjects {
        interface GameObjectFactory {
            player(x: number, y: number, texture: string, frame?: string | number): Player
        }
    }
}

enum HealthState {
    IDLE,
    DAMAGE,
    DEAD,
}

export default class Player extends Phaser.Physics.Arcade.Sprite {
    private healthState: HealthState = HealthState.IDLE
    private health = 3

    private invicibilityDuration: number = 250

    private attacking: boolean = false
    private digging: boolean = false
    private goingUp: boolean = false

    constructor(scene: Phaser.Scene, x: number, y: number, texture: string, frame?: string | number) {
        super(scene, x, y, texture, frame)

        this.anims.play('player-idle')
    
        this.once(Phaser.Animations.Events.ANIMATION_COMPLETE_KEY + 'player-dig', (animation) => {
            sceneEvents.emit('player-dig-done')
            this.digging = false
        })
    
        this.once(Phaser.Animations.Events.ANIMATION_COMPLETE_KEY + 'player-go-up', (animation) => {
            sceneEvents.emit('player-go-up-done')
            this.goingUp = false
        })
    }

    getHealth(): number {
        return this.health
    }

    isDigging(): boolean{
        return this.digging
    }

    isGoingUp(): boolean{
        return this.goingUp
    }

    handleDamage(dir: Phaser.Math.Vector2) {
        if(this.health <= 0 || this.healthState === HealthState.DAMAGE) {
            return
        }

        this.health--


        if (this.health <= 0) {
            this.healthState = HealthState.DEAD
            this.anims.play('player-idle')
            this.setTint(0x8c0000)
            this.setVelocity(0, 0)

            // play death sound
            sceneEvents.emit('player-dead')
            sceneEvents.emit('player-dead-ui')
            this.scene.sound.play('player_death', { volume: 1.5 })
        } else {
            sceneEvents.emit('player-damage', this.health)
            Log.addInformation(LogConstant.GET_HIT, this)
            this.setVelocity(dir.x, dir.y)

            this.setTint(0xff0000)
            this.healthState = HealthState.DAMAGE

            // play damage sound
            this.scene.sound.play('oof', { volume: 2.0 })

            this.scene.time.delayedCall(this.invicibilityDuration, () => {
                this.clearTint()
                this.healthState = HealthState.IDLE
            }, [], this)
        }
    }

    preUpdate(time: number, delta: number) {
        super.preUpdate(time, delta)
    }

    update(cursors: {
        up: Phaser.Input.Keyboard.Key[],
        down: Phaser.Input.Keyboard.Key[],
        left: Phaser.Input.Keyboard.Key[],
        right: Phaser.Input.Keyboard.Key[],
        attack: Phaser.Input.Keyboard.Key[],
        dig: Phaser.Input.Keyboard.Key[],
        goUp: Phaser.Input.Keyboard.Key[],
        openMap: Phaser.Input.Keyboard.Key[],
        freeze: Phaser.Input.Keyboard.Key[],
        restart: Phaser.Input.Keyboard.Key[]
    }, sword: SwordContainer, dt: number) {
        
        if(!cursors || this.healthState === HealthState.DEAD
            || this. healthState === HealthState.DAMAGE
            || this.digging
            || this.goingUp) {
            return
        }

        const speed = 150
        const player_speed = new Phaser.Math.Vector2(0, 0)

        // Left
        if(cursors.left.some(el => el.isDown)) {
            player_speed.x = -1

            this.flipX = true
        }

        // Right
        else if(cursors.right.some(el => el.isDown)) {
            player_speed.x = 1

            this.flipX = false
        }

        // Up
        if(cursors.up.some(el => el.isDown)) {
            player_speed.y = -1
        }

        // Down
        else if(cursors.down.some(el => el.isDown)) {
            player_speed.y = 1
        }

        sword.updatePosition(this.x, this.y, player_speed.clone())

        player_speed.normalize().scale(speed)
        this.setVelocity(player_speed.x, player_speed.y)

        if(player_speed.x === 0 && player_speed.y === 0){  
            // Idle
            this.scene.sound.stopByKey('running')
            this.anims.play('player-idle', true)
        } else {
            // Run
            let runningSound = this.scene.sound.get('running')

            if(this.anims.currentAnim.key !== "player-run" || (runningSound && !runningSound.isPlaying)){
                if(runningSound){
                    runningSound.play()
                } else {
                    this.scene.sound.play('running', { volume: 0.5, loop: true })
                }
            }
            this.anims.play('player-run', true)

        }

        if(cursors.attack.some(el => el.isDown) && !this.attacking){
            this.attack(sword)
        }
    }

    attack(sword){
        this.scene.sound.play('sword_slash', { volume: 0.5 })
        this.attacking = true
        let swordSprite = sword
        swordSprite.body.enable = true
        swordSprite.anims.play('player-attack', true)

        swordSprite.once(Phaser.Animations.Events.ANIMATION_COMPLETE, (animation) => {
            swordSprite.body.enable = false
            setTimeout(() => {
                this.attacking = false
            }, 500)
        })
    }

    dig(){
        if(this.digging || this.goingUp) return
        this.specialAction()
        this.scene.sound.play('dig', { volume: 2.5, delay: 0.01 })
        this.digging = true
        this.anims.play('player-dig', true)
    }

    goUp(){
        if(this.digging || this.goingUp) return
        this.specialAction()
        this.goingUp = true
        this.scene.sound.play('running', { volume: 0.5, delay: 0.35 })
        this.anims.play('player-go-up', true)
    }

    specialAction(){
        this.body.enable = false
        this.setVelocity(0, 0)
        this.scene.sound.stopByKey('running')
    }
}

Phaser.GameObjects.GameObjectFactory.register('player', function (this: Phaser.GameObjects.GameObjectFactory, x: number, y: number, texture: string, frame?: string | number) {
    const sprite = new Player(this.scene, x, y, texture, frame)

    this.displayList.add(sprite)
    this.updateList.add(sprite)

    this.scene.physics.world.enableBody(sprite, Phaser.Physics.Arcade.DYNAMIC_BODY)

    sprite.body.setSize(sprite.width * 0.9, sprite.height * 0.4)
    sprite.body.setOffset(sprite.width * 0.1, sprite.height * 0.6)

    return sprite
})