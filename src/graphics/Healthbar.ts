export default class HealthBar extends Phaser.GameObjects.Graphics {
    private value: number
    private maxValue: number

    private offsetX: number
    private offsetY: number

    static readonly barHeight: number= 5
    static readonly ratioHeight: number= 0.7

    static readonly colorComplementGreen = 0x75B57D
    static readonly colorComplementGreenLighter = 0x8DB575
    static readonly colorInitialGreen = 0x69ff4f

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
        this.fillRect(this.offsetX, this.offsetY, 31.5, HealthBar.barHeight)

        // Health
        this.fillStyle(HealthBar.colorComplementGreenLighter)
        this.fillRect(this.offsetX, this.offsetY, 30*(this.value/this.maxValue), HealthBar.barHeight*HealthBar.ratioHeight)

        /* TODO: color bar based on reamining health points
        
        if (this.value < 30) {
            this.fillStyle(0xff0000)
        } else {
            this.fillStyle(0x00ff00)
        }*/
    }
   
}