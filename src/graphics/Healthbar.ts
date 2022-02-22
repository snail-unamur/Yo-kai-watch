export default class HealthBar extends Phaser.GameObjects.Graphics {
    private value: number
    private maxValue: number

    private offsetX: number
    private offsetY: number

    constructor(scene, offsetY, value:number = 3) {
        super(scene)
        this.value = value
        this.maxValue = value
        this.offsetX = -15.75
        this.offsetY = offsetY

        scene.add.existing(this)
        this.draw()
    }

    setValue(value:number){
        this.value = value
        this.maxValue = value
    }

    decrease(amount) {
        this.value -= amount
        if (this.value < 0) {
            this.value = 0
        }

        this.draw()
        return this.value
    }

    draw() {
        this.clear()

        // Background
        this.fillStyle(0x202121)
        this.fillRect(this.offsetX, this.offsetY, 31.5, 5)

        // Health
        this.fillStyle(0x69ff4f)
        this.fillRect(this.offsetX, this.offsetY, 30*(this.value/this.maxValue), 3.5)

        /* TODO: color bar based on reamining health points
        
        if (this.value < 30) {
            this.fillStyle(0xff0000)
        } else {
            this.fillStyle(0x00ff00)
        }*/
    }
   
}