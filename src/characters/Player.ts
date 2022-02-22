import Phaser from 'phaser'
import SwordContainer from '~/weapons/Sword'
import { sceneEvents } from '~/events/EventCenter'

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

    private attacking: boolean = false

    constructor(scene: Phaser.Scene, x: number, y: number, texture: string, frame?: string | number) {
        super(scene, x, y, texture, frame)

        this.anims.play('player-idle')
    }

    getHealth(): number {
        return this.health
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
            this.scene.sound.play('player_death', { volume: 1.5 })
        } else {
            this.setVelocity(dir.x, dir.y)

            this.setTint(0xff0000)
            this.healthState = HealthState.DAMAGE

            // play damage sound
            this.scene.sound.play('oof', { volume: 2.5 })

            this.scene.time.delayedCall(120, () => {
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

        // if(this.attacking){
        //     return
        // }
        
        if(!cursors || this.healthState === HealthState.DEAD
            || this. healthState === HealthState.DAMAGE) {
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
            this.anims.play('player-idle', true)
        } else {
            // Run
            this.anims.play('player-run', true)

        }

        if(cursors.attack.some(el => el.isDown) && !this.attacking){
            this.attacking = true
            console.log("attack")
            let swordSprite = sword
            swordSprite.body.enable = true
            swordSprite.anims.play('player-attack', true)
            const startHit = (anim: Phaser.Animations.Animation, frame: Phaser.Animations.AnimationFrame) => {
                //sword.rotateBy(0.1 * dt)
                console.log(anim.key, "update attack")

                // sword.x = this.flipX
                //     ? this.x - this.width * 1
                //     : this.x + this.width * 1
    
                // this.swordHitbox.y = this.y + this.height * 0.2
    
                // this.swordHitbox.body.enable = true
                // this.scene.physics.world.add(this.swordHitbox.body)
            }
    
            //swordSprite.on(Phaser.Animations.Events.ANIMATION_UPDATE, startHit)
    
            swordSprite.once(Phaser.Animations.Events.ANIMATION_COMPLETE, (animation) => {
                swordSprite.body.enable = false
                setTimeout(() => {
                    console.log(animation.key + "completed")
                    //swordSprite.off(Phaser.Animations.Events.ANIMATION_UPDATE, startHit)
                    this.attacking = false
                }, 500)
                //swordSprite.anims.play('player-idle', true)
                //this.knightStateMachine.setState('idle')
    
                // // TODO: hide and remove the sword swing hitbox
                // this.swordHitbox.body.enable = false
                // this.scene.physics.world.remove(this.swordHitbox.body)
            })
        }
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