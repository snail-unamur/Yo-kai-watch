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

        this.anims.play('player-idle')
    }

    preUpdate(time: number, delta: number) {
        super.preUpdate(time, delta)
    }

    update(cursors: Phaser.Types.Input.Keyboard.CursorKeys) {
        if(!cursors) {
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
    }
}

Phaser.GameObjects.GameObjectFactory.register('player', function (this: Phaser.GameObjects.GameObjectFactory, x: number, y: number, texture: string, frame?: string | number) {
    const sprite = new Player(this.scene, x, y, texture, frame)

    this.displayList.add(sprite)
    this.updateList.add(sprite)

    this.scene.physics.world.enableBody(sprite, Phaser.Physics.Arcade.DYNAMIC_BODY)

    sprite.body.setSize(sprite.width * 0.9, sprite.height * 0.6)
    sprite.body.setOffset(sprite.width * 0.1, sprite.height * 0.4)

    return sprite
})