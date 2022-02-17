export default class HealthBar extends Phaser.GameObjects.Graphics {
    private value = 100

    constructor(scene, x, y) {
        super(scene, { x, y })

        scene.add.existing(this)
        this.draw()
    }

    decrease(amount) {
        this.value -= amount
        if (this.value < 0) {
            this.value = 0
        }

        this.draw()
    }

    draw() {
        this.clear()

        // Background
        this.fillStyle(0x202121)
        this.fillRect(this.x, this.y, 33, 10)

        // Health
        this.fillStyle(0x69ff4f)
        this.fillRect(this.x, this.y, 30, 7)

        if (this.value < 30) {
            this.fillStyle(0xff0000)
        } else {
            this.fillStyle(0x00ff00)
        }
    }
   
}