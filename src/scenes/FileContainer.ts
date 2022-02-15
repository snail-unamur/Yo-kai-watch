import Phaser from "phaser";

import { ConstantsTiles } from '~/utils/Const'

declare global {
    namespace Phaser.GameObjects {
        interface GameObjectFactory {
            fileContainer(x: number, y: number, width: number, height: number, name: string, fillColor?: number, selected?: boolean, nbChildren?:number): FileContainer
        }
    }
}

export default class FileContainer extends Phaser.GameObjects.Container{
    static readonly ANIMATION_DURATION = 300
    name: string = "undefined"
    selected: boolean = false
    nameText: Phaser.GameObjects.Text
    rectangle: Phaser.GameObjects.Graphics
    image: Phaser.GameObjects.Image
    arrow?: Phaser.GameObjects.Rectangle
    isTop: boolean = false

    nbChildren: number = 0

    animDuration: number = 0
    xDestination: number = 0
    yDestination: number = 0
    alphaDestination: number = 1
    alphaAnimDuration: number = 0
    scaleDestination: number = 1
    scaleAnimDuration: number = 0

    constructor(scene: Phaser.Scene, x: number, y: number, width: number, height: number, name: string, fillColor: number, selected: boolean = false, nbChildren:number = 0){
        super(scene, x, y)

        this.nbChildren = nbChildren

        this.xDestination = x
        this.yDestination = y

        this.name = name

        this.rectangle = new Phaser.GameObjects.Graphics(scene)
        this.rectangle.fillStyle(0x202121, 1)
        this.rectangle.fillRoundedRect(-width/2, -height/2 + 16, width, height,8)
        this.add(this.rectangle)
        //this.rectangle = new Phaser.GameObjects.Graphics(scene, 0, 16, width, height, 0x000000)

        this.selected = selected


        if(nbChildren > 0){
            this.image = new Phaser.GameObjects.Image(scene, 0, 16, 'big_demon_idle_anim_f1')
            let r = new Phaser.GameObjects.Graphics(scene)
            this.add(r)
            let textChildren = new Phaser.GameObjects.Text(scene, width*0.2, height/2 + 18, nbChildren.toString(), {}).setColor('white')
            this.add(textChildren)

            r.fillStyle(0x202121, 1)
            r.fillRoundedRect(width*0.2-7, height/2 + 16, textChildren.width + 14, 20, { tl: 0, tr: 0, bl: 8, br: 8 })

        } else {
            this.image = new Phaser.GameObjects.Image(scene, 0, 16, 'big_zombie_idle_anim_f1')

        }

        this.image.setScale(2)
        //this.image.setDisplaySize(width, height)
        this.add(this.image)

        this.nameText = new Phaser.GameObjects.Text(scene, - width / 2, - height / 2, name, {})
        this.nameText.setColor('white')
        this.add(this.nameText)

        this.setAlpha(0)
        this.alphaAnimDuration = FileContainer.ANIMATION_DURATION
        this.alphaDestination = 1

        this.setSelected(selected)
    }

    setIsTop(isTop:boolean=true){
        this.isTop = isTop
        this.setSelected(this.selected)
    }

    getName(): string {
        return this.name
    }

    update(t:number, dt:number) {
        super.update(t, dt)

        if(this.animDuration > dt){
            this.x = this.x + (this.xDestination - this.x) * (dt / this.animDuration)
            this.y = this.y + (this.yDestination - this.y) * (dt / this.animDuration)
        } else {
            this.x = this.xDestination
            this.y = this.yDestination
        }
        this.animDuration -= dt


        if(this.alphaAnimDuration > dt){
            this.setAlpha(this.alpha + (this.alphaDestination - this.alpha) * (dt / this.alphaAnimDuration))
        } else {
            this.setAlpha(this.alphaDestination)
        }
        this.alphaAnimDuration -= dt


        if(this.scaleAnimDuration > dt){
            this.setScale(this.scale + (this.scaleDestination - this.scale) * (dt / this.scaleAnimDuration))
        } else {
            this.setScale(this.scaleDestination)
        }
        this.scaleAnimDuration -= dt


    }

    setSelected(isSelected:boolean){
        this.selected = isSelected
        let scale_ = 1

        if(isSelected){
            //this.rectangle.strokeColor = 0xaaffaa
            //this.rectangle.isStroked = true
            this.setAlphaDestination(1)
            scale_ += 0.2
        } else {
            this.setAlphaDestination(0.4)

            //this.rectangle.alpha = 0.7
            //this.rectangle.isStroked = false
        }

        if(this.isTop){
            scale_ += 0.4
        }
        this.setScaleDestination(scale_)
    }

    setScaleDestination(scale:number){
        this.scaleAnimDuration = FileContainer.ANIMATION_DURATION/2
        this.scaleDestination = scale
    }

    setAlphaDestination(alpha:number){
        this.alphaAnimDuration = FileContainer.ANIMATION_DURATION
        this.alphaDestination = alpha
    }

    setDestination(x:number, y:number, animDuration: number = 100){
        this.xDestination = this.xDestination + x
        this.yDestination = this.yDestination + y
        this.animDuration = animDuration
    }
}

Phaser.GameObjects.GameObjectFactory.register('fileContainer', 
    function (this: Phaser.GameObjects.GameObjectFactory, 
        x: number, y: number, 
        width: number, height: number, name: string, 
        fillColor: number, selected?: boolean, nbChildren:number=0) {

    return this.displayList.add(new FileContainer(this.scene, x, y, width, height, name, fillColor, selected, nbChildren))
})