import Phaser from 'phaser'

declare global {
    namespace Phaser.GameObjects {
        interface GameObjectFactory {
            sword(x: number, y: number, texture: string, frame?: string | number): Sword
        }
    }
}

export default class Sword extends Phaser.Physics.Arcade.Sprite
{
	private lastDirection: Phaser.Math.Vector2

	constructor(scene: Phaser.Scene, x: number, y: number, texture: string, frame?: string | number) {
		super(scene, x, y, texture, frame)

		this.lastDirection = new Phaser.Math.Vector2(0, 1)
		//this.setScale(1.5)
	}

    updatePosition(x: number, y: number, direction: Phaser.Math.Vector2) {

		if(direction.x === 0 && direction.y === 0){
			direction = this.lastDirection
		}

		this.lastDirection = direction

		x += direction.x * 16//this.width
		y += direction.y * 16//this.height


		if(direction.y === 0 && direction.x === -1){
			this.setAngle(-180)

		} else {
			this.setAngle(direction.y * Math.abs(direction.x - 2) * 45)
		}

		this.setPosition(x, y + this.height/2)
    }
}

Phaser.GameObjects.GameObjectFactory.register('sword', function (this: Phaser.GameObjects.GameObjectFactory, x: number, y: number, texture: string, frame?: string | number) {
    const sprite = new Sword(this.scene, x, y, texture, frame)

    this.displayList.add(sprite)
    this.updateList.add(sprite)

    this.scene.physics.world.enableBody(sprite, Phaser.Physics.Arcade.DYNAMIC_BODY)
	sprite.body.enable = false


    sprite.body.setSize(24, 24)
    //sprite.body.setOffset(-2, -2)

    return sprite
})