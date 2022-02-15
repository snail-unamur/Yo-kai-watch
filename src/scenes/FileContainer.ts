import Phaser from "phaser";

declare global {
    namespace Phaser.GameObjects {
        interface GameObjectFactory {
            fileContainer(x: number, y: number, width: number, height: number, name: string, fillColor?: number, selected?: boolean): FileContainer
        }
    }
}

export default class FileContainer extends Phaser.GameObjects.Container{
    name: string = "undefined"
    selected: boolean = false
    nameText: Phaser.GameObjects.Text
    rectangle: Phaser.GameObjects.Rectangle
    isTop: boolean = false

    constructor(scene: Phaser.Scene, x: number, y: number, width: number, height: number, name: string, fillColor: number, selected: boolean = false){
        super(scene, x, y)


        this.name = name

        this.selected = selected

        this.rectangle = new Phaser.GameObjects.Rectangle(scene, 0, 16, width, height, fillColor)
        this.add(this.rectangle)

        this.nameText = new Phaser.GameObjects.Text(scene, - width / 2, - height / 2, name, {})
        this.add(this.nameText)
        this.nameText.setColor('white')

        this.setSelected(selected)
    }

    setIsTop(isTop:boolean=true){
        this.isTop = isTop
        this.setSelected(this.selected)
    }

    getName(): string {
        return this.name
    }

    update() {
        super.update()
    }

    setSelected(isSelected:boolean){
        this.selected = isSelected
        if(isSelected){
            this.rectangle.strokeColor = 0xaaffaa
            this.rectangle.isStroked = true
            this.rectangle.alpha = 1
            if(this.isTop){
                this.setScale(1.6)
            } else {
                this.setScale(1.2)
            }
        } else {
            this.rectangle.alpha = 0.7
            this.rectangle.isStroked = false
            if(this.isTop){
                this.setScale(1.4)
            } else {
                this.setScale(1)
            }
        }
    }

    setDestination(x:number, y:number){
        this.setPosition(this.x + x, this.y + y)
    }
}

Phaser.GameObjects.GameObjectFactory.register('fileContainer', 
    function (this: Phaser.GameObjects.GameObjectFactory, 
        x: number, y: number, 
        width: number, height: number, name: string, 
        fillColor: number, selected?: boolean, fillAlpha?:number | undefined) {

    return this.displayList.add(new FileContainer(this.scene, x, y, width, height, name, fillColor, selected))
})