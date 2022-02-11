import Phaser from 'phaser'

declare global {
    namespace Phaser.GameObjects {
        interface GameObjectFactory {
            player(x: number, y: number, texture: string, frame?: string | number): Player
        }
    }
}

export default class Player extends Phaser.Physics.Arcade.Sprite {
    constructor(scene: Phaser.Scene, x: number, y: number, texture: string, frame?: string | number) {
        super(scene, x, y, texture, frame)

        this.anims.play('player-idle-down')
    }

    preUpdate(time: number, delta: number) {
        super.preUpdate(time, delta)
    }

    update(cursors: Phaser.Types.Input.Keyboard.CursorKeys) {
        if(!cursors) {
            return
        }

        const speed = 150

        // Left
        if(cursors.left?.isDown) {
            this.setVelocity(-speed, 0)
            this.anims.play('player-run-side', true)

            this.flipX = true
        }

        // Right
        else if(cursors.right?.isDown) {
            this.setVelocity(speed, 0)
            this.anims.play('player-run-side', true)

            this.flipX = false
        }

        // Up
        else if(cursors.up?.isDown) {
            this.setVelocity(0, -speed)
            this.anims.play('player-run-up', true)
        }

        // Down
        else if(cursors.down?.isDown) {
            this.setVelocity(0, speed)
            this.anims.play('player-run-down', true)
        }

        // Idle
        else {          
            const parts = this.anims.currentAnim.key.split('-')
            parts[1] = 'idle'
            this.anims.play(parts.join('-'))
            this.setVelocity(0, 0)
        }
    }
}

Phaser.GameObjects.GameObjectFactory.register('player', function (this: Phaser.GameObjects.GameObjectFactory, x: number, y: number, texture: string, frame?: string | number) {
    const sprite = new Player(this.scene, x, y, texture, frame)

    this.displayList.add(sprite)
    this.updateList.add(sprite)

    this.scene.physics.world.enableBody(sprite, Phaser.Physics.Arcade.DYNAMIC_BODY)

    sprite.body.setSize(sprite.width * 0.5, sprite.height * 0.8)

    return sprite
})