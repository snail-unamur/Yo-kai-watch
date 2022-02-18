import Phaser from 'phaser'
import SwordContainer from '~/weapons/SwordContainer'

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

    preUpdate(time: number, delta: number) {
        super.preUpdate(time, delta)
    }

    update(cursors: Phaser.Types.Input.Keyboard.CursorKeys, sword: SwordContainer, dt: number) {
        if(!cursors || this.healthState === HealthState.DEAD
            || this. healthState === HealthState.DAMAGE) {
            return
        }

        const speed = 150
        const player_speed = new Phaser.Math.Vector2(0, 0)

        // Left
        if(cursors.left?.isDown) {
            player_speed.x = -1

            this.flipX = true
        }

        // Right
        else if(cursors.right?.isDown) {
            player_speed.x = 1

            this.flipX = false
        }

        // Up
        if(cursors.up?.isDown) {
            player_speed.y = -1
        }

        // Down
        else if(cursors.down?.isDown) {
            player_speed.y = 1
        }

        player_speed.normalize().scale(speed)
        this.setVelocity(player_speed.x, player_speed.y)

        if(player_speed.x === 0 && player_speed.y === 0){  
            // Idle        
            this.anims.play('player-idle', true)
        } else {
            // Run
            this.anims.play('player-run', true)

        }

        
        if(cursors.space?.isDown && sword.isPhysicsDisplayContained) {
            sword.rotateBy(1.5 * dt)
            sword.setVisible(true)
            sword.physicsBody.setEnable(true)
        } else {
            sword.physicsBody.setEnable(false)
            sword.setVisible(false)
            sword.setActive(false)
        }
        sword.updatePosition(this.x, this.y)
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