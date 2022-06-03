import Phaser from 'phaser'
import Player from '~/characters/Player'

declare global {
    namespace Phaser.GameObjects {
        interface GameObjectFactory {
            sword(x: number, y: number, texture: string, frame?: string | number): Sword
        }
    }
}

export default class Sword extends Phaser.Physics.Arcade.Sprite
{
	private swordScale: number = 1.5

	constructor(scene: Phaser.Scene, x: number, y: number, texture: string, frame?: string | number) {
		super(scene, x, y, texture, frame)
		this.setScale(this.swordScale)
	}

    updatePosition(x: number, y: number, direction: Phaser.Math.Vector2) {
		this.setPosition(x, y + 8)
    }

	attack(player: Player){
        this.body.enable = true
		this.anims.play('slash', true)

        this.once(Phaser.Animations.Events.ANIMATION_COMPLETE, (animation) => {
            this.body.enable = false
            setTimeout(() => {
				player.setAttacking(false)
            }, Player.ATTACK_DELAY)
        })
	}
}

Phaser.GameObjects.GameObjectFactory.register('sword', function (this: Phaser.GameObjects.GameObjectFactory, x: number, y: number, texture: string, frame?: string | number) {
    const sprite = new Sword(this.scene, x, y, texture, frame)

    this.displayList.add(sprite)
    this.updateList.add(sprite)

    this.scene.physics.world.enableBody(sprite, Phaser.Physics.Arcade.DYNAMIC_BODY)
	sprite.body.enable = false


    sprite.body.setSize(48, 48)
    //sprite.body.setOffset(-2, -2)

    return sprite
})